import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { I18nProvider } from './I18nProvider'
import { KioskProvider } from './KioskProvider'
import { AuthProvider } from './AuthProvider'
import { migrateStorage } from '../services/storage/migrateStorage'

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    migrateStorage()
  }, [])

  return (
    <ThemeProvider>
      <KioskProvider>
        <I18nProvider>
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </KioskProvider>
    </ThemeProvider>
  )
}
