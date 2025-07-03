服务器

FastMCP服务器

FastMCP应用程序的核心是`FastMCP`服务器类。此类充当应用程序工具、资源和提示的主要容器，并管理与MCP客户端的通信。

## [​](https://gofastmcp.com/servers/fastmcp\#creating-a-server)  创建服务器

实例化服务器非常简单。通常，您需要为服务器提供一个名称，这有助于在客户端应用程序或日志中识别它。


```
from fastmcp import FastMCP

# 创建基本服务器实例
mcp = FastMCP(name="MyAssistantServer")

# 您还可以添加如何与服务器交互的说明
mcp_with_instructions = FastMCP(
    name="HelpfulAssistant",
    instructions="""
        此服务器提供数据分析工具。
        调用get_average()来分析数值数据。
    """,
)

```

`FastMCP`构造函数接受多个参数：

- `name`：（可选）服务器的人类可读名称。默认为“FastMCP”。
- `instructions`：（可选）如何与此服务器交互的描述。这些说明帮助客户端理解服务器的用途和可用功能。
- `lifespan`：（可选）用于服务器启动和关闭逻辑的异步上下文管理器函数。
- `tags`：（可选）用于标记服务器本身的一组字符串。
- `tools`：（可选）要添加到服务器的工具列表（或要转换为工具的函数）。在某些情况下，以编程方式提供工具可能比使用`@mcp.tool`装饰器更方便。
- `**settings`：对应于其他`ServerSettings`配置的关键字参数

## [​](https://gofastmcp.com/servers/fastmcp\#components)  组件

FastMCP服务器向客户端公开多种类型的组件：

### [​](https://gofastmcp.com/servers/fastmcp\#tools)  工具

工具是客户端可以调用以执行操作或访问外部系统的函数。

复制

询问AI

```
@mcp.tool
def multiply(a: float, b: float) -> float:
    """将两个数字相乘。"""
    return a * b

```

