import React from 'react'
import { FiGithub, FiBook, FiHeart } from 'react-icons/fi'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer w-full border-t border-white/10 bg-black/30 backdrop-blur-xl box-border">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-2 md:flex md:items-center md:justify-between text-sm">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <a
            href="https://github.com/fastmcp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors duration-200 flex items-center gap-1"
          >
            GitHub
          </a>
          <span className="select-none">·</span>
          <a
            href="/docs"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            文档
          </a>
        </div>
        <div className="mt-3 md:mt-0 text-center text-sm text-gray-400">
          <span className="flex items-center justify-center gap-1">
            Made with
            <span className="text-pink-500 animate-pulse">♥</span>
            by FastMCP Team
          </span>
        </div>
      </div>
    </footer>
  )
}