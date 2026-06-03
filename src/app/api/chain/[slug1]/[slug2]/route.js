import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { slug1, slug2 } = params
  const envKey = slug1.toUpperCase().replace(/-/g, '_') + '_INTERNAL_URL'
  const targetUrl = process.env[envKey]

  if (!targetUrl) {
    return NextResponse.json({ error: `${envKey} not set` }, { status: 400 })
  }

  try {
    const res = await fetch(targetUrl.replace(/\/$/, '') + '/call/' + slug2)
    const data = await res.json()
    return NextResponse.json({
      caller: 'vanitum-test-nextjs',
      hop1: slug1,
      hop2: slug2,
      response: data,
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 })
  }
}
