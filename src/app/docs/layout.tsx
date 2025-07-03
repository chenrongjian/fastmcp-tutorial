'use client';
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { mdFiles } from "@/lib/constants";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link'

// 分组英文前缀到中文
const groupNameMap: Record<string, string> = {
  getting: "快速开始",
  changelog: "更新日志",
  clients: "客户端",
  servers: "服务器",
  integrations: "集成",
  tutorials: "教程",
  community: "社区",
  sdk: "SDK参考",
};

// 文件名到中文标题
const fileNameToTitle = (file: string) => {
  if (file === "changelog.md") return "更新日志";
  if (file.startsWith("getting-started")) return "快速开始";
  if (file.startsWith("clients-auth-bearer")) return "客户端/认证-Bearer";
  if (file.startsWith("clients-auth")) return "客户端/认证";
  if (file.startsWith("clients-client")) return "客户端/基础用法";
  if (file.startsWith("clients-overview")) return "客户端/概览";
  if (file.startsWith("clients-transports")) return "客户端/传输";
  if (file.startsWith("community-showcase")) return "社区/展示";
  if (file.startsWith("integrations-anthropic")) return "集成/Anthropic";
  if (file.startsWith("integrations-claude-desktop")) return "集成/Claude Desktop";
  if (file.startsWith("integrations-contrib")) return "集成/贡献";
  if (file.startsWith("integrations-gemini")) return "集成/Gemini";
  if (file.startsWith("integrations-openai")) return "集成/OpenAI";
  if (file.startsWith("servers-auth-bearer")) return "服务器/认证-Bearer";
  if (file.startsWith("servers-composition")) return "服务器/组合";
  if (file.startsWith("servers-context")) return "服务器/上下文";
  if (file.startsWith("servers-fastmcp")) return "服务器/FastMCP";
  if (file.startsWith("servers-middleware")) return "服务器/中间件";
  if (file.startsWith("servers-overview")) return "服务器/概览";
  if (file.startsWith("servers-prompts")) return "服务器/提示词";
  if (file.startsWith("servers-proxy")) return "服务器/代理";
  if (file.startsWith("servers-resources")) return "服务器/资源";
  if (file.startsWith("servers-tools")) return "服务器/工具";
  if (file.startsWith("servers-types")) return "服务器/类型";
  if (file.startsWith("servers-openapi")) return "服务器/OpenAPI";
  if (file.startsWith("tutorials-create-mcp-server")) return "教程/创建MCP服务器";
  if (file.startsWith("tutorials-mcp")) return "教程/MCP教程";
  if (file.startsWith("tutorials-rest-api")) return "教程/创建REST API";
  if (file.startsWith("sdk-utilities-types")) return "SDK/工具-类型";
  if (file.startsWith("sdk-utilities-openapi")) return "SDK/工具-OpenAPI";
  if (file.startsWith("sdk-utilities-mcp_config")) return "SDK/工具-mcp_config";
  if (file.startsWith("sdk-utilities-logging")) return "SDK/工具-日志";
  if (file.startsWith("sdk-utilities-json_schema")) return "SDK/工具-JSON Schema";
  if (file.startsWith("sdk-utilities-http")) return "SDK/工具-HTTP";
  if (file.startsWith("sdk-utilities-exceptions")) return "SDK/工具-异常";
  if (file.startsWith("sdk-utilities-components")) return "SDK/工具-组件";
  if (file.startsWith("sdk-utilities-cache")) return "SDK/工具-缓存";
  if (file.startsWith("sdk-utilities-init")) return "SDK/工具-初始化";
  if (file.startsWith("sdk-tools-tool_manager")) return "SDK/工具管理器";
  if (file.startsWith("sdk-tools-tool")) return "SDK/工具";
  if (file.startsWith("sdk-tools-init")) return "SDK/工具初始化";
  if (file.startsWith("sdk-server-proxy")) return "SDK/服务器-代理";
  if (file.startsWith("sdk-server-openapi")) return "SDK/服务器-OpenAPI";
  if (file.startsWith("sdk-server-middleware")) return "SDK/服务器-中间件";
  if (file.startsWith("sdk-server-http")) return "SDK/服务器-HTTP";
  if (file.startsWith("sdk-server-dependencies")) return "SDK/服务器-依赖";
  if (file.startsWith("sdk-server-context")) return "SDK/服务器-上下文";
  if (file.startsWith("sdk-server-auth-providers-in_memory")) return "SDK/服务器认证-内存";
  if (file.startsWith("sdk-server-auth-providers-bearer_env")) return "SDK/服务器认证-Bearer环境";
  if (file.startsWith("sdk-server-auth-providers-bearer")) return "SDK/服务器认证-Bearer";
  if (file.startsWith("sdk-server-auth-providers-init")) return "SDK/服务器认证-初始化";
  if (file.startsWith("sdk-server-auth-auth")) return "SDK/服务器认证";
  if (file.startsWith("sdk-server-auth-init")) return "SDK/服务器认证-初始化";
  if (file.startsWith("sdk-server-init")) return "SDK/服务器初始化";
  if (file.startsWith("sdk-resources-types")) return "SDK/资源-类型";
  if (file.startsWith("sdk-resources-template")) return "SDK/资源-模板";
  if (file.startsWith("sdk-resources-resource-manager")) return "SDK/资源-管理器";
  if (file.startsWith("sdk-resources-resource")) return "SDK/资源";
  if (file.startsWith("sdk-resources-init")) return "SDK/资源初始化";
  if (file.startsWith("sdk-prompts-prompt-manager")) return "SDK/提示词-管理器";
  if (file.startsWith("sdk-prompts-prompt")) return "SDK/提示词";
  if (file.startsWith("sdk-prompts-init")) return "SDK/提示词初始化";
  if (file.startsWith("sdk-client-transports")) return "SDK/客户端-传输";
  if (file.startsWith("sdk-client-sampling")) return "SDK/客户端-采样";
  if (file.startsWith("sdk-client-roots")) return "SDK/客户端-根";
  if (file.startsWith("sdk-client-progress")) return "SDK/客户端-进度";
  if (file.startsWith("sdk-client-oauth-callback")) return "SDK/客户端-OAuth回调";
  if (file.startsWith("sdk-client-logging")) return "SDK/客户端-日志";
  if (file.startsWith("sdk-client-client")) return "SDK/客户端";
  if (file.startsWith("sdk-client-auth-oauth")) return "SDK/客户端认证-OAuth";
  if (file.startsWith("sdk-client-auth-bearer")) return "SDK/客户端认证-Bearer";
  if (file.startsWith("sdk-client-auth-init")) return "SDK/客户端认证-初始化";
  if (file.startsWith("sdk-client-init")) return "SDK/客户端初始化";
  if (file.startsWith("sdk-cli-run")) return "SDK/命令行-运行";
  if (file.startsWith("sdk-cli-cli")) return "SDK/命令行";
  if (file.startsWith("sdk-cli-claude")) return "SDK/命令行-Claude";
  if (file.startsWith("sdk-cli-init")) return "SDK/命令行初始化";
  if (file.startsWith("sdk-settings")) return "SDK/设置";
  if (file.startsWith("sdk-exceptions")) return "SDK/异常";
  return file.replace(".md", "");
};

