核心组件

资源与模板

资源表示MCP客户端可以读取的数据或文件，而资源模板通过允许客户端基于URI中传递的参数请求动态生成的资源来扩展此概念。

FastMCP简化了静态和动态资源的定义，主要使用`@mcp.resource`装饰器。

## [​](https://gofastmcp.com/servers/resources\#what-are-resources%3F)  什么是资源？

资源为LLM或客户端应用程序提供对数据的只读访问。当客户端请求资源URI时：

1. FastMCP找到相应的资源定义。
2. 如果是动态的（由函数定义），则执行该函数。
3. 内容（文本、JSON、二进制数据）返回给客户端。

这允许LLM访问文件、数据库内容、配置或与对话相关的动态生成信息。

## [​](https://gofastmcp.com/servers/resources\#resources)  资源

### [​](https://gofastmcp.com/servers/resources\#the-%40resource-decorator)  `@resource`装饰器

定义资源最常见的方法是装饰Python函数。装饰器需要资源的唯一URI。


```
import json
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# 返回字符串的基本动态资源
@mcp.resource("resource://greeting")
def get_greeting() -> str:
    """提供简单的问候消息。"""
    return "Hello from FastMCP Resources!"

# 返回JSON数据的资源（字典会自动序列化）
@mcp.resource("data://config")
def get_config() -> dict:
    """提供应用程序配置（JSON格式）。"""
    return {
        "theme": "dark",
        "version": "1.2.0",
        "features": ["tools", "resources"],
    }

```

**核心概念：**

- **URI：** `@resource`的第一个参数是客户端用于请求此数据的唯一URI（例如`"resource://greeting"`）。
- **延迟加载：** 装饰函数（`get_greeting`、`get_config`）仅在客户端通过`resources/read`专门请求该资源URI时才执行。
- **推断元数据：** 默认情况下：
  - 资源名称：取自函数名（`get_greeting`）。
  - 资源描述：取自函数的文档字符串。

### [​](https://gofastmcp.com/servers/resources\#return-values)  返回值

FastMCP自动将函数的返回值转换为适当的MCP资源内容：

- **`str`**：作为`TextResourceContents`发送（默认`mime_type="text/plain"`）。
- **`dict`、`list`、`pydantic.BaseModel`**：自动序列化为JSON字符串并作为`TextResourceContents`发送（默认`mime_type="application/json"`）。
- **`bytes`**：Base64编码并作为`BlobResourceContents`发送。应指定适当的`mime_type`（例如`"image/png"`、`"application/octet-stream"`）。
- **`None`**：导致返回空资源内容列表。

### [​](https://gofastmcp.com/servers/resources\#resource-metadata)  资源元数据

您可以使用装饰器中的参数自定义资源的属性：

```
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# 指定元数据的示例
@mcp.resource(
    uri="data://app-status",      # 显式URI（必需）
    name="ApplicationStatus",     # 自定义名称
    description="提供应用程序的当前状态。", # 自定义描述
    mime_type="application/json", # 显式MIME类型
    tags={"monitoring", "status"} # 分类标签
)
def get_application_status() -> dict:
    """内部函数描述（如果提供了上面的description，则忽略）。"""
    return {"status": "ok", "uptime": 12345, "version": mcp.settings.version} # 示例用法

```

