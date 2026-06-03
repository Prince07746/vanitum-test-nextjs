import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'vanitum-test-nextjs',
    time: new Date().toISOString(),
  })
}
