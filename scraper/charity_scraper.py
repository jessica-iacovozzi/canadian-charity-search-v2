import requests
from bs4 import BeautifulSoup
import time
import re
from typing import List, Dict, Optional
from urllib.parse import urljoin
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.models import Charity, get_session, init_db, clean_db
from dotenv import load_dotenv

load_dotenv()

class CharityIntelligenceScraper:
    BASE_URL = "https://www.charityintelligence.ca"
    LISTING_URL = f"{BASE_URL}/charity-profiles/a-z-charity-listing"
    
    def __init__(self, delay: float = 1.0):
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def get_page(self, url: str) -> Optional[BeautifulSoup]:
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            time.sleep(self.delay)
            return BeautifulSoup(response.content, 'lxml')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def extract_star_rating(self, soup: BeautifulSoup) -> Optional[float]:
        try:
            rating_elem = soup.find('span', class_='rating_stars')
            if rating_elem and rating_elem.get('title'):
                title = rating_elem.get('title')
                match = re.search(r'(\d+)/5', title)
                if match:
                    return float(match.group(1))
        except Exception as e:
            print(f"Error extracting star rating: {e}")
        return None
    
    def extract_charity_details(self, url: str) -> Optional[Dict]:
        soup = self.get_page(url)
        if not soup:
            return None
        
        try:
            charity_data = {
                'link': url,
                'name': None,
                'star_rating': None,
                'slogan': None,
                'sector': None,
                'city': None,
                'province': None,
                'registration_number': None
            }
            
            title_elem = soup.find('h1', class_='sppb-addon-title')
            if title_elem:
                charity_data['name'] = title_elem.get_text(strip=True)
            
            charity_data['star_rating'] = self.extract_star_rating(soup)
            
            content_divs = soup.find_all('div', class_='sppb-addon-content')
            for div in content_divs:
                text = div.get_text(strip=True)
                
                link = div.find('a', href=re.compile(r'sectorsearch'))
                if link:
                    charity_data['sector'] = link.get_text(strip=True)
                
                if 'Charitable Reg. #:' in text:
                    reg_match = re.search(r'Charitable Reg\. #:(\d+\s*\d+\s*\d+\s*RR\d+)', text)
                    if reg_match:
                        charity_data['registration_number'] = reg_match.group(1).replace(' ', '')
            
            return charity_data if charity_data['name'] else None
            
        except Exception as e:
            print(f"Error extracting details from {url}: {e}")
            return None
    
    def get_charity_links_with_slogans(self, page_num: int = 1) -> List[Dict]:
        url = f"{self.LISTING_URL}?page={page_num}"
        soup = self.get_page(url)
        if not soup:
            return []
        
        charities = []
        charity_list = soup.find('ul', class_='charity_list')
        
        if charity_list:
            items = charity_list.find_all('li', class_='item')
            for item in items:
                link_elem = item.find('a', class_='title')
                slogan_elem = item.find('p', class_='tag')
                loc_elems = item.find_all('p', class_='loc')
                
                if link_elem and link_elem.get('href'):
                    full_url = urljoin(self.BASE_URL, link_elem.get('href'))
                    slogan = slogan_elem.get_text(strip=True) if slogan_elem else None
                    
                    city = None
                    province = None
                    
                    if len(loc_elems) >= 2:
                        location_text = loc_elems[1].get_text(strip=True)
                        if ',' in location_text:
                            parts = location_text.split(',')
                            city = parts[0].strip()
                            province = parts[1].strip()
                    
                    charities.append({
                        'url': full_url,
                        'slogan': slogan,
                        'city': city,
                        'province': province
                    })
        
        return charities
    
    def get_charity_links(self, page_num: int = 1) -> List[str]:
        charities = self.get_charity_links_with_slogans(page_num)
        return [c['url'] for c in charities]
    
    def scrape_all_charities(self, max_pages: Optional[int] = None, max_charities: Optional[int] = None, clean_db_first: bool = False):
        print("Initializing database...")
        init_db()
        
        if clean_db_first:
            print("\nCleaning database...")
            clean_db()
        
        db_session = get_session()
        
        page = 1
        total_scraped = 0
        
        try:
            while True:
                if max_pages and page > max_pages:
                    break
                
                if max_charities and total_scraped >= max_charities:
                    print(f"\nReached maximum of {max_charities} charities. Stopping.")
                    break
                
                print(f"\nScraping page {page}...")
                charities_info = self.get_charity_links_with_slogans(page)
                
                if not charities_info:
                    print(f"No more charities found on page {page}. Stopping.")
                    break
                
                print(f"Found {len(charities_info)} charities on page {page}")
                
                for idx, charity_info in enumerate(charities_info, 1):
                    if max_charities and total_scraped >= max_charities:
                        print(f"\nReached maximum of {max_charities} charities. Stopping.")
                        break
                    
                    link = charity_info['url']
                    slogan = charity_info['slogan']
                    city = charity_info.get('city')
                    province = charity_info.get('province')
                    
                    print(f"  [{idx}/{len(charities_info)}] Scraping: {link}")
                    
                    existing = db_session.query(Charity).filter_by(link=link).first()
                    if existing:
                        print(f"    Skipping (already exists)")
                        continue
                    
                    charity_data = self.extract_charity_details(link)
                    
                    if charity_data and charity_data['name']:
                        if slogan and not charity_data['slogan']:
                            charity_data['slogan'] = slogan
                        if city and not charity_data['city']:
                            charity_data['city'] = city
                        if province and not charity_data['province']:
                            charity_data['province'] = province
                        
                        charity = Charity(**charity_data)
                        db_session.add(charity)
                        db_session.commit()
                        total_scraped += 1
                        print(f"    Saved: {charity_data['name']}")
                    else:
                        print(f"    Failed to extract data")
                
                page += 1
                
        except KeyboardInterrupt:
            print("\n\nScraping interrupted by user")
        except Exception as e:
            print(f"\nError during scraping: {e}")
        finally:
            db_session.close()
            print(f"\n{'='*50}")
            print(f"Scraping completed!")
            print(f"Total charities scraped: {total_scraped}")
            print(f"{'='*50}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape charity data from Charity Intelligence')
    parser.add_argument('--max-charities', type=int, default=None, help='Maximum number of charities to scrape')
    parser.add_argument('--max-pages', type=int, default=None, help='Maximum number of pages to scrape')
    parser.add_argument('--clean-db', action='store_true', help='Clean database before scraping')
    parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests in seconds')
    
    args = parser.parse_args()
    
    scraper = CharityIntelligenceScraper(delay=args.delay)
    scraper.scrape_all_charities(
        max_pages=args.max_pages,
        max_charities=args.max_charities,
        clean_db_first=args.clean_db
    )