function groupFiles(files: string[]) {
  const groups: Record<string, string[]> = {};
  files.forEach((file) => {
    let prefix = file.split("-")[0];
    if (file === "changelog.md") prefix = "changelog";
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(file);
  });
  return groups;
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const groups = groupFiles(mdFiles);

  // 从路径获取当前文件名
  const currentFile = pathname.replace('/docs/', '') + '.md';

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    setSidebarOpen(window.innerWidth > 768); // Set initial sidebar state based on screen width
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 处理移动端侧边栏
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (sidebarOpen && isMobile) {
        document.body.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('sidebar-open');
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('sidebar-open');
        document.body.style.overflow = '';
      }
    };
  }, [sidebarOpen, isMobile]);

  const handleFileClick = (file: string) => {
    const path = file.replace('.md', '');
    router.push(`/docs/${path}`);
    if (isMobile) setSidebarOpen(false);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-[#111] border-r border-white/5">
        {/* Back to home button */}
        <div className="h-12 border-b border-white/5 flex items-center px-4">
          <Link
            href="/"
            className={`flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors group ${
              isActive('/') ? 'text-white' : ''
            }`}
          >
            <FiChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            返回首页
          </Link>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-112px)] overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-6">
            {/* Quick Start Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-3 px-3">快速开始</h2>
              <div className="space-y-1">
                <Link
                  href="/docs"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  快速开始
                </Link>
                <Link
                  href="/docs/changelog"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/changelog') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  更新日志
                </Link>
              </div>
              </div>
              
            {/* Client Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-3 px-3">客户端</h2>
              <div className="space-y-1">
                <Link
                  href="/docs/clients-overview"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/clients-overview') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  客户端/概览
                </Link>
                <Link
                  href="/docs/clients-auth"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/clients-auth') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  客户端/认证
                </Link>
                <Link
                  href="/docs/clients-auth-bearer"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/clients-auth-bearer') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  客户端/认证-Bearer
                </Link>
                <Link
                  href="/docs/clients-client"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/clients-client') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  客户端/基础用法
                </Link>
                <Link
                  href="/docs/clients-transports"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/clients-transports') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  客户端/传输
                </Link>
                <Link
                  href="/docs/clients-advanced-features"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/clients-advanced-features') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  客户端/高级特性
                </Link>
                      </div>
                    </div>

            {/* Server Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-3 px-3">服务端</h2>
              <div className="space-y-1">
                <Link
                  href="/docs/servers-overview"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/servers-overview') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  服务端/概览
                </Link>
                <Link
                  href="/docs/servers-fastmcp"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/servers-fastmcp') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  服务端/FastMCP
                </Link>
                <Link
                  href="/docs/servers-auth-bearer"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/servers-auth-bearer') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  服务端/认证-Bearer
                </Link>
                <Link
                  href="/docs/servers-composition"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/servers-composition') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  服务端/组合
                </Link>
                <Link
                  href="/docs/servers-middleware"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/servers-middleware') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  服务端/中间件
                </Link>
                <Link
                  href="/docs/servers-openapi"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/servers-openapi') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  服务端/OpenAPI
                </Link>
              </div>
            </div>

            {/* SDK Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-3 px-3">SDK</h2>
              <div className="space-y-1">
                <Link
                  href="/docs/sdk-settings"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-settings') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/设置
                </Link>
                <Link
                  href="/docs/sdk-exceptions"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-exceptions') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/异常
                </Link>
                {/* Server */}
                <Link
                  href="/docs/sdk-server-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/初始化
                </Link>
                <Link
                  href="/docs/sdk-server-http"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-http') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/HTTP
                </Link>
                <Link
                  href="/docs/sdk-server-middleware"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-middleware') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/中间件
                </Link>
                <Link
                  href="/docs/sdk-server-dependencies"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-dependencies') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/依赖
                </Link>
                <Link
                  href="/docs/sdk-server-context"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-context') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/上下文
                </Link>
                <Link
                  href="/docs/sdk-server-proxy"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-proxy') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/代理
                </Link>
                <Link
                  href="/docs/sdk-server-openapi"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-openapi') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/OpenAPI
                </Link>
                {/* Auth */}
                <Link
                  href="/docs/sdk-server-auth-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-auth-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/认证/初始化
                </Link>
                <Link
                  href="/docs/sdk-server-auth-auth"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-auth-auth') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/认证/认证
                </Link>
                <Link
                  href="/docs/sdk-server-auth-providers-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-auth-providers-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/认证/提供者/初始化
                </Link>
                <Link
                  href="/docs/sdk-server-auth-providers-bearer"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-auth-providers-bearer') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/认证/提供者/Bearer
                </Link>
                <Link
                  href="/docs/sdk-server-auth-providers-bearer_env"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-auth-providers-bearer_env') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/认证/提供者/Bearer环境变量
                </Link>
                <Link
                  href="/docs/sdk-server-auth-providers-in_memory"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-server-auth-providers-in_memory') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/服务端/认证/提供者/内存
                </Link>
                {/* Client */}
                <Link
                  href="/docs/sdk-client-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/初始化
                </Link>
                <Link
                  href="/docs/sdk-client-client"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-client') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/客户端
                </Link>
                <Link
                  href="/docs/sdk-client-logging"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-logging') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/日志
                </Link>
                <Link
                  href="/docs/sdk-client-progress"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-progress') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/进度
                </Link>
                <Link
                  href="/docs/sdk-client-roots"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-roots') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/根目录
                </Link>
                <Link
                  href="/docs/sdk-client-sampling"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-sampling') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/采样
                </Link>
                <Link
                  href="/docs/sdk-client-transports"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-transports') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/传输
                </Link>
                {/* Client Auth */}
                <Link
                  href="/docs/sdk-client-auth-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-auth-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/认证/初始化
                </Link>
                <Link
                  href="/docs/sdk-client-auth-bearer"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-auth-bearer') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/认证/Bearer
                </Link>
                <Link
                  href="/docs/sdk-client-auth-oauth"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-auth-oauth') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/认证/OAuth
                </Link>
                <Link
                  href="/docs/sdk-client-oauth-callback"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-client-oauth-callback') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/客户端/OAuth回调
                </Link>
                {/* Tools */}
                <Link
                  href="/docs/sdk-tools-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-tools-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具/初始化
                </Link>
                <Link
                  href="/docs/sdk-tools-tool"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-tools-tool') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具/工具
                </Link>
                <Link
                  href="/docs/sdk-tools-tool_manager"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-tools-tool_manager') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具/工具管理器
                </Link>
                {/* Resources */}
                <Link
                  href="/docs/sdk-resources-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-resources-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/资源/初始化
                </Link>
                <Link
                  href="/docs/sdk-resources-resource"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-resources-resource') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/资源/资源
                </Link>
                <Link
                  href="/docs/sdk-resources-resource-manager"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-resources-resource-manager') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/资源/资源管理器
                </Link>
                <Link
                  href="/docs/sdk-resources-template"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-resources-template') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/资源/模板
                </Link>
                <Link
                  href="/docs/sdk-resources-types"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-resources-types') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/资源/类型
                </Link>
                {/* Prompts */}
                <Link
                  href="/docs/sdk-prompts-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-prompts-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/提示/初始化
                </Link>
                <Link
                  href="/docs/sdk-prompts-prompt"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-prompts-prompt') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/提示/提示
                </Link>
                <Link
                  href="/docs/sdk-prompts-prompt-manager"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-prompts-prompt-manager') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/提示/提示管理器
                </Link>
                {/* Utilities */}
                <Link
                  href="/docs/sdk-utilities-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/初始化
                </Link>
                <Link
                  href="/docs/sdk-utilities-cache"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-cache') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/缓存
                </Link>
                <Link
                  href="/docs/sdk-utilities-components"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-components') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/组件
                </Link>
                <Link
                  href="/docs/sdk-utilities-exceptions"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-exceptions') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/异常
                </Link>
                <Link
                  href="/docs/sdk-utilities-http"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-http') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/HTTP
                </Link>
                <Link
                  href="/docs/sdk-utilities-json_schema"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-json_schema') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/JSON Schema
                </Link>
                <Link
                  href="/docs/sdk-utilities-logging"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-logging') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/日志
                </Link>
                <Link
                  href="/docs/sdk-utilities-mcp_config"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-mcp_config') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/MCP配置
                </Link>
                <Link
                  href="/docs/sdk-utilities-openapi"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-openapi') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/OpenAPI
                </Link>
                <Link
                  href="/docs/sdk-utilities-types"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-utilities-types') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/工具集/类型
                </Link>
              </div>
            </div>

            {/* CLI Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-3 px-3">CLI</h2>
              <div className="space-y-1">
                <Link
                  href="/docs/sdk-cli-init"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-cli-init') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/CLI/初始化
                </Link>
                <Link
                  href="/docs/sdk-cli-cli"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-cli-cli') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/CLI/命令行
                </Link>
                <Link
                  href="/docs/sdk-cli-run"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-cli-run') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/CLI/运行
                </Link>
                <Link
                  href="/docs/sdk-cli-claude"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/sdk-cli-claude') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  SDK/CLI/Claude
                </Link>
          </div>
      </div>

            {/* Integrations Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-3 px-3">集成</h2>
              <div className="space-y-1">
                <Link
                  href="/docs/integrations-openai"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/integrations-openai') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  集成/OpenAI
                </Link>
                <Link
                  href="/docs/integrations-anthropic"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/integrations-anthropic') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  集成/Anthropic
                </Link>
                <Link
                  href="/docs/integrations-gemini"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/integrations-gemini') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  集成/Gemini
                </Link>
                <Link
                  href="/docs/integrations-claude-desktop"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/integrations-claude-desktop') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  集成/Claude Desktop
                </Link>
              </div>
            </div>

            {/* Community Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-3 px-3">社区</h2>
              <div className="space-y-1">
                <Link
                  href="/docs/community-showcase"
                  className={`block px-3 py-2 text-[13px] rounded-md transition-all duration-300 ${
                    isActive('/docs/community-showcase') ? 'text-white bg-gradient-to-r from-white/10 to-transparent border-l-2 border-white/50 pl-4' : 'text-gray-400 hover:text-white hover:bg-gradient-to-r from-white/5 to-transparent hover:translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  社区展示
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
 