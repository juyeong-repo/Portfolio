'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BlogPost {
  title: string;
  pubDate: string;
  link: string;
  description: string;
  thumbnail?: string;
}  

export default function Home() {

  const [darkMode, setDarkMode] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // 다크모드 설정 불러오기
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }

    // 블로그 RSS 피드 가져오기
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://juyeongpark.tistory.com/rss');
      const data = await response.json();
      
      if (data.status === 'ok') {
        // 최신 글 5개만 가져오기
        setBlogPosts(data.items.slice(0, 5));
      }
    } catch (error) {
      console.error('블로그 글을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
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

      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 왼쪽: 프로필 */}
          <div className="flex flex-col items-center">
          <Image 
            src="/profile.png" 
            alt="프로필"
            width={200}
            height={200}
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-lg mb-6"
          />
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            박주영
          </h1>
                      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Full Stack Developer
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/juyeong-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                GitHub
              </a>
              <a
                href="https://juyeongpark.tistory.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                Blog
              </a>
            </div>
          </div>

          {/* 오른쪽: 자기소개 요약 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              About Me
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                <strong className="text-gray-900 dark:text-white">함께 성장하는 개발자</strong>입니다. 
                팀의 목표를 우선하며, 동료들과 적극적으로 소통하고 협업합니다.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900 dark:text-white">클린 코드</strong>를 추구합니다. 
                6개월 후에도 이해하기 쉽고, 확장 가능한 구조를 설계합니다.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900 dark:text-white">성능 최적화</strong>에 진심입니다. 
                쿼리 개선으로 응답속도 70% 단축, 인덱스 설계로 대용량 데이터 처리 효율화 등 
                실질적인 개선 경험이 있습니다.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900 dark:text-white">설계부터 운영까지</strong> 책임집니다. 
                PG 시스템 전체 생명주기를 경험하며, 안정적인 서비스 운영 역량을 갖췄습니다.
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                TECH STACK
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">Java</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">Spring Boot</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">TypeScript</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">React</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">Next.js</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">NestJS</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">MySQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section - Hero 바로 아래로 이동 */}
      <section className="py-7 px-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Blog Posts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              기술 블로그 <span className="text-blue-600 dark:text-blue-400 font-bold">120+ 글</span> 작성 | 꾸준한 학습과 공유
            </p>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-400 py-8">
              블로그 글을 불러오는 중...
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="space-y-6">
              {/* 최신글 하이라이트 */}
              <a
                href={blogPosts[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-900 group"
              >
                <div className="flex items-start gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    최신글
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(blogPosts[0].pubDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {blogPosts[0].description?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </p>
              </a>

              {/* 최근 글 목록 */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                  최근 작성 글
                </h4>
                <div className="space-y-3">
                  {blogPosts.slice(1, 5).map((post, index) => (
                    <a
                      key={index}
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors group"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 2}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(post.pubDate).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  ))}
                </div>
                <a
                  href="https://juyeongpark.tistory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  블로그에서 더 많은 글 보기 →
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400 py-8">
              블로그 글을 불러올 수 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            About Me
          </h2>
          <div className="text-lg text-gray-700 dark:text-gray-300 space-y-4">
            <p className="font-semibold text-xl text-blue-600 dark:text-blue-400">
              코드는 유기적이며, 개발은 팀워크입니다. 동료와 함께 고민하며 최선의 방향을 찾아가는 과정이 개발의 본질이라 생각합니다.
            </p>
            <p>
              Java, Springboot, TypeScript, React, Next.js, NestJS, MySQL 등 다양한 스택을 기반으로
              PG 및 재정산 시스템을 설계부터 운영까지 전 과정에 걸쳐 주도적으로 참여해왔습니다.
            </p>
            <p>
              서비스의 구조적 안정성과 속도를 개선하기 위해 실행 계획 분석, 인덱스 최적화, 쿼리 리팩토링 등
              다양한 방식으로 성능을 지속적으로 개선해왔으며, 실제로 수차례 눈에 띄는 성능 향상을 이끌어냈습니다.
            </p>
            <p>
              업무 외 시간에도 꾸준히 CS, 시스템 설계, 자바, JPA 등 다양한 주제로 스터디를 주도하거나 참여하고,
              기술 블로그 120편 이상을 작성하며 기록하고 공유하는 습관을 이어가고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section 
      <section className="py-20 px-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            About Me
          </h2>
          <div className="text-lg text-gray-700 dark:text-gray-300 space-y-4">
            <p className="font-semibold text-xl text-blue-600 dark:text-blue-400">
              "코드는 유기적이며, 개발은 팀워크입니다. 동료와 함께 고민하며 최선의 방향을 찾아가는 과정이 개발의 본질이라 생각합니다."
            </p>
            <p>
              Java, Springboot, TypeScript, React, Next.js, NestJS, MySQL 등 다양한 스택을 기반으로
              PG 및 재정산 시스템을 설계부터 운영까지 전 과정에 걸쳐 주도적으로 참여해왔습니다.
            </p>
            <p>
              서비스의 구조적 안정성과 속도를 개선하기 위해 실행 계획 분석, 인덱스 최적화, 쿼리 리팩토링 등
              다양한 방식으로 성능을 지속적으로 개선해왔으며, 실제로 수차례 눈에 띄는 성능 향상을 이끌어냈습니다.
            </p>
            <p>
              업무 외 시간에도 꾸준히 CS, 시스템 설계, 자바, JPA 등 다양한 주제로 스터디를 주도하거나 참여하고,
              기술 블로그 120편 이상을 작성하며 기록하고 공유하는 습관을 이어가고 있습니다.
            </p>
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section className="py-20 px-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Contact
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900 dark:text-white w-24">Email</span>
              <a
                href="mailto:juyeong.park.tech@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                juyeong.park.tech@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900 dark:text-white w-24">Phone</span>
              <span className="text-gray-700 dark:text-gray-300">010-5407-6392</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900 dark:text-white w-24">Blog</span>
              <a
                href="https://juyeongpark.tistory.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                juyeongpark.tistory.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900 dark:text-white w-24">GitHub</span>
              <a
                href="https://github.com/juyeong-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                github.com/juyeong-repo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="py-20 px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
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
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">Node.js</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">NestJS</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">TypeScript</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">Next.js</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">MySQL</span>
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Projects
          </h2>
          
          <div className="space-y-8">
            {/* Show Me the Movie */}
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
        <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
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