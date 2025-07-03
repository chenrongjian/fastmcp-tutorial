核心组件

提示词

提示词是可重用的消息模板，帮助LLM生成结构化、有目的的响应。FastMCP简化了这些模板的定义，主要使用`@mcp.prompt`装饰器。

## [​](https://gofastmcp.com/servers/prompts\#what-are-prompts%3F) 什么是提示词？

提示词为LLM提供参数化的消息模板。当客户端请求提示词时：

1. FastMCP找到相应的提示词定义。
2. 如果有参数，会根据函数签名进行验证。
3. 函数使用验证后的输入执行。
4. 生成的消息返回给LLM以指导其响应。

这使您能够定义一致、可重用的模板，供LLM在不同客户端和上下文中使用。

## [​](https://gofastmcp.com/servers/prompts\#prompts) 提示词

### [​](https://gofastmcp.com/servers/prompts\#the-%40prompt-decorator) `@prompt`装饰器

定义提示词最常见的方式是装饰Python函数。装饰器使用函数名作为提示词的标识符。


```
from fastmcp import FastMCP
from fastmcp.prompts.prompt import Message, PromptMessage, TextContent

mcp = FastMCP(name="PromptServer")

# 基本提示词返回字符串（自动转换为用户消息）
@mcp.prompt
def ask_about_topic(topic: str) -> str:
    """生成询问主题解释的用户消息。"""
    return f"你能解释一下'{topic}'的概念吗？"

# 返回特定消息类型的提示词
@mcp.prompt
def generate_code_request(language: str, task_description: str) -> PromptMessage:
    """生成请求代码生成的用户消息。"""
    content = f"编写一个{language}函数来执行以下任务：{task_description}"
    return PromptMessage(role="user", content=TextContent(type="text", text=content))

```

**核心概念：**

- **名称：** 默认情况下，提示词名称取自函数名。
- **参数：** 函数参数定义生成提示词所需的输入。
- **推断元数据：** 默认情况下：

  - 提示词名称：取自函数名（`ask_about_topic`）。
  - 提示词描述：取自函数的文档字符串。

带有`*args`或`**kwargs`的函数不支持作为提示词。此限制存在是因为FastMCP需要为MCP协议生成完整的参数模式，而使用可变参数列表无法实现这一点。

### [​](https://gofastmcp.com/servers/prompts\#return-values) 返回值

FastMCP智能处理提示词函数的不同返回类型：

- **`str`：** 自动转换为单个`PromptMessage`。
- **`PromptMessage`：** 直接按提供的方式使用。（注意：有一个更友好的`Message`构造函数，可接受原始字符串而不是`TextContent`对象。）
- **`list[PromptMessage | str]`：** 用作消息序列（对话）。
- **`Any`：** 如果返回类型不是上述之一，将尝试将返回值转换为字符串并用作`PromptMessage`。

```
from fastmcp.prompts.prompt import Message

@mcp.prompt
def roleplay_scenario(character: str, situation: str) -> list[Message]:
    """设置带有初始消息的角色扮演场景。"""
    return [\
        Message(f"我们来角色扮演吧。你是{character}。情景是：{situation}"),\
        Message("好的，我明白了。我准备好了。接下来会发生什么？", role="assistant")\
    ]

```

### [​](https://gofastmcp.com/servers/prompts\#type-annotations) 类型注解

类型注解对提示词很重要。它们：

1. 告知FastMCP每个参数的预期类型。
2. 允许验证从客户端接收的参数。
3. 用于为MCP协议生成提示词的模式。


```
from pydantic import Field
from typing import Literal, Optional

@mcp.prompt
def generate_content_request(
    topic: str = Field(description="要涵盖的主要主题"),
    format: Literal["blog", "email", "social"] = "blog",
    tone: str = "professional",
    word_count: Optional[int] = None
) -> str:
    """创建生成特定格式内容的请求。"""
    prompt = f"请以{tone}语气写一篇关于{topic}的{format}文章。"

    if word_count:
        prompt += f" 文章长度应约为{word_count}字。"

    return prompt

```

### [​](https://gofastmcp.com/servers/prompts\#required-vs-optional-parameters) 必需参数与可选参数

函数签名中的参数被视为**必需**，除非它们有默认值。


```
@mcp.prompt
def data_analysis_prompt(
    data_uri: str,                        # 必需 - 无默认值
    analysis_type: str = "summary",       # 可选 - 有默认值
    include_charts: bool = False          # 可选 - 有默认值
) -> str:
    """创建使用特定参数分析数据的请求。"""
    prompt = f"请对{data_uri}处的数据执行'{analysis_type}'分析。"
    if include_charts:
        prompt += " 包括相关图表和可视化。"
    return prompt

```

在此示例中，客户端**必须**提供`data_uri`。如果省略`analysis_type`或`include_charts`，将使用它们的默认值。

### [​](https://gofastmcp.com/servers/prompts\#prompt-metadata) 提示词元数据

虽然FastMCP从函数推断名称和描述，但您可以使用`@mcp.prompt`装饰器的参数覆盖这些并添加标签：


```
@mcp.prompt(
    name="analyze_data_request",          # 自定义提示词名称
    description="创建使用特定参数分析数据的请求",  # 自定义描述
    tags={"analysis", "data"}             # 可选分类标签
)
def data_analysis_prompt(
    data_uri: str = Field(description="包含数据的资源URI。"),
    analysis_type: str = Field(default="summary", description="分析类型。")
) -> str:
    """提供描述时，此文档字符串将被忽略。"""
    return f"请对{data_uri}处的数据执行'{analysis_type}'分析。"

```

