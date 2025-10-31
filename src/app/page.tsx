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
            <div className="lg:col-span-3 flex flex-col items-center justify-start">
              <Image 
                src="/profile.png" 
                alt="프로필"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-lg mb-3"
              />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                박주영
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 mb-4 text-center">
                Full Stack Developer
              </p>

              {/* Contact Info - 강조된 디자인 */}
              <div className="w-full max-w-[240px] space-y-3 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">PHONE</span>
                  </div>
                  <a 
                    href="tel:010-5407-6392"
                    className="text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    010-5407-6392
                  </a>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">EMAIL</span>
                  </div>
                  <a 
                    href="mailto:juyeong.park.tech@gmail.com"
                    className="text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition break-all"
                  >
                    juyeong.park.tech@gmail.com
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-col gap-2 w-full max-w-[240px]">
                <a
                  href="https://github.com/juyeong-repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition text-center text-sm font-medium"
                >
                  GitHub
                </a>
                <a
                  href="https://juyeongpark.tistory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition text-center text-sm font-medium"
                >
                  Blog
                </a>
                <a
                  href="https://www.linkedin.com/in/juyeong-park"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition text-center text-sm font-medium"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            {/* 오른쪽: About Me + Blog (9칸) */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* About Me */}
              <div className="bg-white dark:bg-gray-800 p-5 lg:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  About Me
                </h2>
                <div className="space-y-3 text-xs lg:text-sm text-gray-700 dark:text-gray-300">
                  <p className="leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">기획부터 운영까지 전체 생명주기를 책임지는 풀스택 개발자</strong>입니다. 
                    요구사항 분석, 설계, 개발, 배포, 운영의 전 과정을 주도하며 
                    비즈니스 문제를 기술로 해결합니다.
                  </p>
                  
                  <p className="leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">"개발자가 깊이 고민할수록 사용자는 더 편해진다"는 철학</strong>으로 개발합니다. 
                    서비스 성능 향상을 위해 전 스택을 깊이 파고들며, 병목 구간을 근본적으로 해결합니다. 
                    운영 중 발생하는 문제를 임시방편으로 넘기지 않고, 원인을 추적해 시스템적으로 개선합니다.
                  </p>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">스택 전반의 성능 개선 경험</p>
                    <ul className="list-disc list-inside space-y-1 text-xs lg:text-sm ml-2">
                      <li><strong>DB/프로시저:</strong> 쿼리 재설계로 응답 속도 70% 단축, 인덱스 설계로 대용량 데이터 처리 효율화</li>
                      <li><strong>API:</strong> 버저닝을 통한 지속적인 성능 개선 및 엔드포인트 구조 최적화</li>
                      <li><strong>Frontend:</strong> 가상화로 렌더링 속도 15배 향상, 공통 컴포넌트 및 라이브러리 최적화</li>
                      <li><strong>운영:</strong> 운영팀 정의 조건에 따른 이상 감지 시스템을 구축하고, Slack과 문자 알림으로 장애 즉시 대응</li>
                    </ul>
                  </div>

                  <p className="leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">주인의식을 가지고 일합니다.</strong> 
                    PG 시스템의 설계부터 운영까지 직접 참여하며, 연휴에도 즉시 대응 가능한 모니터링 체계를 마련했습니다. 
                    이를 통해 운영팀 요청을 90% 이상 감소시키는 등, 측정 가능한 비즈니스 임팩트를 만들어왔습니다.
                  </p>
                  
                  <p className="leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">함께 성장하는 개발자를 지향합니다.</strong> 
                    클린 코드를 추구하고, 팀과 적극적으로 소통하며 협업합니다. 
                    명확한 커뮤니케이션과 책임감 있는 태도로 팀 전체의 생산성과 품질을 높이는 것을 목표로 합니다.
                  </p>
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
              <div className="bg-white dark:bg-gray-800 p-5 lg:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
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
                      <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
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
                        className="block p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
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
                          <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
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
                PG(결제대행) 시스템 개발 및 운영
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>PG(결제대행) 시스템의 전반적인 개발 및 유지보수 담당</li>
                <li>가맹점/영업점 대상 정산 및 정기 보고 기능 개발</li>
                <li>관리자 및 가맹점이 이용하는 웹 서비스의 기능 개선 및 버그 대응</li>
                <li>결제 트랜잭션 처리 안정성을 높이기 위한 로직 개선 및 시스템 운영</li>
                <li>Hybrid App 개발 (WebView 기반)</li>
                <li>기획, 개발, 테스트, 운영까지 전 과정에 주도적으로 참여</li>
              </ul>
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Skills</h5>
                
                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  {/* Product Development */}
                  <div>
                    <h6 className="font-medium mb-2">🎯 Product Development</h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">요구사항 분석 및 기술 설계</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">데이터 모델링 및 스키마 설계</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">프로젝트 전체 사이클 관리</span>
                    </div>
                  </div>
                  
                  {/* Backend */}
                  <div>
                    <h6 className="font-medium mb-2">⚙️ Backend</h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">NestJS</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Node.js</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Express</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">MySQL</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Stored Procedure</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Query Optimization</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">REST API Design</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">AWS S3</span>
                    </div>
                  </div>
                  
                  {/* Frontend */}
                  <div>
                    <h6 className="font-medium mb-2">🎨 Frontend</h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">React</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Next.js</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">TypeScript</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Performance Optimization</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">React Query</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">MUI</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Tailwind CSS</span>
                    </div>
                  </div>
                  
                  {/* DevOps */}
                  <div>
                    <h6 className="font-medium mb-2">🚀 DevOps & Operations</h6>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Vercel</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">AWS</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">CI/CD</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">System Monitoring</span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">Troubleshooting</span>
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
                NFT 플랫폼 서버 개발
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>사용자 거래내역 (경매작품, 일반작품) API 개발</li>
                <li>사용자 보유작품 조회 및 작품 정보제공 API 개발</li>
                <li>사용자 프로필 (개인, 법인) 페이지 개발</li>
                <li>사용자 거래내역 쿼리 성능개선</li>
                <li>NFT 플랫폼 백오피스 API 개발 및 유지보수</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">Java</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">Spring Boot</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">JPA</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">MariaDB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <span className="text-gray-600 dark:text-gray-400">2023.02 - 진행 중</span>
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

      {/* Education Section */}
      <section className="py-20 px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Education
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                디지털컨버전스 기반 BackEnd중심, Framework 개발자 양성과정
              </h3>
              <p className="text-gray-600 dark:text-gray-400">비트캠프 | 2020.01 - 2020.07</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                블록체인 중급 개발 재직자 과정
              </h3>
              <p className="text-gray-600 dark:text-gray-400">서울 ICT 이노베이션 스퀘어 | 2022.05 - 2022.06</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language & Interpretation Section */}
      <section className="py-20 px-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Language Skills
          </h2>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  영어
                </h3>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  비즈니스 회화 가능
                </span>
              </div>
            </div>

            {/* 통역 경험 */}
            <div className="border-l-4 border-blue-600 pl-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  수원시청
                </h3>
                <span className="text-gray-600 dark:text-gray-400">2018.10</span>
              </div>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                수원시 FTA 권역개척 수출상담회 영어 통역
              </h4>
            </div>

            <div className="border-l-4 border-gray-400 pl-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  일산 KINTEX
                </h3>
                <span className="text-gray-600 dark:text-gray-400">2017.05</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                일산 PLAYX4 수출상담회 비즈니스 영어 통역
              </h4>
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