import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Charity Search - Find Canadian Charities',
  description: 'Search and explore Canadian charities with detailed information and ratings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
