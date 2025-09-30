import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

const FILE_PATH = path.join(process.cwd(), 'public', 'gemini', 'count.json')
const TMP_PATH = FILE_PATH + '.tmp'
const TZ = 'Asia/Seoul'

type CountJson = {
  total: number
  date?: string
  lifetimeTotal: number
  clickButtonGenerate: number
  [k: string]: any
}

function todayKR(): string {
  const d = new Date()
  const fmt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
  return fmt // dạng DD/MM/YYYY
}

async function atomicWrite(obj: CountJson) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true })
  await fs.writeFile(TMP_PATH, JSON.stringify(obj, null, 2), 'utf8')
  await fs.rename(TMP_PATH, FILE_PATH)
}

async function readJson(): Promise<CountJson> {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf8')
    const json = JSON.parse(raw || '{}')
    const total = Number.isFinite(Number(json.total)) ? Math.trunc(Number(json.total)) : 0
    const lifetimeTotal = Number.isFinite(Number(json.lifetimeTotal))
      ? Math.trunc(Number(json.lifetimeTotal))
      : 0
    const date = typeof json.date === 'string' ? json.date : undefined

    return { ...json, total, lifetimeTotal, date }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return { total: 0, lifetimeTotal: 0, date: todayKR() }
    }
    throw err
  }
}

async function ensureToday(): Promise<CountJson> {
  const now = todayKR()
  const current = await readJson()
  if (current.date !== now) {
    const reset = { ...current, total: 0, date: now }
    await atomicWrite(reset)
    return reset
  }
  if (!current.date) {
    const fixed = { ...current, date: now }
    await atomicWrite(fixed)
    return fixed
  }
  return current
}

export async function GET() {
  try {
    const json = await ensureToday()
    return NextResponse.json({
      total: json.total,
      date: json.date,
      lifetimeTotal: json?.lifetimeTotal,
      clickButtonGenerate: json?.clickButtonGenerate,
    })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const hasDelta = typeof body?.delta === 'number' && Number.isFinite(body.delta)
    const hasTotal = typeof body?.total === 'number' && Number.isFinite(body.total)

    if (!hasDelta && !hasTotal) {
      return NextResponse.json(
        { message: 'Body phải có delta:number hoặc total:number' },
        { status: 400 }
      )
    }

    const current = await ensureToday()

    if (current.total >= 1000 && hasDelta && body.delta > 0) {
      return NextResponse.json(
        {
          message: 'Giới hạn 1000 ảnh. Không thể tạo thêm.',
          total: current.total,
          date: current.date,
          lifetimeTotal: current?.lifetimeTotal,
        },
        { status: 403 }
      )
    }

    // Tính total mới theo yêu cầu
    let nextTotal = current.total
    if (hasTotal) nextTotal = Math.trunc(body.total)
    else if (hasDelta) nextTotal = Math.trunc(current.total + body.delta)

    if (!Number.isSafeInteger(nextTotal) || nextTotal < 0) {
      return NextResponse.json(
        { message: 'total phải là số nguyên an toàn và >= 0' },
        { status: 422 }
      )
    }

    let nextLifetime = current?.lifetimeTotal || 0
    if (hasDelta && body.delta > 0) {
      nextLifetime = Math.trunc(current.lifetimeTotal + body.delta)
      if (!Number.isSafeInteger(nextLifetime) || nextLifetime < 0) {
        return NextResponse.json(
          { message: 'lifetimeTotal overflow hoặc không hợp lệ' },
          { status: 422 }
        )
      }
    }
    const now = todayKR()
    const next: CountJson = {
      ...current,
      total: nextTotal,
      lifetimeTotal: nextLifetime,
      date: now,
    }

    await atomicWrite(next)
    return NextResponse.json({
      total: next.total,
      date: next.date,
      lifetimeTotal: next?.lifetimeTotal,
    })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Error' }, { status: 500 })
  }
}
