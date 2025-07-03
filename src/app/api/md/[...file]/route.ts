import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { mdFiles } from '@/lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string[] } }
) {
  try {
    const filePath = params.file.join('/');
    
    // 验证文件是否在允许的列表中
    if (!mdFiles.includes(filePath)) {
      return NextResponse.redirect(new URL('/docs/getting-started-welcome', request.url));
    }

    // 读取文件内容
    const fullPath = path.join(process.cwd(), 'public', filePath);
    const content = await fs.readFile(fullPath, 'utf8');

    // 处理 Markdown
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .use(rehypeStringify)
      .process(content);

    // 返回处理后的 HTML
    return new NextResponse(String(result), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return NextResponse.redirect(new URL('/docs/getting-started-welcome', request.url));
  }
} 