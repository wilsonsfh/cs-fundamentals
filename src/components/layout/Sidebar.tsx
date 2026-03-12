'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, BookOpen, Library, Network, GraduationCap } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patterns', label: 'Patterns', icon: BookOpen },
  { href: '/trace', label: 'Trace', icon: Network },
  { href: '/study', label: 'Study', icon: GraduationCap },
  { href: '/cards', label: 'Cards', icon: Library },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold">CS Fundamentals</h1>
        <p className="text-xs text-muted-foreground mt-1">DSA Learning Platform</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t">
        <ThemeToggle />
      </div>
    </aside>
  )
}
