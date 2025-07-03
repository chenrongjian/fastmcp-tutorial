# 什么是模型上下文协议（MCP）？

模型上下文协议（MCP）是一种开放标准，旨在解决AI开发中的一个基本问题：大型语言模型（LLMs）如何可靠且安全地与外部工具、数据和服务进行交互？

它是AI的概率性、非确定性世界与你的代码和数据的确定性、可靠世界之间的桥梁。

虽然你可以为LLM构建自定义REST API，但MCP提供了专门的、标准化的“端口”用于AI原生通信。可以将其视为AI的USB-C：一个单一的、定义良好的接口，用于将任何兼容的LLM连接到任何兼容的工具或数据源。

本指南提供了协议本身的高级概述。我们将使用FastMCP（领先的MCP Python框架）通过简单的代码示例来说明这些概念。

## 为什么我们需要协议？

现有的API不计其数，最常见的问题是：“为什么我们还需要另一个？”

答案在于标准化。AI生态系统是碎片化的。每个模型提供商都有自己定义和调用工具的方式。MCP的目标是创建一种通用语言，提供几个关键优势：

- **互操作性**：构建一个MCP服务器，它可以被任何MCP兼容客户端（Claude、Gemini、OpenAI、自定义代理等）使用，无需自定义集成代码。这是协议最重要的承诺。
- **可发现性**：客户端可以在运行时动态询问服务器它的功能。它们会收到结构化的、机器可读的工具和资源“菜单”。
- **安全性**：MCP提供了清晰的沙箱边界。LLM不能在你的服务器上执行任意代码；它只能请求运行你明确公开的特定、类型化和验证过的函数。
- **可组合性**：你可以构建小型、专门的MCP服务器，并将它们组合起来创建强大、复杂的应用程序。

## 核心MCP组件

MCP服务器通过三个主要组件公开其功能：工具（Tools）、资源（Resources）和提示词（Prompts）。

### 工具：可执行操作

工具是LLM可以要求服务器执行的函数。它们是MCP的面向行动部分。

按照REST API的思路，你可以将工具视为类似于POST请求。它们用于执行操作、更改状态或触发副作用，如发送电子邮件、将用户添加到数据库或进行计算。

使用FastMCP，创建工具就像装饰Python函数一样简单。

```python
from fastmcp import FastMCP

mcp = FastMCP()

# 此函数现在是名为“get_weather”的MCP工具
@mcp.tool
def get_weather(city: str) -> dict:
    """获取特定城市的当前天气。"""
    # 在实际应用中，这会调用天气API
    return {"city": city, "temperature": "72F", "forecast": "晴朗"}
```

了解更多关于工具 →

### 资源：只读数据

资源是LLM可以读取的数据源。它们用于将信息加载到LLM的上下文中，为其提供训练数据中没有的知识。

按照REST API的类比，资源就像GET请求。它们的目的是幂等地检索信息，理想情况下不会导致副作用。资源可以是从静态文本文件到数据库中的动态数据的任何内容。每个资源由唯一的URI标识。

```python
from fastmcp import FastMCP

mcp = FastMCP()

# 此函数在URI“system://status”提供资源
@mcp.resource("system://status")
def get_system_status() -> dict:
    """返回服务的当前运行状态。"""
    return {"status": "所有系统正常"}
```

### 资源模板

你还可以为动态数据创建资源模板。客户端可以请求users://42/profile来获取特定用户的个人资料。

```python
from fastmcp import FastMCP

mcp = FastMCP()

# 此模板为任何给定的用户ID提供用户数据
@mcp.resource("users://{user_id}/profile")
def get_user_profile(user_id: str) -> dict:
    """返回特定用户的个人资料。"""
    # 从数据库获取用户...
    return {"id": user_id, "name": "Zaphod Beeblebrox"}
```

了解更多关于资源和模板 →

### 提示词：可重用指令

提示词是可重用的、参数化的消息模板。它们提供了一种定义一致、结构化指令的方式，客户端可以请求这些指令来指导LLM在特定任务中的行为。

```python
from fastmcp import FastMCP

mcp = FastMCP()

@mcp.prompt
def summarize_text(text_to_summarize: str) -> str:
    """创建一个提示，要求LLM总结一段文本。"""
    return f"""
        请提供以下文本的简洁、一段式摘要：
        
        {text_to_summarize}
        """
```

了解更多关于提示词 →

## 高级功能

除了核心组件外，MCP还支持更高级的交互模式，例如服务器请求客户端的LLM生成完成（称为采样），或服务器向客户端发送异步通知。这些功能支持更复杂的双向工作流，并得到FastMCP的完全支持。

## 后续步骤

现在你已经了解了模型上下文协议的核心概念