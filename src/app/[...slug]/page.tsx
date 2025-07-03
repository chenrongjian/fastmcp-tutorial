'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Home from "../page";

export default function CatchAllPage({ params }: { params: { slug: string[] } }) {
  const router = useRouter();
  const filePath = params.slug.join("/");
  const mdFile = filePath.endsWith('.md') ? filePath : `${filePath}.md`;

  // 如果是直接访问md文件，直接渲染Home组件
  if (filePath.endsWith('.md')) {
    return <Home key={mdFile} initialFile={mdFile} />;
  }

  // 如果不是.md结尾，重定向到带.md后缀的URL
  useEffect(() => {
    router.replace(`/${mdFile}`);
  }, [mdFile, router]);

  return null;
} 