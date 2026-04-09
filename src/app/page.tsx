'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState(false);

  useEffect(() => {
    // 다크모드 설정 불러오기
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }

    // RSS 피드 불러오기
    fetchBlogPosts();
  }, []);

const fetchBlogPosts = async () => {
  try {
    // localStorage 안전하게 사용
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem('blogPosts');
      const cachedTime = localStorage.getItem('blogPostsTime');
      const oneHour = 60 * 60 * 1000;

      if (cachedData && cachedTime && Date.now() - Number(cachedTime) < oneHour) {
        setBlogPosts(JSON.parse(cachedData));
        setBlogLoading(false);
        return;
      }
    }

    // API Route를 통해 RSS 피드 가져오기
    const response = await fetch('/api/blog');
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.details || 'API fetch failed');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // localStorage에 안전하게 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('blogPosts', JSON.stringify(data.posts));
      localStorage.setItem('blogPostsTime', String(Date.now()));
    }

    setBlogPosts(data.posts);
    setBlogLoading(false);
  } catch (error) {
    console.error('Blog RSS fetch error:', error);
    setBlogError(true);
    setBlogLoading(false);
  }
};

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* 다크모드 토글 버튼 */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        aria-label="다크모드 토글"
      >
        {darkMode ? (
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Hero Section - 프로필 + About Me + Blog 한 화면에 */}
      <section className="py-12 px-8 lg:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-[1800px] mx-auto">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
{/* 왼쪽: 프로필 (3칸) */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                {/* 프로필 사진 - 가로형 직사각 */}
                <div className="w-full aspect-[4/3] relative">
                  <Image
                    src="/profile.png"
                    alt="프로필"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 이름 + 직함 */}
                <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">박주영</h1>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    Backend Developer
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Data · Performance · Security
                  </p>
                </div>

                {/* Contact */}
                <div className="px-5 py-3 space-y-2.5 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:010-5407-6392" className="text-xs text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                      010-5407-6392
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:juyeong.park.tech@gmail.com" className="text-xs text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition break-all">
                      juyeong.park.tech@gmail.com
                    </a>
                  </div>
                </div>

                {/* Social Links */}
                <div className="px-5 py-3 flex flex-col gap-2">
                  <a
                    href="https://github.com/juyeong-repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://juyeongpark.tistory.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Blog
                  </a>
                  <a
                    href="https://www.linkedin.com/in/juyeong-park-877579206/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
            {/* 오른쪽: About Me + Blog (9칸) */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* About Me */}
              <div className="bg-white dark:bg-gray-800 p-5 lg:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 border-t-4 border-t-indigo-800 dark:border-t-indigo-400 transition-colors duration-300">
                <h2 className="text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">
                  About Me
                </h2>
                <div className="space-y-3 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                  <p className="leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">보안이 중요한 금융/결제 시스템에서 대용량 데이터 처리와 성능 최적화를 수행해온 백엔드 중심 개발자</strong>입니다.
                    요구사항 분석, 설계, 개발, 배포, 운영의 전 과정을 주도하며 비즈니스 문제를 기술로 해결합니다.
                    결제·금융 도메인에 강점을 두고 있으며, <strong className="text-gray-900 dark:text-white">일반 웹 서비스 전반(API 설계, 사용자 인증, 관리자 시스템, 모바일 웹)도 처음부터 끝까지 독립적으로 개발 가능</strong>합니다.
                  </p>

                  <p className="leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">&ldquo;개발자가 깊이 고민할수록 사용자는 더 편해진다&rdquo;는 철학</strong>으로 개발합니다.<br />
                    결제 및 정산 시스템을 개발하며 <strong className="text-gray-900 dark:text-white">개인정보 보호, 데이터 마스킹, 접근 제어</strong> 등 보안 요구사항을 반영한 시스템을 구축해왔습니다.
                  </p>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">스택 전반의 성능 개선 경험</p>
                    <ul className="list-disc list-inside space-y-1 text-sm lg:text-base ml-2">
                      <li><strong>DB/프로시저:</strong> 쿼리 재설계로 응답 속도 70% 단축, 인덱스 설계로 대용량 데이터 처리 효율화</li>
                      <li><strong>API:</strong> 버저닝을 통한 지속적인 성능 개선 및 엔드포인트 구조 최적화</li>
                      <li><strong>Frontend:</strong> 가상화로 렌더링 속도 15배 향상, 공통 컴포넌트 및 라이브러리 최적화</li>
                      <li><strong>운영:</strong> 운영팀 정의 조건에 따른 이상 감지 시스템을 구축하고, Slack과 문자 알림으로 장애 즉시 대응</li>
                    </ul>
                  </div>

                  <p className="leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">주인의식을 가지고 일합니다. </strong>
                    PG 시스템의 설계부터 운영까지 직접 참여하며, 연휴에도 즉시 대응 가능한 모니터링 체계를 마련했습니다.<br />
                    이를 통해 운영팀 요청을 90% 이상 감소시키는 등, 측정 가능한 비즈니스 임팩트를 만들어왔습니다.
                  </p>

                  <p className="leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">함께 성장하는 개발자를 지향합니다. </strong>
                    클린 코드를 추구하고, 팀과 적극적으로 소통하며 협업합니다.
                    영어 통번역 전공을 바탕으로 기술 문서 이해 및 글로벌 커뮤니케이션이 가능합니다.
                  </p>
                </div>

                {/* Key Strengths */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">KEY STRENGTHS</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">Backend (Java, Spring, Node.js)</span>
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">Large-scale Data Processing</span>
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">Query Optimization</span>
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">Security-aware Development</span>
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">System Monitoring & Troubleshooting</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    TECH STACK
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">TypeScript</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">NestJS</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">TypeORM</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">MySQL</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Oracle</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Node.js</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Java</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Spring Boot</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">JPA</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">React</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Next.js</span>
                  </div>
                </div>
              </div>

              {/* Blog */}
              <div className="bg-white dark:bg-gray-800 p-5 lg:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 border-t-4 border-t-indigo-800 dark:border-t-indigo-400 transition-colors duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300">
                    Recent Blog Posts
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">120+</span> 글
                  </p>
                </div>

                {/* 로딩 상태 */}
                {blogLoading && (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-3 bg-blue-50 dark:bg-gray-900 border border-blue-100 dark:border-gray-600 rounded-lg animate-pulse">
                        <div className="h-4 bg-blue-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-blue-100 dark:bg-gray-600 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* RSS 데이터 표시 */}
                {!blogLoading && !blogError && blogPosts.length > 0 && (
                  <div className="space-y-2">
                    {blogPosts.map((post, index) => (
                      <a
                        key={index}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-blue-50 dark:bg-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-100 dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs lg:text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {post.description}
                            </p>
                          </div>
                          <span className="text-xs text-blue-400 dark:text-gray-500 whitespace-nowrap">
                            {post.pubDate}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {/* 에러 시 Fallback - 블로그로 이동 */}
                {!blogLoading && (blogError || blogPosts.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      최신 글을 불러올 수 없습니다.
                    </p>
                    <a
                      href="https://juyeongpark.tistory.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-sm"
                    >
                      블로그 방문하기 →
                    </a>
                  </div>
                )}
                
                <a
                  href="https://juyeongpark.tistory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center py-2 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-xs lg:text-sm"
                >
                  블로그 전체 보기 →
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="py-20 px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Work Experience
          </h2>
          
          <div className="space-y-12">
            {/* 브라이트픽스 */}
            <div className="border-l-4 border-blue-600 pl-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  브라이트픽스
                </h3>
                <span className="text-gray-600 dark:text-gray-400">2023.11 - 재직 중</span>
              </div>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                PG(결제대행) 시스템 풀스택 개발자
              </h4>
              
              <div className="space-y-6">
                {/* 주요 성과 */}
                <div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3 inline-block">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">주요 성과</span>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>서비스 전체 쿼리 최적화</strong>로 응답속도 70% 단축 (3초 → 0.9초)</li>
                    <li>프로시저 구조 개선(1개 → 3개 분리) 및 조인 방식 변경으로 시스템 안정성 향상</li>
                    <li>가상화 기법 적용으로 <strong>대용량 데이터(27,000건) 렌더링 성능 15배 개선</strong> (3초 → 0.2초)</li>
                    <li>DOM 노드 최적화로 메모리 사용량 95% 감소 (200MB → 10MB)</li>
                    <li>가맹점/영업점 결제 및 정산 시스템 구축 전 과정(기획~배포) 참여</li>
                    <li>운영 중 발생한 사용자 불편을 기술적으로 분석·해결하며 비즈니스 개선에 기여</li>
                  </ul>
                </div>

                {/* 핵심 업무 */}
                <div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3 inline-block">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">핵심 업무</span>
                  </div>
                </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>PG 시스템 풀스택 개발</strong>: 설계부터 운영까지 전 과정 참여</li>
                    <li><strong>성능 최적화</strong>: MySQL 쿼리 튜닝, 인덱스 설계, 프론트엔드 렌더링 및 메모리 최적화</li>
                    <li><strong>정산/ 결제 시스템 구축 참여</strong>: 가맹점/영업점 대상 결제, 정산, 정기 보고 기능 개발 참여</li>
                    <li><strong>하이브리드 앱 개발</strong>: WebView 기반 모바일 앱 개발 및 플랫폼별 최적화</li>
                    <li><strong>시스템 안정화</strong>: 장애 모니터링, Slack/문자 알림 기반 대응 체계 구축</li>
                    <li><strong>관측성(Observability) 도입</strong>: Prometheus·Loki·Grafana 기반 메트릭/로그 수집 및 대시보드 구축, Kubernetes 환경에서 AWS 인프라와 연동</li>
                  </ul>
                </div>

                {/* Security Considerations */}
                <div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-3 mb-3 inline-block">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Security Considerations</span>
                  </div>
                </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>개인정보 및 결제 데이터 보호를 고려한 개발</li>
                    <li>데이터 마스킹 및 접근 제어 기반 설계 적용</li>
                    <li>로그 기반 이상 탐지 및 모니터링 시스템 구축</li>
                  </ul>
                </div>

                {/* 기술 스택 및 역량 */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Skills & Technical Competencies</h5>
                  
                  <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                    {/* Product Development */}
                    <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span>Product Development & Architecture</span>
                    </h6>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">요구사항 분석 및 기술 설계</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">데이터 모델링 및 스키마 설계</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">프로젝트 전체 사이클 경험</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">기획-개발-배포 전 과정 참여</span>
                      </div>
                    </div>
                    
                    {/* Backend */}
                    <div>
                      <h6 className="font-medium mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Backend Engineering</span>
                      </h6>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">NestJS</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Node.js</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Express</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">TypeScript</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">REST API Design</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Cron Job Scheduling</span>
                      </div>
                    </div>

                    {/* Database */}
                    <div>
                      <h6 className="font-medium mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                        <span>Database & Optimization</span>
                      </h6>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">MySQL</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Query Optimization (70% 성능 개선)</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Stored Procedure</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Index Design</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">JOIN 최적화</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">대용량 데이터 처리</span>
                      </div>
                    </div>
                    
                    {/* Frontend */}
                    <div>
                      <h6 className="font-medium mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <span>Frontend Development</span>
                      </h6>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">React</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Next.js</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">TypeScript</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Performance Optimization (15배 개선)</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Virtualization (react-window)</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">React Query</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">MUI</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Tailwind CSS</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">ag-Grid</span>
                      </div>
                    </div>
                    
                    {/* DevOps */}
                    <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span>DevOps & Cloud</span>
                    </h6>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Vercel</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">CI/CD</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">System Monitoring</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Troubleshooting</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">AWS (S3, EC2)</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Docker</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Kubernetes</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Linux</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Prometheus</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Loki</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Grafana</span>
                      </div>
                    </div>

                    {/* Security */}
                    <div>
                      <h6 className="font-medium mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-indigo-700 dark:text-indigo-300">Security</span>
                      </h6>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded text-xs">데이터 암호화/복호화</span>
                        <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded text-xs">개인정보 마스킹</span>
                        <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded text-xs">접근 제어 설계</span>
                        <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded text-xs">이상 탐지 모니터링</span>
                      </div>
                    </div>

                    {/* Communication */}
                    <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Collaboration & Documentation</span>
                    </h6>
                      <div className="flex flex-wrap gap-2">
                        {/* <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">기술 블로그 운영</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">기술 문서화</span> */}
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">업무 커뮤니케이션</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">고객 지원 (결제,정산 및 전체 시스템 오류 대응)</span> 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* 코어닥스 */}
          <div className="border-l-4 border-gray-400 pl-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                코어닥스
              </h3>
              <span className="text-gray-600 dark:text-gray-400">2022.04 - 2022.12</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
              NFT 플랫폼 백엔드 개발자
            </h4>

            <div className="space-y-6">
              {/* 주요 성과 */}
              <div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3 inline-block">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">주요 성과</span>
                  </div>
                </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>거래내역 쿼리 최적화</strong>로 사용자 조회 속도 개선</li>
                    <li><strong>사용자 마이페이지·잔고조회·거래내역 API</strong> 설계 및 구현</li>
                    <li><strong>가상화폐 거래소 연동 시스템</strong> 구축 (잔고 조회, 사용자 정보 동기화)</li>
                    <li><strong>백오피스 시스템</strong> 개발 및 운영 참여</li>
                    <li><strong>기획부터 배포·유지보수까지</strong> 전체 개발 사이클 수행</li>
                  </ul>
              </div>

              {/* 핵심 업무 */}
              <div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3 inline-block">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">핵심 업무</span>
                </div>
              </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">

                  <li>
                    <strong>거래 시스템 API 개발</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                      <li>경매/일반 작품 거래내역 조회 (입찰, 낙찰, 진행, 유찰 상태별 필터링)</li>
                      <li>결제 코인별 전일 종가 조회 및 원화 환산 기능</li>
                    </ul>
                  </li>

                  <li>
                    <strong>작품 관리 시스템 개발</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                      <li>보유 작품 조회 (좋아요순·최신순·가격순 정렬 및 검색)</li>
                      <li>관심 작품(좋아요) 기능 및 작품 정보 제공 API 구현</li>
                      <li>효율적인 페이징 및 다중 정렬 조건 처리</li>
                    </ul>
                  </li>

                  <li>
                    <strong>사용자 관리 시스템 구축</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                      <li>개인/법인 프로필 페이지 개발</li>
                      <li>개인정보 암호화·복호화 및 마스킹 처리</li>
                      <li>프로필·배경사진 업로드, 회원정보 변경 및 중복체크 기능 구현</li>
                    </ul>
                  </li>

                  <li>
                    <strong>가상화폐 거래소 연동 시스템 개발</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                      <li>실시간 사용자 잔고 조회 API (거래소 통신)</li>
                      <li>사용자 정보 동기화 및 DB 저장 로직 설계</li>
                    </ul>
                  </li>

                  <li>
                    <strong>백오피스 시스템 운영</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                      <li>관리자 공지사항 API 개발 및 유지보수</li>
                      <li>운영 효율화를 위한 관리 기능 개선</li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* 기술 스택 및 역량 */}
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Skills & Technical Competencies
                </h5>

                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  {/* Backend */}
                  <div>
                  <h6 className="font-medium mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Backend Engineering</span>
                  </h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Java</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Spring Boot</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Spring MVC</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Spring Data JPA</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">MyBatis</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">REST API Design</span>
                    </div>
                  </div>

                  {/* Database */}
                  <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      <span>Database & Optimization</span>
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">MariaDB</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Query Optimization</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">JPA Query Tuning</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Paging & Sorting</span>
                    </div>
                  </div>

                  {/* External Integration */}
                  <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>External Integration</span>
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">가상화폐 거래소 API 연동</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">실시간 데이터 동기화</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">환율 정보 처리</span>
                    </div>
                  </div>

                  {/* Security & Data */}
                  <div>
                  <h6 className="font-medium mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Security & Data Processing</span>
                  </h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">데이터 암호화/복호화</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">개인정보 마스킹</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">파일 업로드</span>
                    </div>
                  </div>

                  {/* Domain Knowledge */}
                  <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Domain Knowledge</span>
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">NFT Platform</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Auction System</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Digital Asset Management</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Cryptocurrency</span>
                    </div>
                  </div>

                  {/* Tools */}
                  <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Development Tools</span>
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Git</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Redmine</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Notion</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">STS</span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Visual Studio Code</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>
        </div>
      </section>


    {/* Education & Language Section - 한 행으로 배치 */}
    <section className="py-20 px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Education */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Education
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  디지털컨버전스 기반 BackEnd중심<br />Framework 개발자 양성과정
                </h3>
                <p className="text-gray-600 dark:text-gray-400">비트캠프 | 2020.01 - 2020.07</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  블록체인 중급 개발 재직자 과정
                </h3>
                <p className="text-gray-600 dark:text-gray-400">서울 ICT 이노베이션 스퀘어 | 2022.05 - 2022.06</p>
              </div>
            </div>
          </div>

          {/* Language Skills */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Language Skills
            </h2>

            <div className="space-y-6">
              {/* 영어 실력 강조 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    영어
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    비즈니스 수준
                  </span>
                </div>

                {/* 영어 실력 상세 */}
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span><strong>업무 커뮤니케이션</strong>: 영어로 의사소통 및 영문 이메일 작성 가능</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span><strong>기술 이해</strong>: 영문 기술 문서 및 API 문서 독해 가능</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span><strong>통역 경험</strong>: 해외 클라이언트 대상 비즈니스 통역 수행</span>
                  </div>
                </div>
              </div>

              {/* 통역 경험 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  통역 경력
                </h4>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="border-l-3 border-blue-600 pl-4">
                    <p className="font-medium">수원시 FTA 권역개척 수출상담회</p>
                    <p className="text-gray-600 dark:text-gray-400">수원시청 | 2018.10</p>
                  </div>
                  <div className="border-l-3 border-gray-400 pl-4">
                    <p className="font-medium">일산 PLAYX4 수출상담회</p>
                    <p className="text-gray-600 dark:text-gray-400">일산 KINTEX | 2017.05</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


    </div>
  </div>
</section>



      {/* Interest & Learning Section */}
      {/* <section className="py-12 px-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="border border-slate-200 dark:border-slate-600 border-t-4 border-t-indigo-800 dark:border-t-indigo-400 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4">Interest &amp; Learning</h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">▸</span>
                <span>Kafka 기반 이벤트 스트리밍 아키텍처 학습 중</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">▸</span>
                <span>대용량 로그 및 이벤트 처리 구조에 관심</span>
              </li>
            </ul>
          </div>
        </div>
      </section> */}

      {/* Projects Section */}
      <section className="py-20 px-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Projects
          </h2>
          <div className="grid gap-8">
            {/* 영화 예매 프로젝트 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Show Me the Movie
                </h3>
                <span className="text-gray-600 dark:text-gray-400">2020.05 - 2020.07</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                메가박스 사이트를 벤치마킹한 영화 예매 사이트. SQL View를 활용해 데이터를 효율적으로 불러오는 방법을 경험했습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>회원가입 기능 구현</li>
                <li>영화 목록 및 상세 페이지 구현</li>
                <li>예매 내역 및 취소 내역 관리</li>
                <li>ERD 설계 전담</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">Java</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">Spring MVC</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">MyBatis</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">Oracle</span>
              </div>
              <a
                href="https://github.com/juyeong-repo/spring-project"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on GitHub →
              </a>
            </div>

            {/* 블로그 프로젝트 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  YeongLog
                </h3>
                <span className="text-gray-600 dark:text-gray-400">2022.10 - 2022.12</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                JPA 학습을 위해 진행한 사이드 프로젝트로, 테이블 간 관계 설정 및 정규화 과정에서 데이터 모델링 능력을 향상시켰습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>로그인/회원가입 기능 구현</li>
                <li>게시글 CRUD API 개발</li>
                <li>관리자 공지사항 API 개발</li>
                <li>ERD 설계 및 프론트엔드 구현</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">Java</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">Spring Boot</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">JPA</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">MySQL</span>
              </div>
              <a
                href="https://github.com/juyeong-repo/yeongLog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on GitHub →
              </a>
            </div>

            {/* SNS 프로젝트 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Photogram
                </h3>
                <span className="text-gray-600 dark:text-gray-400">2023.02</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                인스타그램 웹 애플리케이션을 클론하는 프로젝트로, 효율적인 구조 설계와 예외 처리에 초점을 맞춰 개발하고 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>로그인, 회원가입, 회원정보 수정 기능 구현</li>
                <li>사용자 구독/구독취소 API 개발</li>
                <li>예외 처리 및 유틸 기능 분리 등 전체 구조 설계 참여</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">Java</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">Spring Boot</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">JPA</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">MySQL</span>
              </div>
              <a
                href="https://github.com/juyeong-repo/photogram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 bg-white dark:bg-gray-900 text-center transition-colors duration-300">
        <p className="text-gray-600 dark:text-gray-400">
          © 2025 Juyeong Park All rights reserved.
        </p>
      </footer>
    </div>
  );
}