- **`uri`**：资源的唯一标识符（必需）。
- **`name`**：人类可读名称（默认为函数名）。
- **`description`**：资源说明（默认为文档字符串）。
- **`mime_type`**：指定内容类型（FastMCP通常推断默认值如`text/plain`或`application/json`，但非文本类型最好显式指定）。
- **`tags`**：用于分类的字符串集合，客户端可能用于过滤。
- **`enabled`**：启用或禁用资源的布尔值（默认为`True`）。有关更多信息，请参见[禁用资源](https://gofastmcp.com/servers/resources#disabling-resources)。

### [​](https://gofastmcp.com/servers/resources\#disabling-resources)  禁用资源

`版本新增：2.8.0`

您可以通过启用或禁用资源和模板来控制其可见性和可用性。禁用的资源不会出现在可用资源或模板列表中，尝试读取禁用资源将导致“未知资源”错误。

默认情况下，所有资源都是启用的。您可以在创建时使用装饰器中的`enabled`参数禁用资源：


```
@mcp.resource("data://secret", enabled=False)
def get_secret_data():
    """此资源当前已禁用。"""
    return "Secret data"

```

您还可以在资源创建后以编程方式切换其状态：


```
@mcp.resource("data://config")
def get_config(): return {"version": 1}

# 禁用并重新启用资源
get_config.disable()
get_config.enable()

```

### [​](https://gofastmcp.com/servers/resources\#accessing-mcp-context)  访问MCP上下文

`版本新增：2.2.5`

资源和资源模板可以通过`Context`对象访问其他MCP信息和功能。要访问它，请向资源函数添加一个类型注释为`Context`的参数：


```
from fastmcp import FastMCP, Context

mcp = FastMCP(name="DataServer")

@mcp.resource("resource://system-status")
async def get_system_status(ctx: Context) -> dict:
    """提供系统状态信息。"""
    return {
        "status": "operational",
        "request_id": ctx.request_id
    }

@mcp.resource("resource://{name}/details")
async def get_details(name: str, ctx: Context) -> dict:
    """获取特定名称的详细信息。"""
    return {
        "name": name,
        "accessed_at": ctx.request_id
    }

```

有关Context对象及其所有功能的完整文档，请参见[Context文档](https://gofastmcp.com/servers/context)。

### [​](https://gofastmcp.com/servers/resources\#asynchronous-resources)  异步资源

对于执行I/O操作（例如从数据库或网络读取）的资源函数，使用`async def`以避免阻塞服务器。


```
import aiofiles
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

@mcp.resource("file:///app/data/important_log.txt", mime_type="text/plain")
async def read_important_log() -> str:
    """异步读取特定日志文件的内容。"""
    try:
        async with aiofiles.open("/app/data/important_log.txt", mode="r") as f:
            content = await f.read()
        return content
    except FileNotFoundError:
        return "日志文件未找到。"

```

### [​](https://gofastmcp.com/servers/resources\#resource-classes)  资源类

虽然`@mcp.resource`非常适合动态内容，但您可以使用`mcp.add_resource()`和具体的`Resource`子类直接注册预定义资源（如静态文件或简单文本）。


```
from pathlib import Path
from fastmcp import FastMCP
from fastmcp.resources import FileResource, TextResource, DirectoryResource

mcp = FastMCP(name="DataServer")

# 1. 直接公开静态文件
readme_path = Path("./README.md").resolve()
if readme_path.exists():
    # 使用file:// URI方案
    readme_resource = FileResource(
        uri=f"file://{readme_path.as_posix()}",
        path=readme_path, # 实际文件路径
        name="README文件",
        description="项目的README文档。",
        mime_type="text/markdown",
        tags={"documentation"}
    )
    mcp.add_resource(readme_resource)

# 2. 公开简单的预定义文本
notice_resource = TextResource(
    uri="resource://notice",
    name="重要通知",
    text="系统维护计划在周日进行。",
    tags={"notification"}
)
mcp.add_resource(notice_resource)

# 3. 使用与URI不同的自定义键
special_resource = TextResource(
    uri="resource://common-notice",
    name="特殊通知",
    text="这是带有自定义存储键的特殊通知。",
)
mcp.add_resource(special_resource, key="resource://custom-key")

# 4. 公开目录列表
data_dir_path = Path("./app_data").resolve()
if data_dir_path.is_dir():
    data_listing_resource = DirectoryResource(
        uri="resource://data-files",
        path=data_dir_path, # 目录路径
        name="数据目录列表",
        description="列出数据目录中可用的文件。",
        recursive=False # 设置为True以列出子目录
    )
    mcp.add_resource(data_listing_resource) # 返回JSON文件列表

```

**常见资源类：**

- `TextResource`：用于简单字符串内容。
- `BinaryResource`：用于原始`bytes`内容。
- `FileResource`：从本地文件路径读取内容。处理文本/二进制模式和延迟读取。
- `HttpResource`：从HTTP(S) URL获取内容（需要`httpx`）。
- `DirectoryResource`：列出本地目录中的文件（返回JSON）。
- （`FunctionResource`：`@mcp.resource`使用的内部类）。

当内容是静态的或直接来自文件/URL时使用这些类，无需专用Python函数。

#### [​](https://gofastmcp.com/servers/resources\#custom-resource-keys)  自定义资源键

`版本新增：2.2.0`

使用`mcp.add_resource()`直接添加资源时，您可以选择提供自定义存储键：


```
# 使用标准URI作为键创建资源
resource = TextResource(uri="resource://data")
mcp.add_resource(resource)  # 将使用"resource://data"存储和访问

# 使用自定义键创建资源
special_resource = TextResource(uri="resource://special-data")
mcp.add_resource(special_resource, key="internal://data-v2")  # 将使用"internal://data-v2"存储和访问

```

请注意，此参数仅在直接使用`add_resource()`时可用，而在使用`@resource`装饰器时不可用，因为使用装饰器时会显式提供URI。

## [​](https://gofastmcp.com/servers/resources\#resource-templates)  资源模板

资源模板允许客户端请求内容取决于URI中嵌入参数的资源。使用**相同的`@mcp.resource`装饰器**定义模板，但在URI字符串中包含`{parameter_name}`占位符，并向函数签名添加相应的参数。

资源模板与常规资源共享大多数配置选项（名称、描述、mime_type、标签），但增加了定义映射到函数参数的URI参数的能力。

资源模板为每组唯一参数生成新资源，这意味着资源可以按需动态创建。例如，如果注册了资源模板`"user://profile/{name}"`，MCP客户端可以请求`"user://profile/ford"`或`"user://profile/marvin"`来检索这两个用户配置文件作为资源，而无需单独注册每个资源。

带有`*args`的函数不支持作为资源模板。但是，与工具和提示不同，资源模板确实支持`**kwargs`，因为URI模板定义了将被收集并作为关键字参数传递的特定参数名称。

以下是显示如何定义两个资源模板的完整示例：


```
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# 模板URI包含{city}占位符
@mcp.resource("weather://{city}/current")
def get_weather(city: str) -> dict:
    """提供特定城市的天气信息。"""
    # 在实际实现中，这将调用天气API
    # 这里我们使用简化逻辑作为示例
    return {
        "city": city.capitalize(),
        "temperature": 22,
        "condition": "晴朗",
        "unit": "摄氏度"
    }

# 带有多个参数的模板
@mcp.resource("repos://{owner}/{repo}/info")
def get_repo_info(owner: str, repo: str) -> dict:
    """检索GitHub仓库的信息。"""
    # 在实际实现中，这将调用GitHub API
    return {
        "owner": owner,
        "name": repo,
        "full_name": f"{owner}/{repo}",
        "stars": 120,
        "forks": 48
    }

```

定义了这两个模板后，客户端可以请求各种资源：

- `weather://london/current` → 返回伦敦的天气
- `weather://paris/current` → 返回巴黎的天气
- `repos://jlowin/fastmcp/info` → 返回jlowin/fastmcp仓库的信息
- `repos://prefecthq/prefect/info` → 返回prefecthq/prefect仓库的信息

### [​](https://gofastmcp.com/servers/resources\#wildcard-parameters)  通配符参数

`版本新增：2.2.4`

请注意：FastMCP对通配符参数的支持是Model Context Protocol标准的**扩展**，该标准在其他方面遵循RFC 6570。由于所有模板处理都在FastMCP服务器中进行，这不应该导致与其他MCP实现的兼容性问题。

资源模板支持可以匹配多个路径段的通配符参数。标准参数（`{param}`）仅匹配单个路径段且不跨越"/"边界，而通配符参数（`{param*}`）可以捕获包括斜杠在内的多个段。通配符捕获所有后续路径段_直到_ URI模板的已定义部分（无论是文字还是另一个参数）。这允许您在单个URI模板中有多个通配符参数。


```
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# 标准参数仅匹配一个段
@mcp.resource("files://{filename}")
def get_file(filename: str) -> str:
    """按名称检索文件。"""
    # 仅匹配files://<single-segment>
    return f"文件内容：{filename}"

# 通配符参数可以匹配多个段
@mcp.resource("path://{filepath*}")
def get_path_content(filepath: str) -> str:
    """检索特定路径的内容。"""
    # 可以匹配path://docs/server/resources.mdx
    return f"路径内容：{filepath}"

# 混合标准和通配符参数
@mcp.resource("repo://{owner}/{path*}/template.py")
def get_template_file(owner: str, path: str) -> dict:
    """从特定仓库和路径检索文件，但
    仅当资源以`template.py`结尾"""
    # 可以匹配repo://jlowin/fastmcp/src/resources/template.py
    return {
        "owner": owner,
        "path": path + "/template.py",
        "content": f"{owner}仓库中{path}/template.py的文件"
    }

```

通配符参数在以下情况很有用：

- 处理文件路径或分层数据
- 创建需要捕获可变长度路径段的API
- 构建类似于REST API的URL模式

请注意，与常规参数一样，每个通配符参数仍必须是函数签名中的命名参数，并且所有必需的函数参数必须出现在URI模板中。

### [​](https://gofastmcp.com/servers/resources\#default-values)  默认值

`版本新增：2.2.0`

创建资源模板时，FastMCP对URI模板参数和函数参数之间的关系强制执行两条规则：

1. **必需函数参数：** 所有没有默认值的函数参数（必需参数）必须出现在URI模板中。
2. **URI参数：** 所有URI模板参数必须作为函数参数存在。

但是，具有默认值的函数参数不需要包含在URI模板中。当客户端请求资源时，FastMCP将：

- 从URI中提取模板中包含的参数值
- 对URI模板中未包含的任何函数参数使用默认值

这允许灵活的API设计。例如，带有可选参数的简单搜索模板：


```
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

@mcp.resource("search://{query}")
def search_resources(query: str, max_results: int = 10, include_archived: bool = False) -> dict:
    """搜索匹配查询字符串的资源。"""
    # 只有'query'在URI中是必需的，其他参数使用默认值
    results = perform_search(query, limit=max_results, archived=include_archived)
    return {
        "query": query,
        "max_results": max_results,
        "include_archived": include_archived,
        "results": results
    }

```

使用此模板，客户端可以请求`search://python`，函数将使用`query="python", max_results=10, include_archived=False`调用。MCP开发人员仍然可以直接使用更具体的参数调用基础`search_resources`函数。

更强大的模式是使用多个URI模板注册单个函数，允许以不同方式访问相同的数据：


```
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# 定义可通过不同标识符访问的用户查找函数
@mcp.resource("users://email/{email}")
@mcp.resource("users://name/{name}")
def lookup_user(name: str | None = None, email: str | None = None) -> dict:
    """通过名称或电子邮件查找用户。"""
    if email:
        return find_user_by_email(email) # 伪代码
    elif name:
        return find_user_by_name(name) # 伪代码
    else:
        return {"error": "未提供查找参数"}

```

现在LLM或客户端可以通过两种不同方式检索用户信息：

- `users://email/alice@example.com` → 通过电子邮件查找用户（name=None）
- `users://name/Bob` → 通过名称查找用户（email=None）

在这种堆叠装饰器模式中：

- 仅当使用`users://name/{name}`模板时才提供`name`参数
- 仅当使用`users://email/{email}`模板时才提供`email`参数
- 每个参数在未包含在URI中时默认为`None`
- 函数逻辑处理提供的任何参数

模板提供了一种强大的方式来公开遵循REST-like原则的参数化数据访问点。

## [​](https://gofastmcp.com/servers/resources\#error-handling)  错误处理

`版本新增：2.4.1`

如果资源函数遇到错误，您可以引发标准Python异常（`ValueError`、`...(4834字符被截断)