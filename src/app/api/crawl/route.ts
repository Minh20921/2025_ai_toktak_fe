// app/api/crawl/route.ts
import axios from 'axios';
import https from 'https';
import { getApiBaseUrl } from '../../../../function/common';

export const runtime = 'nodejs'; // ✅ BẮT BUỘC để sử dụng agent

const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const scraperDomains = [
      'https://s.click.aliexpress',
      'https://m.coupang.com',
      'https://ko.aliexpress.com',
      'https://www.coupang.com',
      'https://coupang.com',
      'https://domeggook.com',
    ];

    const api_url = getApiBaseUrl();


    const isScraperUrl = scraperDomains.some((domain) => url.startsWith(domain));

    const targetEndpoint = isScraperUrl
      ? api_url + '/api/v1/maker/create-scraper'
      : 'https://ecomerce.canvasee.com/info';

    const response = await axios.post(targetEndpoint,
      { url },
      {
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[crawl.error]', err);
    return new Response(JSON.stringify({ error: 'Crawl failed' }), {
      status: 500,
    });
  }
}