- **`name`：** 设置通过MCP公开的显式提示词名称。
- **`description`：** 提供通过MCP公开的描述。如果设置，函数的文档字符串将为此目的被忽略。
- **`tags`：** 用于对提示词进行分类的字符串集合。客户端**可能**使用标签来筛选或分组可用提示词。
- **`enabled`：** 启用或禁用提示词的布尔值（默认为`True`）。有关更多信息，请参见[禁用提示词](https://gofastmcp.com/servers/prompts#disabling-prompts)。

### [​](https://gofastmcp.com/servers/prompts\#disabling-prompts) 禁用提示词

`版本新增：2.8.0`

您可以通过启用或禁用提示词来控制其可见性和可用性。禁用的提示词不会出现在可用提示词列表中，尝试调用禁用的提示词将导致“未知提示词”错误。

默认情况下，所有提示词都是启用的。您可以在创建时使用装饰器中的`enabled`参数禁用提示词：


```
@mcp.prompt(enabled=False)
def experimental_prompt():
    """此提示词尚未准备好使用。"""
    return "这是一个实验性提示词。"

```

您还可以在创建提示词后以编程方式切换其状态：


```
@mcp.prompt
def seasonal_prompt(): return "节日快乐！"

# 禁用并重新启用提示词
seasonal_prompt.disable()
seasonal_prompt.enable()

```

### [​](https://gofastmcp.com/servers/prompts\#asynchronous-prompts) 异步提示词

FastMCP无缝支持标准（`def`）和异步（`async def`）函数作为提示词。


```
# 同步提示词
@mcp.prompt
def simple_question(question: str) -> str:
    """生成要问LLM的简单问题。"""
    return f"问题：{question}"

# 异步提示词
@mcp.prompt
async def data_based_prompt(data_id: str) -> str:
    """基于需要获取的数据生成提示词。"""
    # 在实际场景中，您可能从数据库或API获取数据
    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://api.example.com/data/{data_id}") as response:
            data = await response.json()
            return f"分析此数据：{data['content']}"

```

当提示词函数执行I/O操作（如网络请求、数据库查询、文件I/O或外部服务调用）时，使用`async def`。

### [​](https://gofastmcp.com/servers/prompts\#accessing-mcp-context) 访问MCP上下文

`版本新增：2.2.5`

提示词可以通过`Context`对象访问其他MCP信息和功能。要访问它，请在提示词函数中添加一个类型注解为`Context`的参数：

```
from fastmcp import FastMCP, Context

mcp = FastMCP(name="PromptServer")

@mcp.prompt
async def generate_report_request(report_type: str, ctx: Context) -> str:
    """生成报告请求。"""
    return f"请创建{report_type}报告。请求ID：{ctx.request_id}"

```

有关Context对象及其所有功能的完整文档，请参见[Context文档](https://gofastmcp.com/servers/context)。

## [​](https://gofastmcp.com/servers/prompts\#server-behavior) 服务器行为

### [​](https://gofastmcp.com/servers/prompts\#duplicate-prompts) 重复提示词

`版本新增：2.1.0`

您可以配置FastMCP服务器如何处理尝试注册多个同名提示词的情况。在`FastMCP`初始化期间使用`on_duplicate_prompts`设置。


```
from fastmcp import FastMCP

mcp = FastMCP(
    name="PromptServer",
    on_duplicate_prompts="error"  # 如果提示词名称重复则引发错误
)

@mcp.prompt
def greeting(): return "你好，今天我能帮你什么？"

# 此注册尝试将引发ValueError，因为
# "greeting"已注册且行为设置为"error"。
# @mcp.prompt
# def greeting(): return "嗨！我能为你做什么？"

```

重复行为选项：

- `"warn"`（默认）：记录警告，新提示词替换旧提示词。
- `"error"`：引发`ValueError`，阻止重复注册。
- `"replace"`：静默替换现有提示词为新提示词。
- `"ignore"`：保留原始提示词并忽略新注册尝试。

[资源](https://gofastmcp.com/servers/resources) [上下文](https://gofastmcp.com/servers/context)

本页内容

- [什么是提示词？](https://gofastmcp.com/servers/prompts#what-are-prompts%3F)
- [提示词](https://gofastmcp.com/servers/prompts#prompts)
- [`@prompt`装饰器](https://gofastmcp.com/servers/prompts#the-%40prompt-decorator)
- [返回值](https://gofastmcp.com/servers/prompts#return-values)
- [类型注解](https://gofastmcp.com/servers/prompts#type-annotations)
- [必需参数与可选参数](https://gofastmcp.com/servers/prompts#required-vs-optional-parameters)
- [提示词元数据](https://gofastmcp.com/servers/prompts#prompt-metadata)
- [禁用提示词](https://gofastmcp.com/servers/prompts#disabling-prompts)
- [异步提示词](https://gofastmcp.com/servers/prompts#asynchronous-prompts)
- [访问MCP上下文](https://gofastmcp.com/servers/prompts#accessing-mcp-context)
- [服务器行为](https://gofastmcp.com/servers/prompts#server-behavior)
- [重复提示词](https://gofastmcp.com/servers/prompts#duplicate-prompts)