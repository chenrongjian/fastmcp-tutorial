模型上下文协议（MCP）是一种新的标准化方式，用于为您的LLM提供上下文和工具，而FastMCP使构建MCP服务器和客户端变得简单直观。通过简洁的Python代码创建工具、公开资源、定义提示词等：

```python
from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀")

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

if __name__ == "__main__":
    mcp.run()
```

## 超越协议

FastMCP是使用模型上下文协议的标准框架。FastMCP 1.0于2024年被纳入官方MCP Python SDK。

这是FastMCP 2.0，这是积极维护的版本，提供了用于使用MCP生态系统的完整工具包。FastMCP 2.0具有一系列全面的功能，远远超出了核心MCP规范，所有这些功能都旨在提供最简单的生产路径。这些功能包括部署、身份验证、客户端、服务器代理和组合、从REST API生成服务器、动态工具重写、内置测试工具、集成等。

准备好升级或开始使用了吗？请按照安装说明进行操作，其中包括从官方MCP SDK升级的步骤。

## 什么是MCP？

模型上下文协议允许您构建服务器，以安全、标准化的方式向LLM应用程序公开数据和功能。它通常被描述为“AI的USB-C端口”，提供了一种统一的方式将LLM连接到它们可以使用的资源。将其视为专门为LLM交互设计的API可能更容易。MCP服务器可以：

- 通过资源公开数据（可以将这些视为GET端点；它们用于将信息加载到LLM的上下文中）
- 通过工具提供功能（类似于POST端点；它们用于执行代码或以其他方式产生副作用）
- 通过提示词定义交互模式（LLM交互的可重用模板）
- 以及更多！

FastMCP提供了用于构建、管理和与这些服务器交互的高级Pythonic接口。

## 为什么选择FastMCP？

MCP协议功能强大，但实现它涉及大量样板代码——服务器设置、协议处理程序、内容类型、错误管理。FastMCP处理所有复杂的协议细节和服务器管理，因此您可以专注于构建出色的工具。它旨在提供高级且Pythonic的接口；在大多数情况下，装饰函数就是您所需要的全部。

FastMCP 2.0已经发展成为一个全面的平台，远远超出了基本的协议实现。虽然1.0版本提供了服务器构建功能（现在是官方MCP SDK的一部分），但2.0版本提供了完整的生态系统，包括客户端库、身份验证系统、部署工具、与主要AI平台的集成、测试框架和生产就绪的基础设施模式。

FastMCP旨在：
- 🚀 快速：高级接口意味着更少的代码和更快的开发
- 🍀 简单：使用最少的样板代码构建MCP服务器
- 🐍 Pythonic：对Python开发人员来说感觉自然
- 🔍 完整：适用于从开发到生产的所有MCP用例的综合平台

FastMCP由Prefect精心打造。

## LLM友好文档

本文档也以llms.txt格式提供，这是一种简单的Markdown标准，LLM可以轻松使用。

有两种访问LLM友好文档的方式：

- llms.txt本质上是一个站点地图，列出了文档中的所有页面。
- llms-full.txt包含完整的文档。请注意，这可能会超出您的LLM的上下文窗口。

此外，任何页面都可以通过在URL后附加.md来作为Markdown访问。例如，此页面将变为https://gofastmcp.com/getting-started/welcome.md，您可以在此处查看。

最后，您可以通过按键盘上的“Cmd+C”（或Windows上的“Ctrl+C”）将任何页面的内容复制为Markdown。