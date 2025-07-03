服务器

服务器组合

`版本 2.2.0 新增`

随着您的 MCP 应用程序不断增长，您可能希望将工具、资源和提示词组织成逻辑模块或重用现有的服务器组件。FastMCP 通过两种方法支持组合：

- **`import_server`**：用于一次性复制组件并添加前缀（静态组合）。
- **`mount`**：用于创建实时链接，主服务器将请求委托给子服务器（动态组合）。

## [​](https://gofastmcp.com/servers/composition\#why-compose-servers%3F) 为什么要组合服务器？

- **模块化**：将大型应用程序分解为更小的、专注的服务器（例如 `WeatherServer`、`DatabaseServer`、`CalendarServer`）。
- **可重用性**：创建通用的实用服务器（例如 `TextProcessingServer`）并在需要时挂载它们。
- **团队协作**：不同的团队可以开发单独的 FastMCP 服务器，稍后再将它们组合起来。
- **组织性**：将相关功能逻辑分组在一起。

### [​](https://gofastmcp.com/servers/composition\#importing-vs-mounting) 导入 vs 挂载

选择导入还是挂载取决于您的用例和需求。

| 特性 | 导入 | 挂载 |
| --- | --- | --- |
| **方法** | `FastMCP.import_server(server, prefix=None)` | `FastMCP.mount(server, prefix=None)` |
| **组合类型** | 一次性复制（静态） | 实时链接（动态） |
| **更新** | 子服务器的更改不会反映 | 子服务器的更改立即反映 |
| **前缀** | 可选 - 省略则使用原始名称 | 可选 - 省略则使用原始名称 |
| **最适合** | 捆绑已完成的组件 | 模块化运行时组合 |

### [​](https://gofastmcp.com/servers/composition\#proxy-servers) 代理服务器

