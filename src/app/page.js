'use client'

import { useState } from 'react'
import styles from './page.module.css'

const SERVICES = [
  { label: 'Node.js API',     slug: 'vanitum-test-node',   color: '#68a063' },
  { label: 'Spring Boot API', slug: 'vanitum-test-spring', color: '#6db33f' },
  { label: 'Python API',      slug: 'vanitum-test-python',  color: '#3776ab' },
]

function ServiceCard({ svc }) {
  const [url, setUrl]         = useState('')
  const [callSlug, setCallSlug] = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function probe(path) {
    if (!url) return
    setLoading(true); setError(null); setResult(null)
    try {
      const r = await fetch(url.replace(/\/$/, '') + path)
      setResult(await r.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} style={{ borderLeftColor: svc.color }}>
        <span className={styles.dot} style={{ background: svc.color }} />
        <strong>{svc.label}</strong>
        <code className={styles.slug}>{svc.slug}</code>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.row}>
          <input className={styles.urlInput}
            placeholder={`https://${svc.slug}.yourdomain.com`}
            value={url} onChange={e => setUrl(e.target.value)} />
        </div>
        <div className={styles.btnRow}>
          <button onClick={() => probe('/health')} disabled={!url || loading}>/health</button>
          <button onClick={() => probe('/env')} disabled={!url || loading}>/env</button>
          <div className={styles.callRow}>
            <input className={styles.slugInput} placeholder="target-slug"
              value={callSlug} onChange={e => setCallSlug(e.target.value)} />
            <button onClick={() => probe(`/call/${callSlug}`)}
              disabled={!url || !callSlug || loading}>/call</button>
          </div>
        </div>
        {loading && <p className={`${styles.status} ${styles.loading}`}>Fetching...</p>}
        {error   && <p className={`${styles.status} ${styles.error}`}>{error}</p>}
        {result  && <pre className={styles.result}>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <h1>Vanitum Test Suite <span className={styles.badge}>Next.js</span></h1>
        <p>Enter each service's public URL and probe its endpoints to verify the platform.</p>
      </header>
      <main className={styles.grid}>
        {SERVICES.map(s => <ServiceCard key={s.slug} svc={s} />)}
      </main>
      <section className={styles.guide}>
        <h2>How to test inter-service communication</h2>
        <ol>
          <li>Deploy all three API services on Vanitum.</li>
          <li>On each app's Manage page, link the other two services.</li>
          <li>Redeploy after linking so the <code>*_INTERNAL_URL</code> env vars are injected.</li>
          <li>Use <strong>/call/[slug]</strong> — e.g. <code>/call/vanitum-test-python</code> —
            to make one service call another internally.</li>
          <li>Use <strong>/chain/[slug1]/[slug2]</strong> to test a two-hop chain.</li>
        </ol>
      </section>
    </div>
  )
}
