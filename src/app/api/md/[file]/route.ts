import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

export async function GET(req: NextRequest, context: { params: { file: string } }) {
  // Next.js 13+ API Route: context.params 需异步获取
  const { file } = await context.params;
  const filePath = path.join(process.cwd(), "public", file);
  
  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }
  
  const md = fs.readFileSync(filePath, "utf-8");
  
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, { behavior: 'append' })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(md);
    
    return new Response(String(result), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error('Markdown processing error:', error);
    return new Response("Processing error", { status: 500 });
  }
} 