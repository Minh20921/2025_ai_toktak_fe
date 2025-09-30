import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  try {

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }, // Tránh bị chặn request
    });

    if (!response.ok) throw new Error('Failed to fetch video');

    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');


    const stream = response.body; // Lấy dữ liệu theo dạng stream

    return new NextResponse(stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="video.mp4"',
        'Content-Length': contentLength || '', // Giữ nguyên độ dài file
      },
    });
  } catch (error) {
    console.error('❌ Lỗi tải video:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
