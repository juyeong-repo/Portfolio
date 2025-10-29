import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://juyeongpark.tistory.com/rss', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('RSS fetch failed');
    }

    const xmlText = await response.text();
    
    // XML 파싱
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/g;
    const linkRegex = /<link>(.*?)<\/link>/g;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/g;
    const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>/g;

    const titles = [...xmlText.matchAll(titleRegex)].slice(1, 6); // 채널 title 제외, 5개만
    const links = [...xmlText.matchAll(linkRegex)].slice(1, 6);
    const pubDates = [...xmlText.matchAll(pubDateRegex)].slice(0, 5);
    const descriptions = [...xmlText.matchAll(descRegex)].slice(0, 5);

    const posts = titles.map((title, index) => ({
      title: title[1],
      link: links[index][1],
      pubDate: new Date(pubDates[index][1]).toLocaleDateString('ko-KR'),
      description: descriptions[index][1].replace(/<[^>]*>/g, '').substring(0, 100),
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Blog RSS fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}