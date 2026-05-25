import { Outlet } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { useKiosk } from '../../providers/KioskProvider'
import { KioskJoinQr } from '../kiosk/KioskJoinQr'
import { AuthTrigger } from '../auth/AuthTrigger'

export function AppShell() {
  const { kioskLayout } = useKiosk()

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-shell__main" id="main">
        <Outlet />
      </main>
      {kioskLayout ? <KioskJoinQr /> : null}
      <SiteFooter />
      <AuthTrigger />
    </div>
  )
}
