'use client';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { mdFiles } from "@/lib/constants";
import Home from "@/app/page";

export default function DocsPage() {
  const pathname = usePathname();
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // 从路径中获取文件名
        const filePath = `${pathname.replace('/docs/', '')}.md`;
        const res = await fetch(`/api/md/${filePath}`);
        if (!res.ok) throw new Error('Failed to load content');
        const text = await res.text();
        setHtml(text);
      } catch (error) {
        console.error('Error loading content:', error);
        setHtml("<p>加载失败</p>");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [pathname]);

  // 代码块复制功能
  useEffect(() => {
    if (!html) return;

    const addCopyButtons = () => {
      document.querySelectorAll('pre code').forEach((block) => {
        const pre = block.parentElement;
        if (!pre || pre.querySelector('.code-copy-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        btn.title = '复制代码';

        btn.onclick = async (e) => {
          e.preventDefault();
          try {
            await navigator.clipboard.writeText(block.textContent || '');
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            btn.title = '已复制!';
            setTimeout(() => {
              btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
              btn.title = '复制代码';
            }, 1200);
          } catch {
            btn.title = '复制失败';
          }
        };

        pre.appendChild(btn);
      });
    };

    // 等待DOM渲染完成后添加按钮
    setTimeout(addCopyButtons, 0);

    // 监听内容变化
    const observer = new MutationObserver(addCopyButtons);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [html]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="prose-container pb-4">
      <article
        className="prose prose-invert prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
} 