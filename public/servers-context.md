核心组件

MCP 上下文

在定义FastMCP [工具](https://gofastmcp.com/servers/tools)、[资源](https://gofastmcp.com/servers/resources)、资源模板或[提示词](https://gofastmcp.com/servers/prompts)时，您的函数可能需要与底层MCP会话交互或访问服务器功能。FastMCP为此提供了`Context`对象。

## [​](https://gofastmcp.com/servers/context\#what-is-context%3F) 什么是上下文？

`Context`对象提供了一个清晰的接口，用于在函数内访问MCP功能，包括：

- **日志记录**：向客户端发送调试、信息、警告和错误消息
- **进度报告**：向客户端更新长时间运行操作的进度
- **资源访问**：从服务器注册的资源中读取数据
- **LLM采样**：请求客户端的LLM基于提供的消息生成文本
- **请求信息**：访问当前请求的元数据
- **服务器访问**：必要时访问底层FastMCP服务器实例

## [​](https://gofastmcp.com/servers/context\#accessing-the-context) 访问上下文

### [​](https://gofastmcp.com/servers/context\#via-dependency-injection) 通过依赖注入

要在任何函数中使用上下文对象，只需在函数签名中添加一个参数并将其类型提示为`Context`。当函数被调用时，FastMCP会自动注入上下文实例。

**关键点：**

- 参数名称（例如`ctx`、`context`）无关紧要，只有类型提示`Context`才重要。
- 上下文参数可以放在函数签名的任何位置；它不会作为有效参数暴露给MCP客户端。
- 上下文是可选的——不需要它的函数可以完全省略该参数。
- 上下文方法是异步的，因此您的函数通常也需要是异步的。
- 类型提示可以是联合类型（`Context | None`）或使用`Annotated[]`，仍然可以正常工作。
- 上下文仅在请求期间可用；尝试在请求外使用上下文方法将引发错误。如果需要在请求外调试或调用上下文方法，可以将变量类型设为`Context | None=None`以避免缺少参数错误。

#### [​](https://gofastmcp.com/servers/context\#tools) 工具

复制

询问 AI

```
from fastmcp import FastMCP, Context

mcp = FastMCP(name="ContextDemo")

@mcp.tool
async def process_file(file_uri: str, ctx: Context) -> str:
    """处理文件，使用上下文进行日志记录和资源访问。"""
    # 上下文作为ctx参数可用
    return "文件已处理"

```

#### [​](https://gofastmcp.com/servers/context\#resources-and-templates) 资源和模板

`版本新增：2.2.5`

复制

询问 AI

```
@mcp.resource("resource://user-data")
async def get_user_data(ctx: Context) -> dict:
    """基于请求上下文获取个性化用户数据。"""
    # 上下文作为ctx参数可用
    return {"user_id": "example"}

@mcp.resource("resource://users/{user_id}/profile")
async def get_user_profile(user_id: str, ctx: Context) -> dict:
    """使用上下文感知日志记录获取用户配置文件。"""
    # 上下文作为ctx参数可用
    return {"id": user_id}

```

#### [​](https://gofastmcp.com/servers/context\#prompts) 提示词

`版本新增：2.2.5`

复制

询问 AI

```
@mcp.prompt
async def data_analysis_request(dataset: str, ctx: Context) -> str:
    """生成包含上下文信息的数据分析请求。"""
    # 上下文作为ctx参数可用
    return f"请分析以下数据集：{dataset}"

```

### [​](https://gofastmcp.com/servers/context\#via-dependency-function) 通过依赖函数

`版本新增：2.2.11`

虽然通过上述函数参数注入访问上下文是最简单的方法，但在某些情况下，您需要在可能难以修改以接受上下文参数的代码中，或在函数调用深处访问上下文。

FastMCP提供依赖函数，允许您从服务器请求执行流程中的任何位置检索活动上下文：

复制

询问 AI

```
from fastmcp import FastMCP, Context
from fastmcp.server.dependencies import get_context

mcp = FastMCP(name="DependencyDemo")

# 需要上下文但未将其作为参数接收的实用函数
async def process_data(data: list[float]) -> dict:
    # 获取活动上下文——仅在请求内调用时有效
    ctx = get_context()
    await ctx.info(f"正在处理{len(data)}个数据点")

@mcp.tool
async def analyze_dataset(dataset_name: str) -> dict:
    # 调用在内部使用上下文的实用函数
    data = load_data(dataset_name)
    await process_data(data)

```

**重要说明：**

- `get_context`函数应仅在服务器请求上下文中使用。在请求外调用它将引发`RuntimeError`。
- `get_context`函数仅适用于服务器，不应在客户端代码中使用。

## [​](https://gofastmcp.com/servers/context\#context-capabilities) 上下文功能

### [​](https://gofastmcp.com/servers/context\#logging) 日志记录

向MCP客户端发送日志消息。这对于调试和在请求期间提供函数执行的可见性非常有用。

复制

询问 AI

```
@mcp.tool
async def analyze_data(data: list[float], ctx: Context) -> dict:
    """通过日志记录分析数值数据。"""
    await ctx.debug("开始数值数据分析")
    await ctx.info(f"正在分析{len(data)}个数据点")

    try:
        result = sum(data) / len(data)
        await ctx.info(f"分析完成，平均值：{result}")
        return {"average": result, "count": len(data)}
    except ZeroDivisionError:
        await ctx.warning("提供了空数据列表")
        return {"error": "空数据列表"}
    except Exception as e:
        await ctx.error(f"分析失败：{str(e)}")
        raise

```

**可用日志方法：**

- **`ctx.debug(message: str)`**：用于调试的低级详细信息
- **`ctx.info(message: str)`**：关于执行的一般信息
- **`ctx.warning(message: str)`**：未阻止执行的潜在问题
- **`ctx.error(message: str)`**：执行期间发生的错误
- **`ctx.log(level: Literal["debug", "info", "warning", "error"], message: str, logger_name: str | None = None)`**：支持自定义日志名称的通用日志方法

### [​](https://gofastmcp.com/servers/context\#progress-reporting) 进度报告

对于长时间运行的操作，通知客户端进度。这允许客户端显示进度指示器并提供更好的用户体验。

复制

询问 AI

```
@mcp.tool
async def process_items(items: list[str], ctx: Context) -> dict:
    """通过进度更新处理项目列表。"""
    total = len(items)
    results = []

    for i, item in enumerate(items):
        # 以百分比报告进度
        await ctx.report_progress(progress=i, total=total)

        # 处理项目（用睡眠模拟）
        await asyncio.sleep(0.1)
        results.append(item.upper())

    # 报告100%完成
    await ctx.report_progress(progress=total, total=total)

    return {"processed": len(results), "results": results}

```

**方法签名：**

- **`ctx.report_progress(progress: float, total: float | None = None)`**
  - `progress`：当前进度值（例如24）
  - `total`：可选总值（例如100）。如果提供，客户端可能将其解释为百分比。

进度报告要求客户端在初始请求中发送了`progressToken`。如果客户端不支持进度报告，这些调用将无效。

### [​](https://gofastmcp.com/servers/context\#resource-access) 资源访问

从FastMCP服务器注册的资源中读取数据。这允许函数访问文件、配置或动态生成的内容。

复制

询问 AI

```
@mcp.tool
async def summarize_document(document_uri: str, ctx: Context) -> str:
    """通过资源URI总结文档。"""
    # 读取文档内容
    content_list = await ctx.read_resource(document_uri)

    if not content_list:
        return "文档为空"

    document_text = content_list[0].content

    # 示例：生成简单摘要（基于长度）
    words = document_text.split()
    total_words = len(words)

    await ctx.info(f"文档包含{total_words}个单词")

    # 返回简单摘要
    if total_words > 100:
        summary = " ".join(words[:100]) + "..."
        return f"摘要（共{total_words}个单词）：{summary}"
    else:
        return f"完整文档（{total_words}个单词）：{document_text}"

```

**方法签名：**

- **`ctx.read_resource(uri: str | AnyUrl) -> list[ReadResourceContents]`**
  - `uri`：要读取的资源URI
  - 返回资源内容部分的列表（通常只包含一个项目）

返回的内容通常通过`content_list[0].content`访问，根据资源类型可以是文本或二进制数据。

### [​](https://gofastmcp.com/servers/context\#llm-sampling) LLM采样

`版本新增：2.0.0`

请求客户端的LLM基于提供的消息生成文本。当您的函数需要利用LLM的能力处理数据或生成响应时，这非常有用。

复制

询问 AI

```
@mcp.tool
async def analyze_sentiment(text: str, ctx: Context) -> dict:
    """使用客户端的LLM分析文本情感。"""
    # 创建请求情感分析的采样提示
    prompt = f"将以下文本的情感分析为积极、消极或中性。只需输出一个词——'positive'、'negative'或'neutral'。要分析的文本：{text}"

    # 将采样请求发送到客户端的LLM（提供您想要使用的模型提示）
    response = await ctx.sample(prompt, model_preferences="claude-3-sonnet")

    # 处理LLM的响应
    sentiment = response.text.strip().lower()

    # 映射到标准情感值
    if "positive" in sentiment:
        sentiment = "positive"
    elif "negative" in sentiment:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {"text": text, "sentiment": sentiment}

```

**方法签名：**

- **`ctx.sample(messages: str | list[str | SamplingMessage], system_prompt: str | None = None, temperature: float | None = None, max_tokens: int | None = None, model_preferences: ModelPreferences | str | list[str] | None = None) -> TextContent | ImageContent`**
  - `messages`：发送给LLM的字符串或字符串/消息对象列表
  - `system_prompt`：可选的系统提示，用于指导LLM的行为
  - `temperature`：可选的采样温度（控制随机性）
  - `max_tokens`：可选的最大生成令牌数（默认为512）
  - `model_preferences`：可选的模型选择偏好（例如模型提示字符串、提示列表或ModelPreferences对象）
  - 返回LLM的响应，为TextContent或ImageContent

提供简单字符串时，它被视为用户消息。对于更复杂的场景，您可以提供具有不同角色的消息列表。

复制

询问 AI

````
@mcp.tool
async def generate_example(concept: str, ctx: Context) -> str:
    """为给定概念生成Python代码示例。"""
    # 使用系统提示和用户消息
    response = await ctx.sample(
        messages=f"编写一个简单的Python代码示例，演示'{concept}'。",
        system_prompt="您是一名专业的Python程序员。提供简洁、可运行的代码示例，无需解释。",
        temperature=0.7,
        max_tokens=300
    )

    code_example = response.text
    return f"```python\n{code_example}\n```"

````

有关客户端如何处理这些请求的更多详细信息，请参见[客户端采样](https://gofastmcp.com/clients/client#llm-sampling)。

### [​](https://gofastmcp.com/servers/context\#request-information) 请求信息

访问有关当前请求和客户端的元数据。

复制

询问 AI

```
@mcp.tool
async def request_info(ctx: Context) -> dict:
    """返回有关当前请求的信息。"""
    return {
        "request_id": ctx.request_id,
        "client_id": ctx.client_id or "未知客户端"
    }

```

**可用属性：**

- **`ctx.request_id -> str`**：获取当前MCP请求的唯一ID
- **`ctx.client_id -> str | None`**：获取发出请求的客户端ID（如果在初始化期间提供）
- **`ctx.session_id -> str | None`**：获取用于基于会话的数据共享的MCP会话ID（仅HTTP传输）

### [​](https://gofastmcp.com/servers/context\#advanced-access) 高级访问

#### [​](https://gofastmcp.com/servers/context\#fastmcp-server-and-sessions) FastMCP服务器和会话

复制

询问 AI

```
@mcp.tool
async def advanced_tool(ctx: Context) -> str:
    """演示高级上下文访问。"""
    # 访问FastMCP服务器实例
    server_name = ctx.fastmcp.name

    # 低级会话访问（很少需要）
    session = ctx.session
    request_context = ctx.request_context

    return f"服务器：{server_name}"

```

#### [​](https://gofastmcp.com/servers/context\#http-requests) HTTP请求

`版本新增：2.2.7`

`ctx.get_http_request()`方法已弃用，将在未来版本中删除。
请改用`get_http_request()`依赖函数。
有关更多详细信息，请参见[HTTP请求模式](https://gofastmcp.com/patterns/http-requests)。

对于Web应用程序，您可以访问底层HTTP请求：

复制

询问 AI

```
@mcp.tool
async def handle_web_request(ctx: Context) -> dict:
    """从Starlette请求访问HTTP请求信息。"""
    request = ctx.get_http_request()

    # 访问HTTP头、查询参数等
    user_agent = request.headers.get("user-agent", "未知")
    client_ip = request.client.host if request.client else "未知"

    return {
        "user_agent": user_agent,
        "client_ip": client_ip,
        "path": request.url.path,
    }

```

#### [​](https://gofastmcp.com/servers/context\#advanced-properties-reference) 高级属性参考

- **`ctx.fastmcp -> FastMCP`**：访问上下文所属的服务器实例
- **`ctx.session`**：访问原始`mcp.server.session.ServerSession`对象
- **`ctx.request_context`**：访问原始`mcp.shared.context.RequestContext`对象

直接使用`session`或`request_context`需要了解低级MCP Python SDK，并且可能不如直接使用`Context`对象上提供的方法稳定。

[提示词](https://gofastmcp.com/servers/prompts) [Bearer认证](https://gofastmcp.com/servers/auth/bearer)

本页内容

- [什么是上下文？](https://gofastmcp.com/servers/context#what-is-context%3F)
- [访问上下文](https://gofastmcp.com/servers/context#accessing-the-context)
- [通过依赖注入](https://gofastmcp.com/servers/context#via-dependency-injection)
- [工具](https://gofastmcp.com/servers/context#tools)
- [资源和模板](https://gofastmcp.com/servers/context#resources-and-templates)
- [提示词](https://gofastmcp.com/servers/context#prompts)
- [通过依赖函数](https://gofastmcp.com/servers/context#via-dependency-function)
- [上下文功能](https://gofastmcp.com/servers/context#context-capabilities)
- [日志记录](https://gofastmcp.com/servers/context#logging)
- [进度报告](https://gofastmcp.com/servers/context#progress-reporting)
- [资源访问](https://gofastmcp.com/servers/context#resource-access)
- [LLM采样](https://gofastmcp.com/servers/context#llm-sampling)
- [请求信息](https://gofastmcp.com/servers/context#request-information)
- [高级访问](https://gofastmcp.com/servers/context#advanced-access)
- [FastMCP服务器和会话](https://gofastmcp.com/servers/context#fastmcp-server-and-sessions)
- [HTTP请求](https://gofastmcp.com/servers/context#http-requests)
- [高级属性参考](https://gofastmcp.com/servers/context#advanced-properties-reference)

助手

响应由AI生成，可能包含错误。