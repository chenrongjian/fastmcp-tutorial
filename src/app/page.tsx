'use client';
import Link from 'next/link'
import { FiBookOpen, FiGithub, FiUsers } from 'react-icons/fi'
import { ReactNode, useEffect, useState } from 'react'

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isTyping) {
      if (currentIndex < text.length) {
        // 打字过程
        timer = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }, 50)
      } else {
        // 打字完成，等待一段时间后开始删除
        timer = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      if (currentIndex > 0) {
        // 删除过程
        timer = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1))
          setCurrentIndex(prev => prev - 1)
        }, 30)
      } else {
        // 删除完成，等待一段时间后重新开始打字
        timer = setTimeout(() => {
          setIsTyping(true)
        }, 1000)
      }
    }

    return () => clearTimeout(timer)
  }, [currentIndex, isTyping, text])

  return (
    <span className="typewriter-text">
      {displayText}
      <span className="cursor">|</span>
    </span>
  )
}

interface HomeProps {
  initialFile?: string;
}

export default function Home({ initialFile }: HomeProps) {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center">
      {/* Enhanced Hero Background */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-black">
        <div className="h-[40rem] w-[40rem] bg-[radial-gradient(circle_at_center,rgba(0,140,255,0.3)_0%,transparent_60%)] opacity-60 blur-[120px] animate-pulse-slow" />
      </div>

      <div className="flex flex-col items-center justify-center gap-8 px-4 py-4">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg select-none">
            FastMCP 中文教程
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl text-center leading-relaxed min-h-[3.5rem]">
            <TypewriterText 
              text="构建 LLM 工具与上下文的下一代开源框架，为开发者提供极致的 "
            />
            <span className="text-white font-semibold">MCP</span>
            <TypewriterText text=" 体验。" />
          </p>
        </div>

        {/* Re-architected Card Grid */}
        <div className="home-cards-container">
          <HomeCard 
            href="/docs" 
            title="文档" 
            desc="快速上手与深度指南" 
            icon={<FiBookOpen size={24} />}
          />
          <HomeCard 
            href="https://github.com/fastmcp/fastmcp" 
            title="GitHub" 
            desc="Star & Fork FastMCP 源码" 
            icon={<FiGithub size={24} />}
            external 
          />
          <HomeCard 
            href="/docs/community-showcase" 
            title="社区" 
            desc="优秀案例与插件生态" 
            icon={<FiUsers size={24} />}
          />
        </div>
      </div>
    </div>
  )
}

function HomeCard({ href, title, desc, icon, external = false }: { href: string; title:string; desc: string; icon: ReactNode, external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="crystal-card"
    >
        <div className="icon-wrapper">
            {icon}
        </div>
        <div className="text-content">
            <h3>
                {title}
                <span>→</span>
            </h3>
            <p>{desc}</p>
        </div>
    </Link>
  )
}
