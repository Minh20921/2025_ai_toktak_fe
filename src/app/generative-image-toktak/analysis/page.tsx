// src/app/stats/page.tsx
import { promises as fs } from 'fs'
import path from 'path'

export const revalidate = 10 // 10초마다 자동 업데이트

type CountJson = {
  total: number
  date?: string
  lifetimeTotal: number
  clickButtonGenerate: number
  [k: string]: any
}

async function readCount(): Promise<CountJson> {
  const filePath = path.join(process.cwd(), 'public', 'gemini', 'count.json')
  const raw = await fs.readFile(filePath, 'utf8').catch(() => '{}')
  const json = JSON.parse(raw || '{}')
  return {
    total: Number.isFinite(Number(json.total)) ? Math.trunc(Number(json.total)) : 0,
    lifetimeTotal: Number.isFinite(Number(json.lifetimeTotal)) ? Math.trunc(Number(json.lifetimeTotal)) : 0,
    clickButtonGenerate: Number.isFinite(Number(json.clickButtonGenerate)) ? Math.trunc(Number(json.clickButtonGenerate)) : 0,
    date: typeof json.date === 'string' ? json.date : undefined,
    ...json,
  }
}

function Progress({ value, max = 1000 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>0</span>
        <span>{max.toLocaleString()}</span>
      </div>
      <div className="mt-1 h-3 w-full rounded-full bg-gray-800">
        <div
          className="h-3 rounded-full bg-blue-500 transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-right text-xs text-gray-400">{pct.toFixed(1)}%</div>
    </div>
  )
}

function Stat({
                label,
                value,
                hint,
              }: {
  label: string
  value: React.ReactNode
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </div>
  )
}

export default async function StatsPage() {
  const data = await readCount()
  const quota = 1000
  const remain = Math.max(0, quota - data.total)
  const reachedLimit = data.total >= quota

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">Toktak Generative — 통계</h1>
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="오늘 생성 수" value={data.total.toLocaleString()} hint={`일일 제한 ${quota}장`} />
        <Stat label="오늘 남은 수량" value={remain.toLocaleString()} hint={reachedLimit ? '제한 도달' : '아직 제한 미도달'} />
        <Stat label="누적 총합" value={data.lifetimeTotal.toLocaleString()} hint={'지금까지 생성된 이미지 총합'} />
        <Stat label="Generate 버튼 클릭 수" value={data.clickButtonGenerate.toLocaleString()} hint={'페이지 클릭 횟수'} />
      </section>

      <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">오늘의 할당량 진행 상황</h2>
          <div className={`rounded-full px-3 py-1 text-xs ${reachedLimit ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-200'}`}>
            {reachedLimit ? '1000장 모두 사용됨' : '제한 내 사용 중'}
          </div>
        </div>
        <div className="mt-4">
          <Progress value={data.total} max={quota} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-800/40 p-3 text-sm text-gray-300">
            <div>오늘 생성됨</div>
            <div className="text-lg font-semibold">{data.total.toLocaleString()} 장</div>
          </div>
          <div className="rounded-lg bg-gray-800/40 p-3 text-sm text-gray-300">
            <div>일일 제한</div>
            <div className="text-lg font-semibold">{quota.toLocaleString()} 장</div>
          </div>
          <div className="rounded-lg bg-gray-800/40 p-3 text-sm text-gray-300">
            <div>남은 수량</div>
            <div className="text-lg font-semibold">{remain.toLocaleString()} 장</div>
          </div>
        </div>
      </section>
    </main>
  )
}
