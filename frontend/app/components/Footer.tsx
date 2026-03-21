'use client'

export default function Footer() {
  return (
    <div className="pt-12 flex flex-col items-center justify-center gap-4 text-center border-t border-stone-200/50 dark:border-stone-800/50 mt-8">
      <p className="font-body text-xs uppercase tracking-widest text-stone-400">
        © 2026 Canadian Philanthropy Archive. All rights reserved. Data sourced from CRA.
      </p>
      <div className="flex gap-4">
        <a
          className="font-body text-xs uppercase tracking-widest text-stone-400 hover:text-red-900 transition-all cursor-pointer"
          href="#"
        >
          Privacy Policy
        </a>
        <a
          className="font-body text-xs uppercase tracking-widest text-stone-400 hover:text-red-900 transition-all cursor-pointer"
          href="#"
        >
          Terms of Service
        </a>
        <a
          className="font-body text-xs uppercase tracking-widest text-stone-400 hover:text-red-900 transition-all cursor-pointer"
          href="#"
        >
          Contact Us
        </a>
      </div>
    </div>
  )
}
