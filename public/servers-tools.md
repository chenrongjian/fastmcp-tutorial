核心组件

工具

工具是允许您的LLM与外部系统交互、执行代码和访问不在其训练数据中的核心构建块。在FastMCP中，工具是通过MCP协议向LLM公开的Python函数。

## [​](https://gofastmcp.com/servers/tools\#what-are-tools%3F)  什么是工具？

FastMCP中的工具将常规Python函数转换为LLM可以在对话过程中调用的功能。当LLM决定使用工具时：

1. 它根据工具的模式发送带有参数的请求。
2. FastMCP根据函数签名验证这些参数。
3. 函数使用验证后的输入执行。
4. 结果返回给LLM，LLM可以在其响应中使用该结果。

这允许LLM执行诸如查询数据库、调用API、进行计算或访问文件等任务——扩展其能力超出训练数据中的内容。

## [​](https://gofastmcp.com/servers/tools\#tools)  工具

### [​](https://gofastmcp.com/servers/tools\#the-%40tool-decorator)  `@tool`装饰器

创建工具非常简单，只需使用`@mcp.tool`装饰Python函数：

```
from fastmcp import FastMCP

mcp = FastMCP(name="CalculatorServer")

@mcp.tool
def add(a: int, b: int) -> int:
    """将两个整数相加。"""
    return a + b

```

注册此工具时，FastMCP会自动：

- 使用函数名（`add`）作为工具名称。
- 使用函数的文档字符串（`将两个整数相加...`）作为工具描述。
- 基于函数的参数和类型注释生成输入模式。
- 处理参数验证和错误报告。

您定义Python函数的方式决定了工具在LLM客户端中的显示和行为方式。

不支持将带有`*args`或`**kwargs`的函数作为工具。此限制的存在是因为FastMCP需要为MCP协议生成完整的参数模式，而使用可变参数列表无法实现这一点。

### [​](https://gofastmcp.com/servers/tools\#parameters)  参数

#### [​](https://gofastmcp.com/servers/tools\#annotations)  注释

参数的类型注释对于工具的正常功能至关重要。它们：

1. 告知LLM每个参数的预期数据类型
2. 使FastMCP能够验证来自客户端的输入数据
3. 为MCP协议生成准确的JSON模式

为参数使用标准Python类型注释：


```
@mcp.tool
def analyze_text(
    text: str,
    max_tokens: int = 100,
    language: str | None = None
) -> dict:
    """分析提供的文本。"""
    # 实现...

```

#### [​](https://gofastmcp.com/servers/tools\#parameter-metadata)  参数元数据

您可以使用Pydantic的`Field`类和`Annotated`为参数提供额外的元数据。这种方法是首选的，因为它更现代，并将类型提示与验证规则分开：

```
from typing import Annotated
from pydantic import Field

@mcp.tool
def process_image(
    image_url: Annotated[str, Field(description="要处理的图像URL")],
    resize: Annotated[bool, Field(description="是否调整图像大小")] = False,
    width: Annotated[int, Field(description="目标宽度（像素）", ge=1, le=2000)] = 800,
    format: Annotated[\
        Literal["jpeg", "png", "webp"],\
        Field(description="输出图像格式")\
    ] = "jpeg"
) -> dict:
    """处理图像，可选调整大小。"""
    # 实现...

```

您也可以将Field用作默认值，尽管Annotated方法是首选：

```
@mcp.tool
def search_database(
    query: str = Field(description="搜索查询字符串"),
    limit: int = Field(10, description="最大结果数", ge=1, le=100)
) -> list:
    """使用提供的查询搜索数据库。"""
    # 实现...

```

Field提供了几个验证和文档功能：

- `description`：参数的人类可读解释（显示给LLM）
- `ge`/`gt`/`le`/`lt`：大于/小于（或等于）约束
- `min_length`/`max_length`：字符串或集合长度约束
- `pattern`：字符串验证的正则表达式模式
- `default`：参数省略时的默认值

#### [​](https://gofastmcp.com/servers/tools\#supported-types)  支持的类型

FastMCP支持广泛的类型注释，包括所有Pydantic类型：

