# FastMCP 2.0 欢迎指南

[模型上下文协议](https://modelcontextprotocol.io/)（MCP）是一种全新的标准化方式，可为您的 LLM 提供上下文和工具，而 FastMCP 使构建 MCP 服务器和客户端变得简单直观。通过简洁的 Python 风格代码创建工具、公开资源、定义提示词等：

```python
from fastmcp import FastMCP

mcp = FastMCP("演示 🚀")

@mcp.tool
def add(a: int, b: int) -> int:
    """两数相加"""
    return a + b

if __name__ == "__main__":
    mcp.run()
```

## 超越协议

FastMCP 是使用模型上下文协议的标准框架。FastMCP 1.0 已于 2024 年整合到 [官方 MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) 中。

这是 FastMCP 2.0，**积极维护的版本**，提供了用于 MCP 生态系统的完整工具包。

FastMCP 2.0 拥有一系列全面的功能，远远超出了核心 MCP 规范，所有这些功能都旨在提供**最简单的生产路径**。其中包括部署、身份验证、客户端、服务器代理和组合、从 REST API 生成服务器、动态工具重写、内置测试工具、集成等。

准备好升级或开始使用了吗？请遵循 [安装说明](https://gofastmcp.com/getting-started/installation)，其中包括从官方 MCP SDK 升级的步骤。

## 什么是 MCP？

模型上下文协议允许您构建服务器，以安全、标准化的方式向 LLM 应用程序公开数据和功能。它通常被描述为“AI 的 USB-C 端口”，提供了一种统一的方式将 LLM 连接到它们可以使用的资源。可以将其简单地视为专门为 LLM 交互设计的 API。MCP 服务器可以：

- 通过“资源”（Resources）公开数据（类似于 GET 端点，用于将信息加载到 LLM 的上下文中）
- 通过“工具”（Tools）提供功能（类似于 POST 端点，用于执行代码或产生副作用）
- 通过“提示词”（Prompts）定义交互模式（可重用的 LLM 交互模板）
- 以及更多！

FastMCP 提供了用于构建、管理和与这些服务器交互的高级 Python 风格接口。

## 为什么选择 FastMCP？

MCP 协议功能强大，但实现它需要大量样板代码——服务器设置、协议处理程序、内容类型、错误管理。FastMCP 处理所有复杂的协议细节和服务器管理，因此您可以专注于构建出色的工具。它旨在提供高级且符合 Python 风格的接口；在大多数情况下，只需装饰一个函数即可。

FastMCP 2.0 已发展成为一个全面的平台，远远超出了基本协议实现。虽然 1.0 版本提供了服务器构建功能（现在是官方 MCP SDK 的一部分），但 2.0 版本提供了完整的生态系统，包括客户端库、身份验证系统、部署工具、与主要 AI 平台的集成、测试框架和生产就绪的基础设施模式。

FastMCP 旨在成为：

🚀 **快速**：高级接口意味着更少的代码和更快的开发

🍀 **简单**：以最少的样板代码构建 MCP 服务器

🐍 **Python 风格**：对 Python 开发人员来说感觉自然

🔍 **完整**：适用于从开发到生产的所有 MCP 用例的综合平台

FastMCP 由 [Prefect](https://www.prefect.io/) 精心打造。

## LLM 友好文档

本文档也有 [llms.txt 格式](https://llmstxt.org/)，这是一种简单的 Markdown 标准，LLM 可以轻松使用。

有两种访问 LLM 友好文档的方式：

- [llms.txt](https://gofastmcp.com/llms.txt) 本质上是一个站点地图，列出了文档中的所有页面。
- [llms-full.txt](https://gofastmcp.com/llms-full.txt) 包含完整文档。请注意，这可能超出您 LLM 的上下文窗口。

此外，任何页面都可以通过在 URL 后附加 `.md` 来以 Markdown 格式访问。例如，本页面将变为 `https://gofastmcp.com/getting-started/welcome.md`，您可以在 [此处](https://gofastmcp.com/getting-started/welcome.md) 查看。

最后，您可以通过按键盘上的“Cmd+C”（或 Windows 上的“Ctrl+C”）将任何页面的内容复制为 Markdown。

[安装](https://gofastmcp.com/getting-started/installation)

本页面内容

- [超越协议](https://gofastmcp.com/getting-started/welcome#beyond-the-protocol)
- [什么是 MCP？](https://gofastmcp.com/getting-started/welcome#what-is-mcp%3F)
- [为什么选择 FastMCP？](https://gofastmcp.com/getting-started/welcome#why-fastmcp%3F)
- [LLM 友好文档](https://gofastmcp.com/getting-started/welcome#llm-friendly-docs)