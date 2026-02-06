import "./globals.css";              // main global (Tailwind)
import "@/styles/global.css";        // extra global styles
import "@/styles/components.css";    // component-level styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
