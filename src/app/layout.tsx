import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FastMCP 中文教程',
  description: '构建 LLM 工具与上下文的下一代开源框架，为开发者提供极致的 MCP 体验。',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: 'black',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="bg-black antialiased">
      <body className={`${inter.className} text-white`}>
        <div className="h-screen flex flex-col overflow-hidden">
          <main className="flex-1 flex flex-col min-h-0">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
