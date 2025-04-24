import type { Metadata } from 'next'
import './globals.css'
import { LogoRemover } from '@/components/logo-remover'
import { DevToolsRemover } from '@/components/dev-tools-remover'

export const metadata: Metadata = {
  title: 'Dashboard de Ventas',
  description: 'Dashboard para análisis de ventas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          /* Ocultar herramientas de Next.js globalmente */
          [data-nextjs-dialog],
          .nextjs-build-watcher,
          .__next-build-watcher,
          button#__nextjs {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
        `}} />
      </head>
      <body>
        {children}
        <LogoRemover />
        <DevToolsRemover />
      </body>
    </html>
  )
}