FastMCP 支持 [MCP 代理](https://gofastmcp.com/servers/proxy)，允许您在本地 FastMCP 实例中镜像本地或远程服务器。代理与导入和挂载完全兼容。

`版本 2.4.0 新增`

您还可以从遵循 MCPConfig 模式的配置字典创建代理，这对于快速连接到一个或多个远程服务器非常有用。有关基于配置的代理的详细信息，请参阅 [代理服务器文档](https://gofastmcp.com/servers/proxy#configuration-based-proxies)。请注意，MCPConfig 遵循新兴标准，其格式可能会随着时间的推移而演变。

## [​](https://gofastmcp.com/servers/composition\#importing-static-composition) 导入（静态组合）

`import_server()` 方法将所有组件（工具、资源、模板、提示词）从一个 `FastMCP` 实例（_子服务器_）复制到另一个实例（_主服务器_）。可以提供可选的 `prefix` 以避免命名冲突。如果未提供前缀，则组件将未经修改地导入。当多个服务器使用相同前缀（或无前缀）导入时，最近导入的服务器的组件优先。

```
from fastmcp import FastMCP
import asyncio

# 定义子服务器
weather_mcp = FastMCP(name="WeatherService")

@weather_mcp.tool
def get_forecast(city: str) -> dict:
    """获取天气预报。"""
    return {"city": city, "forecast": "晴朗"}

@weather_mcp.resource("data://cities/supported")
def list_supported_cities() -> list[str]:
    """列出支持天气查询的城市。"""
    return ["伦敦", "巴黎", "东京"]

# 定义主服务器
main_mcp = FastMCP(name="MainApp")

# 导入子服务器
async def setup():
    await main_mcp.import_server(weather_mcp, prefix="weather")

# 结果：main_mcp 现在包含带前缀的组件：
# - 工具："weather_get_forecast"
# - 资源："data://weather/cities/supported"

if __name__ == "__main__":
    asyncio.run(setup())
    main_mcp.run()

```

### [​](https://gofastmcp.com/servers/composition\#how-importing-works) 导入的工作原理

当您调用 `await main_mcp.import_server(subserver, prefix={whatever})` 时：

1. **工具**：子服务器中的所有工具都添加到主服务器，并使用 `{prefix}_` 作为名称前缀。

   - `subserver.tool(name="my_tool")` 变为 `main_mcp.tool(name="{prefix}_my_tool")`。
2. **资源**：所有资源都添加，URI 格式为 `protocol://{prefix}/path`。

   - `subserver.resource(uri="data://info")` 变为 `main_mcp.resource(uri="data://{prefix}/info")`。
3. **资源模板**：模板的前缀方式与资源类似。

   - `subserver.resource(uri="data://{id}")` 变为 `main_mcp.resource(uri="data://{prefix}/{id}")`。
4. **提示词**：所有提示词都添加，名称使用 `{prefix}_` 作为前缀。

   - `subserver.prompt(name="my_prompt")` 变为 `main_mcp.prompt(name="{prefix}_my_prompt")`。

请注意，`import_server` 执行组件的**一次性复制**。在导入**之后**对子服务器所做的更改**不会**反映在主服务器中。子服务器的 `lifespan` 上下文也**不会**由主服务器执行。

`prefix` 参数是可选的。如果省略，则组件将未经修改地导入。

#### [​](https://gofastmcp.com/servers/composition\#importing-without-prefixes) 无前缀导入

`版本 2.9.0 新增`

您也可以不指定前缀导入服务器，这将使用组件的原始名称进行复制：


```

from fastmcp import FastMCP
import asyncio

# 定义子服务器
weather_mcp = FastMCP(name="WeatherService")

@weather_mcp.tool
def get_forecast(city: str) -> dict:
    """获取天气预报。"""
    return {"city": city, "forecast": "晴朗"}

@weather_mcp.resource("data://cities/supported")
def list_supported_cities() -> list[str]:
    """列出支持天气查询的城市。"""
    return ["伦敦", "巴黎", "东京"]

# 定义主服务器
main_mcp = FastMCP(name="MainApp")

# 导入子服务器
async def setup():
    # 无前缀导入 - 组件保留原始名称
    await main_mcp.import_server(weather_mcp)

# 结果：main_mcp 现在包含：
# - 工具："get_forecast"（保留原始名称）
# - 资源："data://cities/supported"（保留原始 URI）

if __name__ == "__main__":
    asyncio.run(setup())
    main_mcp.run()

```

#### [​](https://gofastmcp.com/servers/composition\#conflict-resolution) 冲突解决

`版本 2.9.0 新增`

当导入多个具有相同前缀或无前缀的服务器时，**最近导入**的服务器的组件优先。

## [​](https://gofastmcp.com/servers/composition\#mounting-live-linking) 挂载（实时链接）

`mount()` 方法在 `main_mcp` 服务器和 `subserver` 之间创建**实时链接**。不是复制组件，而是在运行时将与可选 `prefix` 匹配的组件请求**委托**给子服务器。如果未提供前缀，则可以无前缀访问子服务器的组件。当多个服务器使用相同前缀（或无前缀）挂载时，最近挂载的服务器对于冲突的组件名称优先。


```
import asyncio
from fastmcp import FastMCP, Client

# 定义子服务器
dynamic_mcp = FastMCP(name="DynamicService")

@dynamic_mcp.tool
def initial_tool():
    """初始工具演示。"""
    return "初始工具存在"

# 挂载子服务器（同步操作）
main_mcp = FastMCP(name="MainAppLive")
main_mcp.mount(dynamic_mcp, prefix="dynamic")

# 挂载后添加工具 - 可通过 main_mcp 访问
@dynamic_mcp.tool
def added_later():
    """挂载后添加的工具。"""
    return "工具已动态添加！"

# 测试访问挂载的工具
async def test_dynamic_mount():
    tools = await main_mcp.get_tools()
    print("可用工具：", list(tools.keys()))
    # 显示：['dynamic_initial_tool', 'dynamic_added_later']

    async with Client(main_mcp) as client:
        result = await client.call_tool("dynamic_added_later")
        print("结果：", result[0].text)
        # 显示："工具已动态添加！"

if __name__ == "__main__":
    asyncio.run(test_dynamic_mount())

```

### [​](https://gofastmcp.com/servers/composition\#how-mounting-works) 挂载的工作原理

配置挂载后：

1. **实时链接**：父服务器与挂载的服务器建立连接。
2. **动态更新**：对挂载服务器的更改在通过父服务器访问时立即反映。
3. **前缀访问**：父服务器使用前缀将请求路由到挂载的服务器。
4. **委托**：与前缀匹配的组件请求在运行时委托给挂载的服务器。

与 `import_server` 相同的前缀规则适用于命名工具、资源、模板和提示词。

`prefix` 参数是可选的。如果省略，则组件将未经修改地挂载。

#### [​](https://gofastmcp.com/servers/composition\#mounting-without-prefixes) 无前缀挂载

`版本 2.9.0 新增`

您也可以不指定前缀挂载服务器，这使得组件可以无前缀访问。这与 [无前缀导入](https://gofastmcp.com/servers/composition#importing-without-prefixes) 的工作方式相同，包括 [冲突解决](https://gofastmcp.com/servers/composition#conflict-resolution)。

### [​](https://gofastmcp.com/servers/composition\#direct-vs-proxy-mounting) 直接挂载 vs 代理挂载

`版本 2.2.7 新增`

FastMCP 支持两种挂载模式：

1. **直接挂载**（默认）：父服务器直接访问挂载服务器的内存对象。

   - 挂载服务器上不会发生客户端生命周期事件
   - 挂载服务器的生命周期上下文不会执行
   - 通过直接方法调用处理通信
2. **代理挂载**：父服务器将挂载的服务器视为单独的实体，并通过客户端接口与其通信。

   - 挂载服务器上发生完整的客户端生命周期事件
   - 当客户端连接时，挂载服务器的生命周期被执行
   - 通过内存中的 Client 传输进行通信

```
# 直接挂载（无自定义生命周期时默认）
main_mcp.mount(api_server, prefix="api")

# 代理挂载（保留完整的客户端生命周期）
main_mcp.mount(api_server, prefix="api", as_proxy=True)

# 无前缀挂载（组件可无前缀访问）
main_mcp.mount(api_server)

```

当挂载的服务器具有自定义生命周期时，FastMCP 自动使用代理挂载，但您可以使用 `as_proxy` 参数覆盖此行为。

#### [​](https://gofastmcp.com/servers/composition\#interaction-with-proxy-servers) 与代理服务器的交互

使用 `FastMCP.as_proxy()` 创建代理服务器时，挂载该服务器将始终使用代理挂载：

```
# 为远程服务器创建代理
remote_proxy = FastMCP.as_proxy(Client("http://example.com/mcp"))

# 挂载代理（始终使用代理挂载）
main_server.mount(remote_proxy, prefix="remote")

```

## [​](https://gofastmcp.com/servers/composition\#resource-prefix-formats) 资源前缀格式

`版本 2.4.0 新增`

挂载或导入服务器时，资源 URI 通常会添加前缀以避免命名冲突。FastMCP 支持两种不同的资源前缀格式：

### [​](https://gofastmcp.com/servers/composition\#path-format-default) 路径格式（默认）

在路径格式中，前缀添加到 URI 的路径部分：

```
resource://prefix/path/to/resource

```

这是 FastMCP 2.4 以来的默认格式。推荐使用此格式，因为它避免了 URI 协议限制的问题（如协议名称中不允许使用下划线）。

### [​](https://gofastmcp.com/servers/composition\#protocol-format-legacy) 协议格式（旧版）

在协议格式中，前缀作为协议的一部分添加：

```
prefix+resource://path/to/resource

```

这是 FastMCP 2.4 之前的默认格式。虽然仍然支持，但不建议用于新代码，因为它可能导致前缀名称在 URI 协议中无效的问题。

### [​](https://gofastmcp.com/servers/composition\#configuring-the-prefix-format) 配置前缀格式

您可以在代码中全局配置前缀格式：

```
import fastmcp
fastmcp.settings.resource_prefix_format = "protocol"

```

或通过环境变量：

```
FASTMCP_RESOURCE_PREFIX_FORMAT=protocol

```

或按服务器配置：

```
from fastmcp import FastMCP

# 创建使用旧版协议格式的服务器
server = FastMCP("LegacyServer", resource_prefix_format="protocol")

# 创建使用新路径格式的服务器
server = FastMCP("NewServer", resource_prefix_format="path")

```

挂载或导入服务器时，使用父服务器的前缀格式。

[代理服务器](https://gofastmcp.com/servers/proxy) [运行服务器](https://gofastmcp.com/deployment/running-server)

本页内容

- [为什么要组合服务器？](https://gofastmcp.com/servers/composition#why-compose-servers%3F)
- [导入 vs 挂载](https://gofastmcp.com/servers/composition#importing-vs-mounting)
- [代理服务器](https://gofastmcp.com/servers/composition#proxy-servers)
- [导入（静态组合）](https://gofastmcp.com/servers/composition#importing-static-composition)
- [导入的工作原理](https://gofastmcp.com/servers/composition#how-importing-works)
- [无前缀导入](https://gofastmcp.com/servers/composition#importing-without-prefixes)
- [冲突解决](https://gofastmcp.com/servers/composition#conflict-resolution)
- [挂载（实时链接）](https://gofastmcp.com/servers/composition#mounting-live-linking)
- [挂载的工作原理](https://gofastmcp.com/servers/composition#how-mounting-works)
- [无前缀挂载](https://gofastmcp.com/servers/composition#mounting-without-prefixes)
- [直接挂载 vs 代理挂载](https://gofastmcp.com/servers/composition#direct-vs-proxy-mounting)
- [与代理服务器的交互](https://gofastmcp.com/servers/composition#interaction-with-proxy-servers)
- [资源前缀格式](https://gofastmcp.com/servers/composition#resource-prefix-formats)
- [路径格式（默认）](https://gofastmcp.com/servers/composition#path-format-default)
- [协议格式（旧版）](https://gofastmcp.com/servers/composition#protocol-format-legacy)
- [配置前缀格式](https://gofastmcp.com/servers/composition#configuring-the-prefix-format)