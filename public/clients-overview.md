
[模型上下文协议](https://modelcontextprotocol.io/)（MCP）是一种新的标准化方式，用于为您的LLM提供上下文和工具，而FastMCP使构建MCP服务器和客户端变得简单直观。通过简洁的Python风格代码创建工具、公开资源、定义提示等：


```
from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀")

@mcp.tool
def add(a: int, b: int) -> int:
    """两数相加"""
    return a + b

if __name__ == "__main__":
    mcp.run()

```

## [​](https://gofastmcp.com/getting-started/welcome\#beyond-the-protocol)  超越协议

FastMCP是使用模型上下文协议的标准框架。FastMCP 1.0于2024年被纳入[官方MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)。

这是FastMCP 2.0，**积极维护的版本**，提供了用于MCP生态系统的完整工具包。

FastMCP 2.0拥有一系列全面的功能，远远超出了核心MCP规范，所有这些功能都旨在提供**最简单的生产路径**。其中包括部署、身份验证、客户端、服务器代理和组合、从REST API生成服务器、动态工具重写、内置测试工具、集成等。

准备升级或开始使用？请遵循[安装说明](https://gofastmcp.com/getting-started/installation)，其中包括从官方MCP SDK升级的步骤。

## [​](https://gofastmcp.com/getting-started/welcome\#what-is-mcp%3F)  什么是MCP？

模型上下文协议允许您构建服务器，以安全、标准化的方式向LLM应用程序公开数据和功能。它通常被描述为“AI的USB-C端口”，提供了一种统一的方式将LLM连接到它们可以使用的资源。可以将其简单理解为专门为LLM交互设计的API。MCP服务器可以：

- 通过`Resources`公开数据（类似于GET端点；用于将信息加载到LLM的上下文中）
- 通过`Tools`提供功能（类似于POST端点；用于执行代码或产生副作用）
- 通过`Prompts`定义交互模式（LLM交互的可重用模板）
- 以及更多！

FastMCP提供了高级的Python风格接口，用于构建、管理和与这些服务器交互。

## [​](https://gofastmcp.com/getting-started/welcome\#why-fastmcp%3F)  为什么选择FastMCP？

MCP协议功能强大，但实现它需要大量样板代码——服务器设置、协议处理程序、内容类型、错误管理等。FastMCP处理所有复杂的协议细节和服务器管理，因此您可以专注于构建出色的工具。它设计为高级且符合Python风格；在大多数情况下，只需装饰一个函数即可。

FastMCP 2.0已发展成为一个全面的平台，远远超出了基本协议实现。虽然1.0提供了服务器构建功能（现在是官方MCP SDK的一部分），但2.0提供了完整的生态系统，包括客户端库、身份验证系统、部署工具、与主要AI平台的集成、测试框架和生产就绪的基础设施模式。

FastMCP旨在：

🚀 **快速**：高级接口意味着更少的代码和更快的开发

🍀 **简单**：以最少的样板代码构建MCP服务器

🐍 **Python风格**：对Python开发人员来说感觉自然

🔍 **完整**：适用于所有MCP用例的综合平台，从开发到生产

FastMCP由[Prefect](https://www.prefect.io/)精心打造。

## [​](https://gofastmcp.com/getting-started/welcome\#llm-friendly-docs)  LLM友好文档

本文档也提供[llms.txt格式](https://llmstxt.org/)，这是一种简单的Markdown标准，LLM可以轻松使用。

有两种方式访问LLM友好文档：

- [llms.txt](https://gofastmcp.com/llms.txt)本质上是一个站点地图，列出了文档中的所有页面。
- [llms-full.txt](https://gofastmcp.com/llms-full.txt)包含完整文档。请注意，这可能超出您LLM的上下文窗口。

此外，任何页面都可以通过在URL后附加`.md`以Markdown格式访问。例如，本页面将变为`https://gofastmcp.com/getting-started/welcome.md`，您可以[在此处](https://gofastmcp.com/getting-started/welcome.md)查看。

最后，您可以通过在键盘上按“Cmd+C”（或Windows上的“Ctrl+C”）将任何页面的内容复制为Markdown。

[安装](https://gofastmcp.com/getting-started/installation)

本页面内容

- [超越协议](https://gofastmcp.com/getting-started/welcome#beyond-the-protocol)
- [什么是MCP？](https://gofastmcp.com/getting-started/welcome#what-is-mcp%3F)
- [为什么选择FastMCP？](https://gofastmcp.com/getting-started/welcome#why-fastmcp%3F)
- [LLM友好文档](https://gofastmcp.com/getting-started/welcome#llm-friendly-docs)
