服务器

代理服务器

`版本 2.0.0 新增`

FastMCP 提供强大的代理功能，允许一个 FastMCP 服务器实例充当另一个 MCP 服务器（可以是远程的、运行在不同传输层上的，甚至是另一个 FastMCP 实例）的前端。这通过 `FastMCP.as_proxy()` 类方法实现。

`as_proxy()` 接受现有的 `Client` 或任何可作为 `Client` 的 `transport` 参数传递的参数——例如另一个 `FastMCP` 实例、远程服务器的 URL 或 MCP 配置字典。

## [​](https://gofastmcp.com/servers/proxy\#what-is-proxying%3F) 什么是代理？

代理是指设置一个 FastMCP 服务器，该服务器不直接实现自己的工具或资源。相反，当它收到请求（如 `tools/call` 或 `resources/read`）时，会将该请求转发到 _后端_ MCP 服务器，接收响应，然后将响应中继回原始客户端。

后端 MCP 服务器（例如远程 SSE）FastMCP 代理服务器您的客户端（例如 Claude Desktop）后端 MCP 服务器（例如远程 SSE）FastMCP 代理服务器您的客户端（例如 Claude Desktop）代理转发请求代理中继响应MCP 请求（例如 stdio）MCP 请求（例如 sse）MCP 响应（例如 sse）MCP 响应（例如 stdio）

### [​](https://gofastmcp.com/servers/proxy\#use-cases) 用例

- **传输层桥接**：通过不同的传输层（例如本地 Stdio 供 Claude Desktop 使用）公开运行在一种传输层上的服务器（例如远程 SSE 服务器）。
- **添加功能**：在现有服务器前插入一层以添加缓存、日志记录、身份验证或修改请求/响应（尽管直接修改需要子类化 `FastMCPProxy`）。
- **安全边界**：将代理用作内部服务器的受控网关。
- **简化客户端配置**：即使后端服务器的位置或传输层发生变化，也提供单个稳定的端点（代理）。

## [​](https://gofastmcp.com/servers/proxy\#creating-a-proxy) 创建代理

创建代理的最简单方法是使用 `FastMCP.as_proxy()` 类方法。这将创建一个标准的 FastMCP 服务器，用于将请求转发到另一个 MCP 服务器。


```
from fastmcp import FastMCP

# 以 Client 接受的任何形式提供后端
proxy_server = FastMCP.as_proxy(
    "backend_server.py",  # 也可以是 FastMCP 实例、配置字典或远程 URL
    name="MyProxyServer"  # 代理的可选设置
)

# 或者自己创建 Client 以进行自定义配置
backend_client = Client("backend_server.py")
proxy_from_client = FastMCP.as_proxy(backend_client)

```

**`as_proxy` 的工作原理：**

1. 它使用提供的客户端连接到后端服务器。
2. 它发现后端服务器上可用的所有工具、资源、资源模板和提示词。
3. 它创建相应的“代理”组件，用于将请求转发到后端。
4. 它返回一个标准的 `FastMCP` 服务器实例，可以像任何其他服务器一样使用。

目前，代理主要侧重于公开主要的 MCP 对象（工具、资源、模板和提示词）。当前版本的代理不完全支持某些高级 MCP 功能，如通知和采样。未来版本可能会添加对这些附加功能的支持。

### [​](https://gofastmcp.com/servers/proxy\#bridging-transports) 传输层桥接

一个常见用例是桥接传输层。例如，通过 Stdio 在本地提供远程 SSE 服务器：


```
from fastmcp import FastMCP

# 直接通过 URL 定位远程 SSE 服务器
proxy = FastMCP.as_proxy("http://example.com/mcp/sse", name="SSE 到 Stdio 代理")

# 现在可以使用任何传输层使用代理
# 无需特殊处理 - 它的工作方式与任何 FastMCP 服务器一样

```

### [​](https://gofastmcp.com/servers/proxy\#in-memory-proxies) 内存中代理

您还可以代理内存中的 `FastMCP` 实例，这对于调整您不完全控制的服务器的配置或行为非常有用。


```
from fastmcp import FastMCP

# 原始服务器
original_server = FastMCP(name="Original")

@original_server.tool
def tool_a() -> str:
    return "A"

# 直接创建原始服务器的代理
proxy = FastMCP.as_proxy(
    original_server,
    name="代理服务器"
)

# proxy 现在是一个常规的 FastMCP 服务器，用于将
# 请求转发到 original_server

```

### [​](https://gofastmcp.com/servers/proxy\#configuration-based-proxies) 基于配置的代理

`版本 2.4.0 新增`

您可以直接从遵循 MCPConfig 模式的配置字典创建代理。这对于快速设置到远程服务器的代理非常有用，无需手动配置每个连接细节。


```
from fastmcp import FastMCP

# 直接从配置字典创建代理
config = {
    "mcpServers": {
        "default": {  # 对于单服务器配置，通常使用 'default'
            "url": "https://example.com/mcp",
            "transport": "streamable-http"
        }
    }
}

# 创建到已配置服务器的代理
proxy = FastMCP.as_proxy(config, name="基于配置的代理")

# 使用 stdio 传输运行代理以进行本地访问
if __name__ == "__main__":
    proxy.run()

```

MCPConfig 格式遵循新兴的 MCP 服务器配置标准，可能会随着规范的成熟而发展。虽然 FastMCP 旨在保持与未来版本的兼容性，但请注意字段名称或结构可能会发生变化。

您还可以使用 MCPConfig 创建到多个服务器的代理。当指定多个服务器时，它们会自动以其配置名称作为前缀进行挂载，从而为所有服务器提供统一的接口：


```
from fastmcp import FastMCP

# 多服务器配置
config = {
    "mcpServers": {
        "weather": {
            "url": "https://weather-api.example.com/mcp",
            "transport": "streamable-http"
        },
        "calendar": {
            "url": "https://calendar-api.example.com/mcp",
            "transport": "streamable-http"
        }
    }
}

# 创建到多个服务器的代理
composite_proxy = FastMCP.as_proxy(config, name="复合代理")

# 工具和资源可通过前缀访问：
# - weather_get_forecast, calendar_add_event
# - weather://weather/icons/sunny, calendar://calendar/events/today

```

## [​](https://gofastmcp.com/servers/proxy\#fastmcpproxy-class) `FastMCPProxy` 类

在内部，`FastMCP.as_proxy()` 使用 `FastMCPProxy` 类。通常您不需要直接与此类交互，但如果需要，它是可用的。

在高级场景中可能需要直接使用该类，例如子类化 `FastMCPProxy` 以在转发请求之前或之后添加自定义逻辑。

[OpenAPI 集成](https://gofastmcp.com/servers/openapi) [组合](https://gofastmcp.com/servers/composition)

本页内容

- [什么是代理？](https://gofastmcp.com/servers/proxy#what-is-proxying%3F)
- [用例](https://gofastmcp.com/servers/proxy#use-cases)
- [创建代理](https://gofastmcp.com/servers/proxy#creating-a-proxy)
- [传输层桥接](https://gofastmcp.com/servers/proxy#bridging-transports)
- [内存中代理](https://gofastmcp.com/servers/proxy#in-memory-proxies)
- [基于配置的代理](https://gofastmcp.com/servers/proxy#configuration-based-proxies)
- [FastMCPProxy 类](https://gofastmcp.com/servers/proxy#fastmcpproxy-class)