| 类型注释 | 示例 | 描述 |
| --- | --- | --- |
| 基本类型 | `int`, `float`, `str`, `bool` | 简单标量值 - 参见[内置类型](https://gofastmcp.com/servers/tools#built-in-types) |
| 二进制数据 | `bytes` | 二进制内容 - 参见[二进制数据](https://gofastmcp.com/servers/tools#binary-data) |
| 日期和时间 | `datetime`, `date`, `timedelta` | 日期和时间对象 - 参见[日期和时间类型](https://gofastmcp.com/servers/tools#date-and-time-types) |
| 集合类型 | `list[str]`, `dict[str, int]`, `set[int]` | 项目集合 - 参见[集合类型](https://gofastmcp.com/servers/tools#collection-types) |
| 可选类型 | `float | None`, `Optional[float]` | 可能为null/省略的参数 - 参见[联合和可选类型](https://gofastmcp.com/servers/tools#union-and-optional-types) |
| 联合类型 | `str | int`, `Union[str, int]` | 接受多种类型的参数 - 参见[联合和可选类型](https://gofastmcp.com/servers/tools#union-and-optional-types) |
| 约束类型 | `Literal["A", "B"]`, `Enum` | 具有特定允许值的参数 - 参见[约束类型](https://gofastmcp.com/servers/tools#constrained-types) |
| 路径 | `Path` | 文件系统路径 - 参见[路径](https://gofastmcp.com/servers/tools#paths) |
| UUIDs | `UUID` | 通用唯一标识符 - 参见[UUIDs](https://gofastmcp.com/servers/tools#uuids) |
| Pydantic模型 | `UserData` | 复杂结构化数据 - 参见[Pydantic模型](https://gofastmcp.com/servers/tools#pydantic-models) |

有关此处未列出的其他类型注释，请参阅下面的[参数类型](https://gofastmcp.com/servers/tools#parameter-types)部分以获取更详细的信息和示例。

#### [​](https://gofastmcp.com/servers/tools\#optional-arguments)  可选参数

FastMCP遵循Python的标准函数参数约定。没有默认值的参数是必需的，而有默认值的参数是可选的。


```
@mcp.tool
def search_products(
    query: str,                   # 必需 - 无默认值
    max_results: int = 10,        # 可选 - 有默认值
    sort_by: str = "relevance",   # 可选 - 有默认值
    category: str | None = None   # 可选 - 可以为None
) -> list[dict]:
    """搜索产品目录。"""
    # 实现...

```

在此示例中，LLM必须提供`query`参数，而`max_results`、`sort_by`和`category`如果未明确提供，将使用其默认值。

### [​](https://gofastmcp.com/servers/tools\#metadata)  元数据

虽然FastMCP从您的函数中推断名称和描述，但您可以使用`@mcp.tool`装饰器的参数覆盖这些并添加标签：


```
@mcp.tool(
    name="find_products",           # LLM使用的自定义工具名称
    description="使用可选类别过滤搜索产品目录。", # 自定义描述
    tags={"catalog", "search"},      # 用于组织/过滤的可选标签
)
def search_products_implementation(query: str, category: str | None = None) -> list[dict]:
    """内部函数描述（如果提供了上面的description，则忽略）。"""
    # 实现...
    print(f"在类别'{category}'中搜索'{query}'")
    return [{"id": 2, "name": "另一个产品"}]

```

- **`name`**：设置通过MCP公开的显式工具名称。
- **`description`**：提供通过MCP公开的描述。如果设置，函数的文档字符串将为此目的被忽略。
- **`tags`**：用于对工具进行分类的字符串集合。客户端可能使用标签来过滤或分组可用工具。
- **`enabled`**：启用或禁用工具的布尔值（默认为`True`）。有关更多信息，请参见[禁用工具](https://gofastmcp.com/servers/tools#disabling-tools)。
- **`exclude_args`**：要从显示给LLM的工具模式中排除的参数名称列表。有关更多信息，请参见[排除参数](https://gofastmcp.com/servers/tools#excluding-arguments)。

### [​](https://gofastmcp.com/servers/tools\#excluding-arguments)  排除参数

`版本新增：2.6.0`

您可以从显示给LLM的工具模式中排除某些参数。这对于在运行时注入的参数（如`state`、`user_id`或凭据）非常有用，这些参数不应暴露给LLM或客户端。只有具有默认值的参数可以被排除；尝试排除必需参数将引发错误。

示例：


```
@mcp.tool(
    name="get_user_details",
    exclude_args=["user_id"]
)
def get_user_details(user_id: str = None) -> str:
    # user_id将由服务器注入，不由LLM提供
    ...

```

使用此配置，`user_id`不会出现在工具的参数模式中，但仍可以在运行时由服务器或框架设置。

有关更复杂的工具转换，请参见[转换工具](https://gofastmcp.com/patterns/tool-transformation)。

### [​](https://gofastmcp.com/servers/tools\#disabling-tools)  禁用工具

`版本新增：2.8.0`

您可以通过启用或禁用工具来控制工具的可见性和可用性。这对于功能标记、维护或动态更改客户端可用的工具集非常有用。禁用的工具不会出现在`list_tools`返回的可用工具列表中，尝试调用禁用的工具将导致“未知工具”错误，就像工具不存在一样。

默认情况下，所有工具都是启用的。您可以在创建时使用装饰器中的`enabled`参数禁用工具：


```
@mcp.tool(enabled=False)
def maintenance_tool():
    """此工具当前正在维护中。"""
    return "此工具已禁用。"

```

您还可以在工具创建后以编程方式切换其状态：


```
@mcp.tool
def dynamic_tool():
    return "我是一个动态工具。"

# 禁用并重新启用工具
dynamic_tool.disable()
dynamic_tool.enable()

```

### [​](https://gofastmcp.com/servers/tools\#async-tools)  异步工具

FastMCP无缝支持标准（`def`）和异步（`async def`）函数作为工具。


```
# 同步工具（适用于CPU密集型或快速任务）
@mcp.tool
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """计算两个坐标之间的距离。"""
    # 实现...
    return 42.5

# 异步工具（理想用于I/O密集型操作）
@mcp.tool
async def fetch_weather(city: str) -> dict:
    """检索城市的当前天气状况。"""
    # 对涉及网络调用、文件I/O等的操作使用'async def'
    # 这可以防止在等待外部操作时阻塞服务器。
    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://api.example.com/weather/{city}") as response:
            # 返回前检查响应状态
            response.raise_for_status()
            return await response.json()

```

当您的工具需要执行可能等待外部系统（网络请求、数据库查询、文件访问）的操作时，使用`async def`以保持服务器响应。

### [​](https://gofastmcp.com/servers/tools\#return-values)  返回值

FastMCP自动将函数返回的值转换为客户端适当的MCP内容格式：

- **`str`**：作为`TextContent`发送。
- **`dict`、`list`、Pydantic `BaseModel`**：序列化为JSON字符串并作为`TextContent`发送。
- **`bytes`**：Base64编码并作为`BlobResourceContents`发送（通常在`EmbeddedResource`中）。
- **`fastmcp.utilities.types.Image`**：用于轻松返回图像数据的辅助类。作为`ImageContent`发送。
- **`fastmcp.utilities.types.Audio`**：用于轻松返回音频数据的辅助类。作为`AudioContent`发送。
- **`fastmcp.utilities.types.File`**：用于轻松返回二进制数据作为base64编码内容的辅助类。作为`EmbeddedResource`发送。
- **上述任何类型的列表**：自动适当地转换每个项目。
- **`None`**：导致空响应（没有内容发送回客户端）。

如果可能，FastMCP将尝试将其他类型序列化为字符串。

目前，FastMCP仅响应工具的返回**值**，而不是其返回**注释**。


```
from fastmcp import FastMCP
from fastmcp.utilities.types import Image
import io

try:
    from PIL import Image as PILImage
except ImportError:
    raise ImportError("请安装`pillow`库以运行此示例。")

mcp = FastMCP("Image Demo")

@mcp.tool
def generate_image(width: int, height: int, color: str) -> Image:
    """生成纯色图像。"""
    # 使用Pillow创建图像
    img = PILImage.new("RGB", (width, height), color=color)

    # 保存到字节缓冲区
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_bytes = buffer.getvalue()

    # 使用FastMCP的Image辅助类返回
    return Image(data=img_bytes, format="png")

@mcp.tool
def do_nothing() -> None:
    """此工具执行操作但不返回数据。"""
    print("执行副作用...")
    return None

```

### [​](https://gofastmcp.com/servers/tools\#error-handling)  错误处理

`版本新增：2.4.1`

如果您的工具遇到错误，您可以引发标准Python异常（`ValueError`、`TypeError`、`FileNotFoundError`、自定义异常等）或FastMCP `ToolError`。

默认情况下，所有异常（包括其详细信息）都会被记录并转换为MCP错误响应发送回客户端LLM。这有助于LLM理解失败并做出适当反应。

如果出于安全原因要屏蔽内部错误详细信息，您可以：

1. 创建`FastMCP`实例时使用`mask_error_details=True`参数：


```
mcp = FastMCP(name="SecureServer", mask_error_details=True)

```

2. 或使用`ToolError`显式控制发送给客户端的错误信息：


```
from fastmcp import FastMCP
from fastmcp.exceptions import ToolError

@mcp.tool
def divide(a: float, b: float) -> float:
    """将a除以b。"""

    if b == 0:
        # 无论mask_error_details设置如何，ToolError的错误消息始终发送给客户端
        raise ToolError("不允许除以零。")

    # 如果mask_error_details=True，此消息将被屏蔽
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("两个参数都必须是数字。")

    return a / b

```

当`mask_error_details=True`时，只有来自`ToolError`的错误消息会包含详细信息，其他异常将转换为通用消息。

### [​](https://gofastmcp.com/servers/tools\#annotations-2)  注释

`版本新增：2.2.7`

FastMCP允许您通过注释向工具添加专门的元数据。这些注释向客户端应用程序传达工具的行为，而不会在LLM提示中消耗令牌上下文。

注释在客户端应用程序中用于以下几个目的：

- 添加用户友好的显示标题
- 指示工具是否修改数据或系统
- 描述工具的安全配置文件（破坏性vs非破坏性）
- 信号工具是否与外部系统交互

您可以使用`@mcp.tool`装饰器中的`annotations`参数向工具添加注释：


```
@mcp.tool(
    annotations={
        "title": "计算总和",
        "readOnlyHint": True,
        "openWorldHint": False
    }
)
def calculate_sum(a: float, b: float) -> float:
    """将两个数字相加。"""
    return a + b

```

FastMCP支持这些标准注释：

| 注释 | 类型 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `title` | string | - | 用户界面的显示名称 |
| `readOnlyHint` | boolean | false | 指示工具是否仅读取而不进行更改 |
| `destructiveHint` | boolean | true | 对于非只读工具，指示更改是否具有破坏性 |
| `idempotentHint` | boolean | false | 指示重复的相同调用是否与单次调用具有相同效果 |
| `openWorldHint` | boolean | true | 指定工具是否与外部系统交互 |

请记住，注释有助于提供更好的用户体验，但应被视为建议性提示。它们帮助客户端应用程序呈现适当的UI元素和安全控件，但不会自行强制执行安全边界。始终专注于使您的注释准确反映工具的实际功能。

## [​](https://gofastmcp.com/servers/tools\#mcp-context)  MCP上下文

工具可以通过`Context`对象访问MCP功能，如日志记录、读取资源或报告进度。要使用它，请向工具函数添加一个类型提示为`Context`的参数。


```
from fastmcp import FastMCP, Context

mcp = FastMCP(name="ContextDemo")

@mcp.tool
async def process_data(data_uri: str, ctx: Context) -> dict:
    """使用进度报告处理来自资源的数据。"""
    await ctx.info(f"处理来自{data_uri}的数据")

    # 读取资源
    resource = await ctx.read_resource(data_uri)
    data = resource[0].content if resource else ""

    # 报告进度
    await ctx.report_progress(progress=50, total=100)

    # 向客户端LLM请求帮助的示例
    summary = await ctx.sample(f"用10个词总结：{data[:200]}")

    await ctx.report_progress(progress=100, total=100)
    return {
        "length": len(data),
        "summary": summary.text
    }

```

Context对象提供对以下内容的访问：

- **日志记录**：`ctx.debug()`、`ctx.info()`、`ctx.warning()`、`ctx.error()`
- **进度报告**：`ctx.report_progress(progress, total)`
- **资源访问**：`ctx.read_resource(uri)`
- **LLM采样**：`ctx.sample(...)`
- **请求信息**：`ctx.request_id`、`ctx.client_id`

有关Context对象及其所有功能的完整文档，请参见[Context文档](https://gofastmcp.com/servers/context)。

## [​](https://gofastmcp.com/servers/tools\#parameter-types)  参数类型

FastMCP支持多种参数类型，让您在设计工具时具有灵活性。

FastMCP通常支持Pydantic支持的所有类型作为字段，包括所有Pydantic自定义类型。这意味着您可以使用...(17380字符被截断)