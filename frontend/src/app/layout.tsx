import "../styles/tailwind.css"
import "../styles/global.css"
import "../styles/theme.css"
import "../styles/components.css"
import "../styles/forms.css"
import "../styles/tables.css"


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