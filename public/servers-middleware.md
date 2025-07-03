服务器

MCP 中间件

`版本新增: 2.9.0`

MCP中间件是一个强大的概念，允许您向FastMCP服务器添加横切功能。与传统Web中间件不同，MCP中间件是专为模型上下文协议（Model Context Protocol）设计的，为不同类型的MCP操作（如工具调用、资源读取和提示词请求）提供钩子。

MCP中间件是FastMCP特有的概念，不属于官方MCP协议规范。此中间件系统设计用于FastMCP服务器，可能与其他MCP实现不兼容。

MCP中间件是一个全新的概念，未来版本可能会有重大变更。

## [​](https://gofastmcp.com/servers/middleware\#what-is-mcp-middleware%3F) 什么是MCP中间件？

MCP中间件允许您在MCP请求和响应流经服务器时拦截和修改它们。可以将其视为一个管道，其中每个中间件都可以检查正在发生的事情、进行更改，然后将控制权传递给链中的下一个中间件。

MCP中间件的常见用例包括：

- **认证和授权**：在执行操作前验证客户端权限
- **日志记录和监控**：跟踪使用模式和性能指标
- **速率限制**：控制每个客户端或操作类型的请求频率
- **请求/响应转换**：在数据到达工具之前或离开工具之后修改数据
- **缓存**：存储频繁请求的数据以提高性能
- **错误处理**：在服务器范围内提供一致的错误响应

## [​](https://gofastmcp.com/servers/middleware\#how-middleware-works) 中间件工作原理

FastMCP中间件采用管道模型运行。当请求进入时，它会按照添加到服务器的顺序流经中间件。每个中间件可以：

1. **检查传入请求**及其上下文
2. **修改请求**，然后传递给下一个中间件或处理程序
3. **通过调用`call_next()`执行链中的下一个中间件/处理程序**
4. **检查并修改响应**，然后返回
5. **处理处理过程中发生的错误**

核心思想是中间件形成一个链，其中每个部分决定是继续处理还是完全停止链。

如果您熟悉ASGI中间件，FastMCP中间件的基本结构会感觉很熟悉。本质上，中间件是一个可调用类，它接收一个包含当前JSON-RPC消息信息的上下文对象和一个继续中间件链的处理函数。

