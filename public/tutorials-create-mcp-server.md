# 如何在Python中创建MCP服务器

如果你想在Python中构建模型上下文协议（MCP）服务器，目标是创建一个可以为Claude、Gemini或其他支持该协议的AI模型提供工具和数据的服务。虽然MCP规范功能强大，但从头开始实现它需要大量样板代码：处理JSON-RPC、管理会话状态以及正确格式化请求和响应。

这就是FastMCP的用武之地。它是一个高级框架，为你处理所有协议复杂性，让你专注于重要的事情：编写为服务器提供动力的Python函数。

本指南将引导你使用FastMCP从头开始创建一个功能齐全的MCP服务器。

## 先决条件

确保你已安装FastMCP。如果没有，请按照安装指南进行安装。
```bash
pip install fastmcp
```

## 步骤1：创建基本服务器

每个FastMCP应用程序都从FastMCP类的实例开始。这个对象充当所有工具和资源的容器。

创建一个名为my_mcp_server.py的新文件：
```python
# my_mcp_server.py
from fastmcp import FastMCP

# 创建一个具有描述性名称的服务器实例
mcp = FastMCP(name="My First MCP Server")
```

就是这样！你有了一个有效的（虽然是空的）MCP服务器。现在，让我们添加一些功能。

## 步骤2：添加工具

工具是LLM可以执行的函数。让我们创建一个简单的加法工具。

为此，只需编写一个标准的Python函数并用@mcp.tool装饰它。

```python
# my_mcp_server.py
from fastmcp import FastMCP

mcp = FastMCP(name="My First MCP Server")

@mcp.tool
def add(a: int, b: int) -> int:
    """将两个整数相加。"""
    return a + b
```

FastMCP自动处理其余部分：

- **工具名称**：它使用函数名（add）作为工具的名称。
- **描述**：它使用函数的文档字符串作为LLM的工具描述。
- **模式**：它检查类型提示（a: int, b: int）以生成输入的JSON模式。

这是FastMCP的核心理念：编写Python，而不是协议样板代码。

## 步骤3：使用资源公开数据

资源为LLM提供只读数据。你可以通过用@mcp.resource装饰函数并提供唯一URI来定义资源。

让我们将一个简单的配置字典作为资源公开。

```python
# my_mcp_server.py
from fastmcp import FastMCP

mcp = FastMCP(name="My First MCP Server")

@mcp.tool
def add(a: int, b: int) -> int:
    """将两个整数相加。"""
    return a + b

@mcp.resource("resource://config")
def get_config() -> dict:
    """提供应用程序的配置。"""
    return {"version": "1.0", "author": "MyTeam"}
```

当客户端请求URI resource://config时，FastMCP将执行get_config函数并将其输出（序列化为JSON）返回给客户端。该函数仅在请求资源时调用，支持数据的延迟加载。

## 步骤4：使用资源模板生成动态内容

有时，你需要基于参数生成资源。这就是资源模板的用途。你可以使用相同的@mcp.resource装饰器定义它们，但在URI中包含占位符。

让我们创建一个提供个性化问候的模板。

```python
# my_mcp_server.py
from fastmcp import FastMCP

mcp = FastMCP(name="My First MCP Server")

@mcp.tool
def add(a: int, b: int) -> int:
    """将两个整数相加。"""
    return a + b

@mcp.resource("resource://config")
def get_config() -> dict:
    """提供应用程序的配置。"""
    return {"version": "1.0", "author": "MyTeam"}

@mcp.resource("greetings://{name}")
def personalized_greeting(name: str) -> str:
    """为给定名称生成个性化问候。"""
    return f"Hello, {name}! Welcome to the MCP server."
```

现在，客户端可以请求动态URI：

- greetings://Ford将调用personalized_greeting(name="Ford")。
- greetings://Marvin将调用personalized_greeting(name="Marvin")。

FastMCP自动将URI中的{name}占位符映射到函数中的name参数。

## 步骤5：运行服务器

要使服务器可执行，请在脚本中添加一个__main__块，调用mcp.run()。

```python
# my_mcp_server.py
from fastmcp import FastMCP

mcp = FastMCP(name="My First MCP Server")

@mcp.tool
def add(a: int, b: int) -> int:
    """将两个整数相加。"""
    return a + b

@mcp.resource("resource://config")
def get_config() -> dict:
    """提供应用程序的配置。"""
    return {"version": "1.0", "author": "MyTeam"}

@mcp.resource("greetings://{name}")
def personalized_greeting(name: str) -> str:
    """为给定名称生成个性化问候。"""
    return f"Hello, {name}! Welcome to the MCP server."

if __name__ == "__main__":
    mcp.run()
```

现在你可以从命令行运行服务器：
```bash
python my_mcp_server.py
```

这将使用默认的STDIO传输启动服务器，这是Claude Desktop等客户端与本地服务器通信的方式。要了解其他传输方式（如HTTP），请参阅运行服务器指南。

## 完整服务器

以下是my_mcp_server.py的完整代码（点击展开）：
```python
# my_mcp_server.py
from fastmcp import FastMCP

mcp = FastMCP(name="My First MCP Server")

@mcp.tool
def add(a: int, b: int) -> int:
    """将两个整数相加。"""
    return a + b

@mcp.resource("resource://config")
def get_config() -> dict:
    """提供应用程序的配置。"""
    return {"version": "1.0", "author": "MyTeam"}

@mcp.resource("greetings://{name}")
def personalized_greeting(name: str) -> str:
    """为给定名称生成个性化问候。"""
    return f"Hello, {name}! Welcome to the MCP server."

if __name__ == "__main__":
    mcp.run()
```