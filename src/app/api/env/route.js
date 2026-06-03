import { NextResponse } from 'next/server'

export function GET() {
  const internalUrls = Object.fromEntries(
    Object.entries(process.env)
      .filter(([k]) => k.endsWith('_INTERNAL_URL'))
  )
  return NextResponse.json({
    service: 'vanitum-test-nextjs',
    internal_urls: internalUrls,
  })
}
