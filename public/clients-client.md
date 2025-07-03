版本 2.0.0 新增
MCP客户端应用程序的核心是 fastmcp.Client 类。此类提供了与任何模型上下文协议（MCP）服务器交互的编程接口，自动处理协议细节和连接管理。

FastMCP客户端专为确定性、受控交互而设计，而非自主行为，使其非常适合：

- 开发期间测试MCP服务器
- 构建需要可靠MCP交互的确定性应用程序
- 创建具有结构化、类型安全操作的智能体或基于LLM的客户端基础

所有客户端操作都需要使用async with上下文管理器来正确管理连接生命周期。

## 创建客户端

创建客户端非常简单。您提供服务器源，客户端会自动推断适当的传输机制。

```python
import asyncio
from fastmcp import Client, FastMCP

# 内存中的服务器（理想用于测试）
server = FastMCP("TestServer")
client = Client(server)

# HTTP服务器
client = Client("https://example.com/mcp")

# 本地Python脚本
client = Client("my_mcp_server.py")

async def main():
    async with client:
        # 基本服务器交互
        await client.ping()
        
        # 列出可用操作
        tools = await client.list_tools()
        resources = await client.list_resources()
        prompts = await client.list_prompts()
        
        # 执行操作
        result = await client.call_tool("example_tool", {"param": "value"})
        print(result)

asyncio.run(main())
```

## 客户端-传输架构

FastMCP客户端将协议和连接的关注点分离：

- 客户端：处理MCP协议操作（工具、资源、提示词）并管理回调
- 传输：建立和维护连接（WebSocket、HTTP、标准输入输出、内存中）

## 传输推断

客户端根据输入自动推断适当的传输：

- FastMCP实例 → 内存中传输（非常适合测试）
- 以.py结尾的文件路径 → Python标准输入输出传输
- 以.js结尾的文件路径 → Node.js标准输入输出传输
- 以http://或https://开头的URL → HTTP传输
- MCPConfig字典 → 多服务器客户端

```python
from fastmcp import Client, FastMCP

# 传输推断示例
client_memory = Client(FastMCP("TestServer"))
client_script = Client("./server.py") 
client_http = Client("https://api.example.com/mcp")
```

## 基于配置的客户端

版本 2.4.0 新增
从MCP配置字典创建客户端，其中可以包含多个服务器。虽然MCP配置格式没有官方标准，但FastMCP遵循Claude Desktop等工具使用的既定约定。

### 配置格式

```python
config = {
    "mcpServers": {
        "server_name": {
            # 远程HTTP/SSE服务器
            "transport": "http",  # 或 "sse"
            "url": "https://api.example.com/mcp",
            "headers": {"Authorization": "Bearer token"},
            "auth": "oauth"  # 或bearer令牌字符串
        },
        "local_server": {
            # 本地标准输入输出服务器
            "transport": "stdio"
            "command": "python",
            "args": ["./server.py", "--verbose"],
            "env": {"DEBUG": "true"},
            "cwd": "/path/to/server",
        }
    }
}
```

### 多服务器示例

```python
config = {
    "mcpServers": {
        "weather": {"url": "https://weather-api.example.com/mcp"},
        "assistant": {"command": "python", "args": ["./assistant_server.py"]}
    }
}

client = Client(config)

async with client:
    # 工具以服务器名称为前缀
    weather_data = await client.call_tool("weather_get_forecast", {"city": "London"})
    response = await client.call_tool("assistant_answer_question", {"question": "What's the capital of France?"})
    
    # 资源使用带前缀的URI
    icons = await client.read_resource("weather://weather/icons/sunny")
    templates = await client.read_resource("resource://assistant/templates/list")
```

## 连接生命周期

客户端异步运行，并使用上下文管理器进行连接管理：

```python
async def example():
    client = Client("my_mcp_server.py")
    
    # 在此处建立连接
    async with client:
        print(f"已连接: {client.is_connected()}")
        
        # 在同一会话中进行多次调用
        tools = await client.list_tools()
        result = await client.call_tool("greet", {"name": "World"})
        
    # 在此处自动关闭连接
    print(f"已连接: {client.is_connected()}")
```

## 操作

FastMCP客户端可以与多种类型的服务器组件交互：

### 工具

工具是客户端可以使用参数执行的服务器端函数。

```python
async with client:
    # 列出可用工具
    tools = await client.list_tools()
    
    # 执行工具
    result = await client.call_tool("multiply", {"a": 5, "b": 3})
    print(result[0].text)  # "15"
```

详见工具的详细文档。

### 资源

资源是客户端可以读取的数据源，可以是静态的或模板化的。

```python
async with client:
    # 列出可用资源
    resources = await client.list_resources()
    
    # 读取资源
    data = await client.read_resource("resource://example/data")
    print(data)
```

详见资源的详细文档。