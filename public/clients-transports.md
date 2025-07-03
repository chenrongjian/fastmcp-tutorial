版本 2.0.0 新增
FastMCP客户端依靠ClientTransport对象来处理与MCP服务器连接和通信的具体细节。FastMCP提供了几种内置的传输实现，适用于常见的连接方法。

虽然客户端通常会自动推断正确的传输方式（参见客户端概述），但您也可以显式实例化传输以获得更多控制。

## 选择传输方式

根据您的使用场景选择合适的传输方式：

- **连接到远程/持久服务器**：使用StreamableHttpTransport（推荐，HTTP URL的默认选项）或SSETransport（旧版选项）用于基于Web的部署。

- **本地开发/测试**：使用FastMCPTransport进行FastMCP服务器的内存中、同进程测试。

- **运行本地服务器**：如果需要将MCP服务器作为打包工具运行，使用UvxStdioTransport（Python/uv）或NpxStdioTransport（Node/npm）。

## 网络传输

这些传输连接到通过网络运行的服务器，通常是可通过URL访问的长期运行服务。

### 流式HTTP

版本 2.3.0 新增
流式HTTP是基于Web部署的推荐传输方式，通过HTTP提供高效的双向通信。

#### 概述

- 类：fastmcp.client.transports.StreamableHttpTransport
- 推断来源：以http://或https://开头且路径中不包含/sse/的URL（自v2.3.0起为HTTP URL的默认值）
- 服务器兼容性：适用于以http模式运行的FastMCP服务器

#### 基本用法

使用流式HTTP最简单的方法是让传输从URL自动推断：

```python
from fastmcp import Client
import asyncio

# 客户端自动对HTTP URL使用StreamableHttpTransport
client = Client("https://example.com/mcp")

async def main():
    async with client:
        tools = await client.list_tools()
        print(f"可用工具: {tools}")

asyncio.run(main())
```

您也可以显式实例化传输：

```python
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(url="https://example.com/mcp")
client = Client(transport)
```

对于需要身份验证的服务器：

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

# 创建带有身份验证头的传输
transport = StreamableHttpTransport(
    url="https://example.com/mcp",
    headers={"Authorization": "Bearer your-token-here"}
)

client = Client(transport)
```

### SSE（服务器发送事件）

版本 2.0.0 新增
服务器发送事件（SSE）是一种允许服务器通过HTTP连接向客户端推送数据的传输方式。虽然仍受支持，但流式HTTP现在是新的基于Web部署的推荐传输方式。

#### 概述

- 类：fastmcp.client.transports.SSETransport
- 推断来源：路径中包含/sse/的HTTP URL
- 服务器兼容性：适用于以sse模式运行的FastMCP服务器

#### 基本用法

使用SSE最简单的方法是让传输从路径中包含/sse/的URL自动推断：

```python
from fastmcp import Client
import asyncio

# 客户端自动对包含/sse/的URL使用SSETransport
client = Client("https://example.com/sse")

async def main():
    async with client:
        tools = await client.list_tools()
        print(f"可用工具: {tools}")

asyncio.run(main())
```

您也可以为路径中不包含/sse/的URL显式实例化传输，或为了获得更多控制：

```python
from fastmcp.client.transports import SSETransport

transport = SSETransport(url="https://example.com/sse")
client = Client(transport)
```

SSE传输也支持用于身份验证的自定义头：

```python
from fastmcp import Client
from fastmcp.client.transports import SSETransport

# 创建带有身份验证头的SSE传输
transport = SSETransport(
    url="https://example.com/sse",
    headers={"Authorization": "Bearer your-token-here"}
)

client = Client(transport)
```

#### SSE与流式HTTP的使用场景

**使用流式HTTP当**：

- 设置新部署（推荐默认）
- 需要双向流式传输
- 连接到以http模式运行的FastMCP服务器

**使用SSE当**：

- 连接到以sse模式运行的旧版FastMCP服务器
- 使用针对服务器发送事件优化的基础设施

## 本地传输

这些传输管理作为子进程运行的MCP服务器，通过标准输入（stdin）和标准输出（stdout）与其通信。这是Claude Desktop等客户端使用的标准机制。

### 会话管理

所有标准输入输出传输都支持keep_alive参数（默认：True），控制跨多个客户端上下文管理器的会话持久性：

- keep_alive=True（默认）：子进程和会话在客户端上下文退出和重新进入之间保持。当多次单独连接到同一服务器时，这提高了性能。
- keep_alive=False：为每个客户端上下文启动新的子进程，确保会话之间的完全隔离。

当keep_alive=True时，如果需要，您可以使用await client.close()手动关闭会话。这将终止子进程，并要求在下次连接时启动新的子进程。