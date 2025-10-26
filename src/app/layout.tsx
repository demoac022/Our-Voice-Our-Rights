import { Inter } from 'next/font/google'
import './globals.css'
import { LocaleProvider } from '@/context/LocaleContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Our Voice, Our Rights - MGNREGA Data Visualization',
  description: 'Making MGNREGA performance data accessible to rural Indian citizens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`h-full ${inter.className}`}>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}