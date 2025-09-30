import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const FILE_PATH = path.join(process.cwd(), 'public', 'gemini', 'count.json');
const TMP_PATH = FILE_PATH + '.tmp';

type CountJson = {
  total: number;
  date?: string;
  lifetimeTotal: number;
  clickButtonGenerate: number;
  [k: string]: any;
};

async function atomicWrite(obj: CountJson) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(TMP_PATH, JSON.stringify(obj, null, 2), 'utf8');
  await fs.rename(TMP_PATH, FILE_PATH);
}

async function readJson(): Promise<CountJson> {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf8');
    const json = JSON.parse(raw || '{}');

    const total = Number.isFinite(Number(json.total)) ? Math.trunc(Number(json.total)) : 0;
    const lifetimeTotal = Number.isFinite(Number(json.lifetimeTotal)) ? Math.trunc(Number(json.lifetimeTotal)) : 0;
    const clickButtonGenerate = Number.isFinite(Number(json.clickButtonGenerate))
      ? Math.trunc(Number(json.clickButtonGenerate))
      : 0;
    const date = typeof json.date === 'string' ? json.date : undefined;

    return { ...json, total, lifetimeTotal, clickButtonGenerate, date };
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return { total: 0, lifetimeTotal: 0, clickButtonGenerate: 0 };
    }
    throw err;
  }
}

export async function GET() {
  try {
    const json = await readJson();
    return NextResponse.json({ clickButtonGenerate: json?.clickButtonGenerate || 0 });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Error' }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const current = await readJson();
    const nextClick = (current?.clickButtonGenerate || 0) + 1;

    const next = { ...current, clickButtonGenerate: nextClick };
    await atomicWrite(next);

    return NextResponse.json({ clickButtonGenerate: next.clickButtonGenerate });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Error' }, { status: 500 });
  }
}
