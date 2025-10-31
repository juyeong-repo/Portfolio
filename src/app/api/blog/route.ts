import { NextResponse } from 'next/server';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXML = promisify(parseString);

// RSS 피드의 타입 정의
interface RSSItem {
  title: string[];
  link: string[];
  pubDate: string[];
  description: string[];
}

interface RSSChannel {
  item: RSSItem[];
}

interface RSSResult {
  rss: {
    channel: RSSChannel[];
  };
}

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export async function GET() {
  try {
    const response = await fetch('https://juyeongpark.tistory.com/rss', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    // any 대신 RSSResult 타입 사용
    const result = await parseXML(xmlText) as RSSResult;
    
    // any 대신 RSSItem 타입 사용
    const items: BlogPost[] = result.rss.channel[0].item.slice(0, 5).map((item: RSSItem) => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: new Date(item.pubDate[0]).toLocaleDateString('ko-KR'),
      description: item.description[0].replace(/<[^>]*>/g, '').substring(0, 100),
    }));

    return NextResponse.json({ posts: items });
  } catch (error) {
    console.error('Blog RSS fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}