重要的是要理解MCP基于[JSON-RPC规范](https://spec.modelcontextprotocol.io/specification/basic/transports/)运行。虽然FastMCP以熟悉的方式呈现请求和响应，但这些本质上是JSON-RPC消息，而不是Web应用中常见的HTTP请求/响应对。FastMCP中间件适用于所有[传输类型](https://gofastmcp.com/clients/transports)，包括本地标准输入输出传输和HTTP传输，尽管并非所有中间件实现都兼容所有传输（例如，检查HTTP头的中间件不适用于标准输入输出传输）。

实现中间件的最基本方法是重写`Middleware`基类上的`__call__`方法：


```
from fastmcp.server.middleware import Middleware, MiddlewareContext

class RawMiddleware(Middleware):
    async def __call__(self, context: MiddlewareContext, call_next):
        # 此方法接收所有消息，无论类型如何
        print(f"原始中间件处理: {context.method}")
        result = await call_next(context)
        print(f"原始中间件完成: {context.method}")
        return result

```

这使您可以完全控制流经服务器的每条消息，但需要手动处理所有消息类型。

## [​](https://gofastmcp.com/servers/middleware\#middleware-hooks) 中间件钩子

为了让用户更容易定位特定类型的消息，FastMCP中间件提供了各种专门的钩子。您无需实现原始的`__call__`方法，而是可以重写特定的钩子方法，这些方法仅针对某些类型的操作调用，允许您为中间件逻辑精确定位所需的特异性级别。

### [​](https://gofastmcp.com/servers/middleware\#hook-hierarchy-and-execution-order) 钩子层次结构和执行顺序

FastMCP提供了多个钩子，这些钩子以不同的特异性级别被调用。理解此层次结构对于有效的中间件设计至关重要。

当请求进入时，**同一请求可能会调用多个钩子**，从一般到特定：

1. **`on_message`** - 为所有MCP消息调用（请求和通知）
2. **`on_request`或`on_notification`** - 根据消息类型调用
3. **特定操作钩子** - 为特定MCP操作调用，如`on_call_tool`

例如，当客户端调用工具时，中间件将接收**三个单独的钩子调用**：

1. 首先：`on_message`（因为它是任何MCP消息）
2. 其次：`on_request`（因为工具调用需要响应）
3. 第三：`on_call_tool`（因为它专门是工具执行）

此层次结构允许您以适当的特异性级别定位中间件逻辑。使用`on_message`处理日志记录等广泛问题，使用`on_request`处理认证，使用`on_call_tool`处理工具特定逻辑（如性能监控）。

### [​](https://gofastmcp.com/servers/middleware\#available-hooks) 可用钩子

- `on_message`：为所有MCP消息调用（请求和通知）
- `on_request`：专门为MCP请求调用（需要响应）
- `on_notification`：专门为MCP通知调用（即发即弃）
- `on_call_tool`：执行工具时调用
- `on_read_resource`：读取资源时调用
- `on_get_prompt`：检索提示词时调用
- `on_list_tools`：列出可用工具时调用
- `on_list_resources`：列出可用资源时调用
- `on_list_resource_templates`：列出资源模板时调用
- `on_list_prompts`：列出可用提示词时调用

## [​](https://gofastmcp.com/servers/middleware\#component-access-in-middleware) 中间件中的组件访问

了解如何在中间件中访问组件信息（工具、资源、提示词）对于构建强大的中间件功能至关重要。列表操作和执行操作的访问模式有显著差异。

### [​](https://gofastmcp.com/servers/middleware\#listing-operations-vs-execution-operations) 列表操作与执行操作

FastMCP中间件对两种类型的操作处理方式不同：

**列表操作**（`on_list_tools`、`on_list_resources`、`on_list_prompts`等）：

- 中间件接收**FastMCP组件对象**及完整元数据
- 这些对象包含`tags`等非MCP规范的FastMCP特定属性
- 结果包含完整的组件信息，然后才转换为MCP格式
- 最终返回给MCP客户端时，标签和其他元数据会被剥离

**执行操作**（`on_call_tool`、`on_read_resource`、`on_get_prompt`）：

- 中间件在**组件执行前**运行
- 中间件结果要么是执行结果，要么是组件未找到时的错误
- 钩子参数中不直接提供组件元数据

### [​](https://gofastmcp.com/servers/middleware\#accessing-component-metadata-during-execution) 执行期间访问组件元数据

如果需要在执行操作期间检查组件属性（如标签），请使用上下文中可用的FastMCP服务器实例：

```
from fastmcp.server.middleware import Middleware, MiddlewareContext
from fastmcp.exceptions import ToolError

class TagBasedMiddleware(Middleware):
    async def on_call_tool(self, context: MiddlewareContext, call_next):
        # 访问工具对象以检查其元数据
        if context.fastmcp_context:
            try:
                tool = await context.fastmcp_context.fastmcp.get_tool(context.message.name)

                # 检查此工具是否有"private"标签
                if "private" in tool.tags:
                    raise ToolError("访问被拒绝：私有工具")

                # 检查工具是否启用
                if not tool.enabled:
                    raise ToolError("工具当前已禁用")

            except Exception:
                # 工具未找到或其他错误 - 让执行继续
                # 并自然处理错误
                pass

        return await call_next(context)

```

相同模式适用于资源和提示词：

```
from fastmcp.server.middleware import Middleware, MiddlewareContext
from fastmcp.exceptions import ResourceError, PromptError

class ComponentAccessMiddleware(Middleware):
    async def on_read_resource(self, context: MiddlewareContext, call_next):
        if context.fastmcp_context:
            try:
                resource = await context.fastmcp_context.fastmcp.get_resource(context.message.uri)
                if "restricted" in resource.tags:
                    raise ResourceError("访问被拒绝：受限资源")
            except Exception:
                pass
        return await call_next(context)

    async def on_get_prompt(self, context: MiddlewareContext, call_next):
        if context.fastmcp_context:
            try:
                prompt = await context.fastmcp_context.fastmcp.get_prompt(context.message.name)
                if not prompt.enabled:
                    raise PromptError("提示词当前已禁用")
            except Exception:
                pass
        return await call_next(context)

```

### [​](https://gofastmcp.com/servers/middleware\#working-with-listing-results) 处理列表结果

对于列表操作，您可以直接检查和修改FastMCP组件：

```
from fastmcp.server.middleware import Middleware, MiddlewareContext, ListToolsResult

class ListingFilterMiddleware(Middleware):
    async def on_list_tools(self, context: MiddlewareContext, call_next):
        result = await call_next(context)

        # 过滤掉带有"private"标签的工具
        filtered_tools = {
            name: tool for name, tool in result.tools.items()
            if "private" not in tool.tags
        }

        # 返回修改后的结果
        return ListToolsResult(tools=filtered_tools)

```

此过滤在组件转换为MCP格式并返回给客户端之前发生，因此标签（FastMCP特定）在最终响应中自然被剥离。

### [​](https://gofastmcp.com/servers/middleware\#anatomy-of-a-hook) 钩子结构

每个中间件钩子都遵循相同的模式。让我们检查`on_message`钩子以了解其结构：


```
async def on_message(self, context: MiddlewareContext, call_next):
    # 1. 预处理：检查并可选地修改请求
    print(f"处理 {context.method}")

    # 2. 链继续：调用下一个中间件/处理程序
    result = await call_next(context)

    # 3. 后处理：检查并可选地修改响应
    print(f"完成 {context.method}")

    # 4. 返回结果（可能已修改）
    return result

```

### [​](https://gofastmcp.com/servers/middleware\#hook-parameters) 钩子参数

每个钩子接收两个参数：

1. **`context: MiddlewareContext`** - 包含当前请求的信息：
   - `context.method` - MCP方法名称（例如，“tools/call”）
   - `context.source` - 请求来源（“client”或“server”）
   - `context.type` - 消息类型（“request”或“notification”）
   - `context.message` - MCP消息数据
   - `context.timestamp` - 请求接收时间
   - `context.fastmcp_context` - FastMCP上下文对象（如果可用）
2. **`call_next`** - 继续中间件链的函数。除非您想完全停止处理，否则**必须**调用此函数。


### [​](https://gofastmcp.com/servers/middleware\#control-flow) 控制流

您可以完全控制请求流：

- **继续处理**：调用`await call_next(context)`继续
- **修改请求**：调用`call_next`前更改上下文
- **修改响应**：调用`call_next`后更改结果
- **停止链**：不调用`call_next`（很少需要）
- **处理错误**：将`call_next`包装在try/catch块中

## [​](https://gofastmcp.com/servers/middleware\#creating-middleware) 创建中间件

FastMCP中间件通过子类化`Middleware`基类并覆盖所需的钩子来实现。您只需实现与用例相关的钩子。


```
from fastmcp import FastMCP
from fastmcp.server.middleware import Middleware, MiddlewareContext

class LoggingMiddleware(Middleware):
    """记录所有MCP操作的中间件。"""

    async def on_message(self, context: MiddlewareContext, call_next):
        """为所有MCP消息调用。"""
        print(f"处理 {context.method} 来自 {context.source}")

        result = await call_next(context)

        print(f"完成 {context.method}")
        return result

# 将中间件添加到服务器
mcp = FastMCP("MyServer")
mcp.add_middleware(LoggingMiddleware())

```

这创建了一个基本的日志记录中间件，它将打印流经服务器的每个请求的信息。

## [​](https://gofastmcp.com/servers/middleware\#adding-middleware-to-your-server) 向服务器添加中间件

### [​](https://gofastmcp.com/servers/middleware\#single-middleware) 单个中间件

向服务器添加中间件很简单：

```
mcp = FastMCP("MyServer")
mcp.add_middleware(LoggingMiddleware())

```

### [​](https://gofastmcp.com/servers/middleware\#multiple-middleware) 多个中间件

中间件按照添加到服务器的顺序执行。添加的第一个中间件在进入时首先运行，在退出时最后运行：


```
mcp = FastMCP("MyServer")

mcp.add_middleware(AuthenticationMiddleware("secret-token"))
mcp.add_middleware(PerformanceMiddleware())
mcp.add_middleware(LoggingMiddleware())

```

这创建了以下执行流程：

1. AuthenticationMiddleware（预处理）
2. PerformanceMiddleware（预处理）
3. LoggingMiddleware（预处理）
4. 实际工具/资源处理程序
5. LoggingMiddleware（后处理）
6. PerformanceMiddleware（后处理）
7. AuthenticationMiddleware（后处理）

## [​](https://gofastmcp.com/servers/middleware\#server-composition-and-middleware) 服务器组合和中间件

当使用`mount`或`import_server`进行[服务器组合](https://gofastmcp.com/servers/composition)时，中间件行为遵循以下规则：

1. **父服务器中间件**为所有请求运行，包括路由到挂载服务器的请求
2. **挂载服务器中间件**仅为该特定服务器处理的请求运行
3. **中间件顺序**在每个服务器内保留

这允许您创建分层中间件架构，其中父服务器处理认证等横切关注点，而子服务器专注于特定领域的中间件。


```
# 带有中间件的父服务器
parent = FastMCP("Parent")
parent.add_middleware(AuthenticationMiddleware("token"))

# 带有自己中间件的子服务器
child = FastMCP("Child")
child.add_middleware(LoggingMiddleware())

@child.tool
def child_tool() -> str:
    return "来自子服务器"

# 挂载子服务器
parent.mount(child, prefix="child")

```

当客户端调用“child\_tool”时，请求将首先流经父服务器的认证中间件，然后路由到子服务器，在那里它将通过子服务器的日志记录中间件。

## [​](https://gofastmcp.com/servers/middleware\#examples) 示例

### [​](https://gofastmcp.com/servers/middleware\#authentication-middleware) 认证中间件

此中间件检查所有请求上的有效授权令牌：


```
from fastmcp.server.middleware import Middleware, MiddlewareContext
from fastmcp.exceptions import ToolError

class AuthenticationMiddleware(Middleware):
    def __init__(self, required_token: str):
        self.required_token = required_token

    async def on_request(self, context: MiddlewareContext, call_next):
        if hasattr(context, 'fastmcp_context') and context.fastmcp_context:
            try:
                request = context.fastmcp_context.get_http_request()
                auth_header = request.headers.get("Authorization")

                if not auth_header or not auth_header.startswith("Bearer "):
                    raise ToolError("缺少或无效的授权头")

                token = auth_header.split(" ", 1)[1]
                if token != self.required_token:
                    raise ToolError("无效的认证令牌")

            except Exception:
                pass

        return await call_next(context)

# 使用
mcp = FastMCP("SecureServer")
mcp.add_middleware(AuthenticationMiddleware("secret-token-123"))

```

### [​](https://gofastmcp.com/servers/middleware\#performance-monitoring-middleware) 性能监控中间件

此中间件跟踪工具执行所需的时间：

```
import time
import logging

class PerformanceMiddleware(Middleware):
    def __init__(self):
        self.logger = logging.getLogger("performance")

    async def on_call_tool(self, context: MiddlewareContext, call_next):
        tool_name = context.message.name
        start_time = time.time()

        try:
            result = await call_next(context)
            execution_time = time.time() - start_time

            self.logger.info(
                f"工具 {tool_name} 完成于 {execution_time:.3f}秒"
            )

            return result

        except Exception as e:
            execution_time = time.time() - start_time
            self.logger.error(
                f"工具 {tool_name} 在 {execution_time:.3f}秒后失败: {e}"
            )
            raise

```

### [​](https://gofastmcp.com/servers/middleware\#request-transformation-middleware) 请求转换中间件

此中间件向工具调用添加元数据：

```
class TransformationMiddleware(Middleware):
    async def on_call_tool(self, context: MiddlewareContext, call_next):
        if hasattr(context.message, 'arguments'):
            args = context.message.arguments or {}
            args['_middleware...(2634字符被截断)