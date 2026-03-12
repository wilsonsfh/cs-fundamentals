'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, BookOpen, Library, Network, GraduationCap } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/patterns', label: 'Patterns', icon: BookOpen },
  { href: '/trace', label: 'Trace', icon: Network },
  { href: '/study', label: 'Study', icon: GraduationCap },
  { href: '/cards', label: 'Cards', icon: Library },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
