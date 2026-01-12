import type React from "react"
import type { Metadata, Viewport } from "next"
import { Orbitron, Rajdhani } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { RegionProvider } from "@/lib/region-context"
import "./globals.css"

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
})

export const metadata: Metadata = {
  title: "AI Billing System | Touchless Checkout",
  description: "AI-powered automated billing and checkout system with touchless product scanning",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} ${rajdhani.variable} font-sans antialiased`}>
        <AuthProvider>
          <RegionProvider>{children}</RegionProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
