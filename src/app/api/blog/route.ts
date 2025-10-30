import { NextResponse } from 'next/server';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXML = promisify(parseString);

export async function GET() {
  try {
    const response = await fetch('https://juyeongpark.tistory.com/rss', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    const result: any = await parseXML(xmlText);
    
    const items = result.rss.channel[0].item.slice(0, 5).map((item: any) => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: new Date(item.pubDate[0]).toLocaleDateString('ko-KR'),
      description: item.description[0].replace(/<[^>]*>/g, '').substring(0, 100),
    }));

    return NextResponse.json({ posts: items });
  } catch (error) {
    console.error('Blog RSS fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' }, 
      { status: 500 }
    );
  }
}