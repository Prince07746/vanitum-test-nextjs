export const metadata = {
  title: 'Vanitum Test Suite',
  description: 'Next.js test application for Vanitum platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
