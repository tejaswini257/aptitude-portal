import type { Metadata } from "next"
import "../styles/tailwind.css"
import "../styles/global.css"
import "../styles/theme.css"
import "../styles/components.css"
import "../styles/forms.module.css"
import "../styles/tables.css"

export const metadata: Metadata = {
  title: "Aptitude Portal",
  description: "Role-based Aptitude & Recruitment Portal",
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