详见[工具](https://gofastmcp.com/servers/tools)文档。

### [​](https://gofastmcp.com/servers/fastmcp\#resources)  资源

资源公开客户端可以读取的数据源。

```
@mcp.resource("data://config")
def get_config() -> dict:
    """提供应用程序配置。"""
    return {"theme": "dark", "version": "1.0"}

```

详见[资源和模板](https://gofastmcp.com/servers/resources)文档。

### [​](https://gofastmcp.com/servers/fastmcp\#resource-templates)  资源模板

资源模板是参数化资源，允许客户端请求特定数据。

```
@mcp.resource("users://{user_id}/profile")
def get_user_profile(user_id: int) -> dict:
    """通过ID检索用户个人资料。"""
    # URI中的{user_id}被提取并传递给此函数
    return {"id": user_id, "name": f"User {user_id}", "status": "active"}

```

详见[资源和模板](https://gofastmcp.com/servers/resources)文档。

### [​](https://gofastmcp.com/servers/fastmcp\#prompts)  提示

提示是用于指导LLM的可重用消息模板。

```
@mcp.prompt
def analyze_data(data_points: list[float]) -> str:
    """创建请求分析数值数据的提示。"""
    formatted_data = ", ".join(str(point) for point in data_points)
    return f"请分析这些数据点：{formatted_data}"

```

详见[提示](https://gofastmcp.com/servers/prompts)文档。

## [​](https://gofastmcp.com/servers/fastmcp\#tag-based-filtering)  基于标签的过滤

`版本新增：2.8.0`

FastMCP支持基于标签的过滤，可根据可配置的包含/排除标签集选择性地公开组件。这对于为不同环境或用户创建服务器的不同视图非常有用。

定义组件时可以使用`tags`参数为其添加标签：


```
@mcp.tool(tags={"public", "utility"})
def public_tool() -> str:
    return "此工具是公开的"

@mcp.tool(tags={"internal", "admin"})
def admin_tool() -> str:
    return "此工具仅供管理员使用"

```

过滤逻辑如下：

- **包含标签**：如果指定，仅公开至少有一个匹配标签的组件
- **排除标签**：具有任何匹配标签的组件将被过滤掉
- **优先级**：排除标签始终优先于包含标签

要确保组件永不公开，可以在组件本身上设置`enabled=False`。要了解更多信息，请参阅特定组件的文档。

创建服务器时配置基于标签的过滤：

```
# 仅公开标记为"public"的组件
mcp = FastMCP(include_tags={"public"})

# 隐藏标记为"internal"或"deprecated"的组件
mcp = FastMCP(exclude_tags={"internal", "deprecated"})

# 组合使用：显示管理员工具但隐藏已弃用的工具
mcp = FastMCP(include_tags={"admin"}, exclude_tags={"deprecated"})

```

此过滤适用于所有组件类型（工具、资源、资源模板和提示），并影响列表和访问。

## [​](https://gofastmcp.com/servers/fastmcp\#running-the-server)  运行服务器

FastMCP服务器需要传输机制才能与客户端通信。通常，您通过在`FastMCP`实例上调用`mcp.run()`方法来启动服务器，通常在主服务器脚本的`if __name__ == "__main__":`块中。此模式确保与各种MCP客户端的兼容性。


```
# my_server.py
from fastmcp import FastMCP

mcp = FastMCP(name="MyServer")

@mcp.tool
def greet(name: str) -> str:
    """按名称问候用户。"""
    return f"Hello, {name}!"

if __name__ == "__main__":
    # 运行服务器，默认为STDIO传输
    mcp.run()

    # 要使用不同的传输，例如HTTP：
    # mcp.run(transport="streamable-http", host="127.0.0.1", port=9000)

```

FastMCP支持多种传输选项：

- STDIO（默认，用于本地工具）
- Streamable HTTP（推荐用于Web服务）
- SSE（传统Web传输，已弃用）

服务器也可以使用FastMCP CLI运行。

有关每种传输的详细信息、如何配置它们（主机、端口、路径）以及何时使用哪种传输，请参阅[**运行FastMCP服务器**](https://gofastmcp.com/deployment/running-server)指南。

## [​](https://gofastmcp.com/servers/fastmcp\#composing-servers)  组合服务器

`版本新增：2.2.0`

FastMCP支持使用`import_server`（静态复制）和`mount`（实时链接）将多个服务器组合在一起。这允许您将大型应用程序组织成模块化组件或重用现有服务器。

有关完整详细信息、最佳实践和示例，请参阅[服务器组合](https://gofastmcp.com/servers/composition)指南。

```
# 示例：导入子服务器
from fastmcp import FastMCP
import asyncio

main = FastMCP(name="Main")
sub = FastMCP(name="Sub")

@sub.tool
def hello():
    return "hi"

# 直接挂载
main.mount(sub, prefix="sub")

```

## [​](https://gofastmcp.com/servers/fastmcp\#proxying-servers)  代理服务器

`版本新增：2.0.0`

FastMCP可以使用`FastMCP.as_proxy`充当任何MCP服务器（本地或远程）的代理，让您能够桥接传输或为现有服务器添加前端。例如，您可以通过stdio在本地公开远程SSE服务器，反之亦然。

有关详细信息和高级用法，请参阅[代理服务器](https://gofastmcp.com/servers/proxy)指南。

```
from fastmcp import FastMCP, Client

backend = Client("http://example.com/mcp/sse")
proxy = FastMCP.as_proxy(backend, name="ProxyServer")
# 现在像使用任何FastMCP服务器一样使用代理

```

## [​](https://gofastmcp.com/servers/fastmcp\#server-configuration)  服务器配置

服务器可以使用初始化参数、全局设置和特定于传输的设置的组合进行配置。

### [​](https://gofastmcp.com/servers/fastmcp\#server-specific-configuration)  服务器特定配置

创建`FastMCP`实例时传递服务器特定设置，并控制服务器行为：

```
from fastmcp import FastMCP

# 配置服务器特定设置
mcp = FastMCP(
    name="ConfiguredServer",
    dependencies=["requests", "pandas>=2.0.0"],  # 可选的服务器依赖项
    include_tags={"public", "api"},              # 仅公开这些标记的组件
    exclude_tags={"internal", "deprecated"},     # 隐藏这些标记的组件
    on_duplicate_tools="error",                  # 处理重复注册
    on_duplicate_resources="warn",
    on_duplicate_prompts="replace",
)

```

### [​](https://gofastmcp.com/servers/fastmcp\#global-settings)  全局设置

全局设置影响所有FastMCP服务器，可以通过环境变量（前缀为`FASTMCP_`）或`.env`文件进行配置：

```
import fastmcp

# 访问全局设置
print(fastmcp.settings.log_level)        # 默认："INFO"
print(fastmcp.settings.mask_error_details)  # 默认：False
print(fastmcp.settings.resource_prefix_format)  # 默认："path"

```

常见的全局设置包括：

- **`log_level`**：日志级别（"DEBUG"、"INFO"、"WARNING"、"ERROR"、"CRITICAL"），通过`FASTMCP_LOG_LEVEL`设置
- **`mask_error_details`**：是否向客户端隐藏详细错误信息，通过`FASTMCP_MASK_ERROR_DETAILS`设置
- **`resource_prefix_format`**：如何格式化资源前缀（"path"或"protocol"），通过`FASTMCP_RESOURCE_PREFIX_FORMAT`设置

### [​](https://gofastmcp.com/servers/fastmcp\#transport-specific-configuration)  传输特定配置

运行服务器时提供传输设置，并控制网络行为：

```
# 运行时配置传输
mcp.run(
    transport="streamable-http",
    host="0.0.0.0",           # 绑定到所有接口
    port=9000,                # 自定义端口
    log_level="DEBUG",        # 覆盖全局日志级别
)

# 或异步使用
await mcp.run_async(
    transport="streamable-http",
    host="127.0.0.1",
    port=8080,
)

```

### [​](https://gofastmcp.com/servers/fastmcp\#environment-variables)  环境变量

可以通过环境变量配置设置：

```
# 全局设置
export FASTMCP_LOG_LEVEL=DEBUG
export FASTMCP_MASK_ERROR_DETAILS=True
export FASTMCP_RESOURCE_PREFIX_FORMAT=protocol

```

### [​](https://gofastmcp.com/servers/fastmcp\#custom-tool-serialization)  自定义工具序列化

`版本新增：2.2.7`

默认情况下，当需要将工具返回值转换为文本时，FastMCP会将其序列化为JSON。创建服务器时，您可以通过提供`tool_serializer`函数来自定义此行为：


```
import yaml
from fastmcp import FastMCP

# 定义一个将字典格式化为YAML的自定义序列化器
def yaml_serializer(data):
    return yaml.dump(data, sort_keys=False)

# 使用自定义序列化器创建服务器
mcp = FastMCP(name="MyServer", tool_serializer=yaml_serializer)

@mcp.tool
def get_config():
    """以YAML格式返回配置。"""
    return {"api_key": "abc123", "debug": True, "rate_limit": 100}

```

序列化器函数接受任何数据对象并返回字符串表示。这适用于工具的**所有非字符串返回值**。已返回字符串的工具将绕过序列化器。

此自定义在以下情况下非常有用：

- 以特定方式格式化数据（如YAML或自定义格式）
- 控制特定的序列化选项（如缩进或排序）
- 发送到客户端之前添加元数据或转换数据

如果序列化器函数引发异常，工具将回退到默认的JSON序列化，以避免服务器崩溃。

[变更日志](https://gofastmcp.com/changelog) [工具](https://gofastmcp.com/servers/tools)

本页面内容

- [创建服务器](https://gofastmcp.com/servers/fastmcp#creating-a-server)
- [组件](https://gofastmcp.com/servers/fastmcp#components)
- [工具](https://gofastmcp.com/servers/fastmcp#tools)
- [资源](https://gofastmcp.com/servers/fastmcp#resources)
- [资源模板](https://gofastmcp.com/servers/fastmcp#resource-templates)
- [提示](https://gofastmcp.com/servers/fastmcp#prompts)
- [基于标签的过滤](https://gofastmcp.com/servers/fastmcp#tag-based-filtering)
- [运行服务器](https://gofastmcp.com/servers/fastmcp#running-the-server)
- [组合服务器](https://gofastmcp.com/servers/fastmcp#composing-servers)
- [代理服务器](https://gofastmcp.com/servers/fastmcp#proxying-servers)
- [服务器配置](https://gofastmcp.com/servers/fastmcp#server-configuration)
- [服务器特定配置](https://gofastmcp.com/servers/fastmcp#server-specific-configuration)
- [全局设置](https://gofastmcp.com/servers/fastmcp#global-settings)
- [传输特定配置](https://gofastmcp.com/servers/fastmcp#transport-specific-configuration)
- [环境变量](https://gofastmcp.com/servers/fastmcp#environment-variables)
- [自定义工具序列化](https://gofastmcp.com/servers/fastmcp#custom-tool-serialization)