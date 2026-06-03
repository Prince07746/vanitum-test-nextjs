import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { slug } = params
  const envKey = slug.toUpperCase().replace(/-/g, '_') + '_INTERNAL_URL'
  const targetUrl = process.env[envKey]

  if (!targetUrl) {
    return NextResponse.json({ error: `${envKey} not set` }, { status: 400 })
  }

  try {
    const res = await fetch(targetUrl.replace(/\/$/, '') + '/health')
    const data = await res.json()
    return NextResponse.json({
      caller: 'vanitum-test-nextjs',
      callee: slug,
      response: data,
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 })
  }
}
