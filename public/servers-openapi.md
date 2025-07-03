服务器

OpenAPI 集成

`版本 2.0.0 新增`

FastMCP 可以从 OpenAPI 规范或 FastAPI 应用自动生成 MCP 服务器。无需手动创建工具和资源，只需提供 OpenAPI 规范，FastMCP 会智能地将 API 端点转换为适当的 MCP 组件。

## [​](https://gofastmcp.com/servers/openapi\#quick-start) 快速开始

要将 OpenAPI 规范转换为 MCP 服务器，可以使用 `FastMCP.from_openapi` 类方法。此方法接受 OpenAPI 规范和可用于向 API 发出请求的异步 HTTPX 客户端，并返回 MCP 服务器。

示例如下：

```
import httpx
from fastmcp import FastMCP

# 为 API 创建 HTTP 客户端
client = httpx.AsyncClient(base_url="https://api.example.com")

# 加载 OpenAPI 规范
openapi_spec = httpx.get("https://api.example.com/openapi.json").json()

# 创建 MCP 服务器
mcp = FastMCP.from_openapi(
    openapi_spec=openapi_spec,
    client=client,
    name="My API Server"
)

if __name__ == "__main__":
    mcp.run()

```

就是这样！您的整个 API 现在可以作为 MCP 服务器使用。客户端可以通过 MCP 协议发现和交互您的 API 端点，并具有完整的模式验证和类型安全。

## [​](https://gofastmcp.com/servers/openapi\#route-mapping) 路由映射

默认情况下，FastMCP 将 OpenAPI 规范中的**每个端点**转换为 MCP**工具**。这提供了一个简单、可预测的起点，确保 API 的所有功能立即可用于绝大多数仅支持 MCP 工具的 LLM 客户端。

虽然这是实现最大兼容性的实用默认值，但您可以轻松自定义此行为。在内部，FastMCP 使用有序的 `RouteMap` 对象列表来确定如何将 OpenAPI 路由映射到各种 MCP 组件类型。

每个 `RouteMap` 指定方法、模式和标签的组合，以及相应的 MCP 组件类型。每个 OpenAPI 路由按顺序检查每个 `RouteMap`，第一个匹配所有条件的 `RouteMap` 用于确定其转换后的 MCP 类型。特殊类型 `EXCLUDE` 可用于将路由完全排除在 MCP 服务器之外。

- **方法**：要匹配的 HTTP 方法（例如 `["GET", "POST"]` 或 `"*"` 表示所有方法）
- **模式**：匹配路由路径的正则表达式模式（例如 `r"^/users/.*"` 或 `r".*"` 表示所有路径）
- **标签**：必须全部存在的 OpenAPI 标签集。空集（`{}`）表示无标签过滤，因此无论路由的标签如何都匹配。
- **MCP 类型**：要创建的 MCP 组件类型（`TOOL`、`RESOURCE`、`RESOURCE_TEMPLATE` 或 `EXCLUDE`）
- **MCP 标签**：要添加到从匹配路由创建的组件的自定义标签集

以下是 FastMCP 的默认规则：

```
from fastmcp.server.openapi import RouteMap, MCPType

DEFAULT_ROUTE_MAPPINGS = [\
    # 所有路由都成为工具\
    RouteMap(mcp_type=MCPType.TOOL),\
]

```

### [​](https://gofastmcp.com/servers/openapi\#custom-route-maps) 自定义路由映射

创建 FastMCP 服务器时，可以通过提供自己的 `RouteMap` 对象列表来自定义路由行为。自定义映射在默认路由映射之前处理，路由将分配给第一个匹配的自定义映射。

例如，在 FastMCP 2.8.0 之前，GET 请求会根据是否有路径参数自动映射到 `Resource` 和 `ResourceTemplate` 组件。（此更改仅出于客户端兼容性原因。）您可以通过提供自定义路由映射恢复此行为：

```
from fastmcp import FastMCP
from fastmcp.server.openapi import RouteMap, MCPType

# 恢复 2.8.0 之前的语义映射
semantic_maps = [\
    # 带路径参数的 GET 请求成为 ResourceTemplates\
    RouteMap(methods=["GET"], pattern=r".*\{.*\}.*", mcp_type=MCPType.RESOURCE_TEMPLATE),\
    # 所有其他 GET 请求成为 Resources\
    RouteMap(methods=["GET"], pattern=r".*", mcp_type=MCPType.RESOURCE),\
]

mcp = FastMCP.from_openapi(
    ...,
    route_maps=semantic_maps,
)

```

使用这些映射后，GET 请求将按语义处理，所有其他方法（POST、PUT 等）将落入默认规则并成为工具。

以下是一个更完整的示例，使用自定义路由映射将 `/analytics/` 下的所有 GET 端点转换为工具，同时排除所有管理端点和标记为“internal”的所有路由。所有其他路由将由默认规则处理：

```
from fastmcp import FastMCP
from fastmcp.server.openapi import RouteMap, MCPType

mcp = FastMCP.from_openapi(
    ...,
    route_maps=[\
\
        # 分析 GET 端点是工具\
        RouteMap(\
            methods=["GET"],\
            pattern=r"^/analytics/.*",\
            mcp_type=MCPType.TOOL,\
        ),\
\
        # 排除所有管理端点\
        RouteMap(\
            pattern=r"^/admin/.*",\
            mcp_type=MCPType.EXCLUDE,\
        ),\
\
        # 排除所有标记为“internal”的路由\
        RouteMap(\
            tags={"internal"},\
            mcp_type=MCPType.EXCLUDE,\
        ),\
    ],
)

```

默认路由映射始终在自定义映射之后应用，因此您不必为每个可能的路由创建路由映射。

### [​](https://gofastmcp.com/servers/openapi\#excluding-routes) 排除路由

要从 MCP 服务器排除路由，请使用路由映射将它们分配给 `MCPType.EXCLUDE`。

您可以通过专门定位敏感或内部路由来删除它们：

```
from fastmcp import FastMCP
from fastmcp.server.openapi import RouteMap, MCPType

mcp = FastMCP.from_openapi(
    ...,
    route_maps=[\
        RouteMap(pattern=r"^/admin/.*", mcp_type=MCPType.EXCLUDE),\
        RouteMap(tags={"internal"}, mcp_type=MCPType.EXCLUDE),\
    ],
)

```

或者，您可以使用 catch-all 规则排除映射未明确处理的所有内容：

```
from fastmcp import FastMCP
from fastmcp.server.openapi import RouteMap, MCPType

mcp = FastMCP.from_openapi(
    ...,
    route_maps=[\
        # 自定义映射逻辑放在这里\
        ...,\
        # 排除所有剩余路由\
        RouteMap(mcp_type=MCPType.EXCLUDE),\
    ],
)

```

使用 catch-all 排除规则将阻止应用默认路由映射，因为它将匹配所有剩余路由。如果您想显式允许某些路由，这很有用。

### [​](https://gofastmcp.com/servers/openapi\#advanced-route-mapping) 高级路由映射

`版本 2.5.0 新增`

对于需要更复杂逻辑的高级用例，您可以提供 `route_map_fn` 可调用对象。应用路由映射逻辑后，将对每个匹配的路由及其分配的 MCP 组件类型调用此函数。它可以选择性地返回不同的组件类型以覆盖映射分配。如果返回 `None`，则使用分配的类型。

除了更精确地定位方法、模式和标签外，此函数还可以访问有关路由的任何其他 OpenAPI 元数据。

`route_map_fn`**会**在自定义映射中匹配 `MCPType.EXCLUDE` 的路由上调用，让您有机会覆盖排除。


```
from fastmcp import FastMCP
from fastmcp.server.openapi import RouteMap, MCPType, HTTPRoute

def custom_route_mapper(route: HTTPRoute, mcp_type: MCPType) -> MCPType | None:
    """高级路由类型映射。"""
    # 将所有管理路由转换为工具，无论 HTTP 方法如何
    if "/admin/" in route.path:
        return MCPType.TOOL

    elif "internal" in route.tags:
        return MCPType.EXCLUDE

    # 将用户详情路由转换为模板，即使它们是 POST 请求
    elif route.path.startswith("/users/") and route.method == "POST":
        return MCPType.RESOURCE_TEMPLATE

    # 所有其他路由使用默认值
    return None

mcp = FastMCP.from_openapi(
    ...,
    route_map_fn=custom_route_mapper,
)

```

## [​](https://gofastmcp.com/servers/openapi\#customizing-mcp-components) 自定义 MCP 组件

### [​](https://gofastmcp.com/servers/openapi\#tags) 标签

`版本 2.8.0 新增`

FastMCP 提供多种方式向 MCP 组件添加标签，允许您对其进行分类和组织，以提高可发现性和过滤能力。标签从多个来源组合，以创建每个组件上的最终标签集。

#### [​](https://gofastmcp.com/servers/openapi\#routemap-tags) RouteMap 标签

您可以使用 `RouteMap` 中的 `mcp_tags` 参数向从特定路由创建的组件添加自定义标签。这些标签将应用于从匹配该特定路由映射的路由创建的所有组件。


```
from fastmcp import FastMCP
from fastmcp.server.openapi import RouteMap, MCPType

mcp = FastMCP.from_openapi(
    ...,
    route_maps=[\
        # 为所有 POST 端点添加自定义标签\
        RouteMap(\
            methods=["POST"],\
            pattern=r".*",\
            mcp_type=MCPType.TOOL,\
            mcp_tags={"write-operation", "api-mutation"}\
        ),\
\
        # 为详情视图端点添加不同标签\
        RouteMap(\
            methods=["GET"],\
            pattern=r".*\{.*\}.*",\
            mcp_type=MCPType.RESOURCE_TEMPLATE,\
            mcp_tags={"detail-view", "parameterized"}\
        ),\
\
        # 为列表端点添加标签\
        RouteMap(\
            methods=["GET"],\
            pattern=r".*",\
            mcp_type=MCPType.RESOURCE,\
            mcp_tags={"list-data", "collection"}\
        ),\
    ],
)

```

#### [​](https://gofastmcp.com/servers/openapi\#global-tags) 全局标签

通过在使用 `from_openapi` 或 `from_fastapi` 创建 FastMCP 服务器时提供 `tags` 参数，可以将标签添加到**所有**组件。这些全局标签将应用于从 OpenAPI 规范创建的每个组件。

from\_openapi()

from\_fastapi()


```
from fastmcp import FastMCP

mcp = FastMCP.from_openapi(
    openapi_spec=spec,
    client=client,
    tags={"api-v2", "production", "external"}
)

```

### [​](https://gofastmcp.com/servers/openapi\#names) 名称

`版本 2.5.0 新增`

FastMCP 根据 OpenAPI 规范自动生成 MCP 组件的名称。默认情况下，它使用 OpenAPI 规范中的 `operationId`，最多到第一个双下划线（`__`）。

所有组件名称都会自动：

- **Slugified**：空格和特殊字符转换为下划线或删除
- **Truncated**：限制为最多 56 个字符以确保兼容性
- **Unique**：如果多个组件具有相同的名称，会自动附加数字以使其唯一

要更好地控制组件名称，您可以提供 `mcp_names` 字典，将 `operationId` 值映射到所需的名称。`operationId` 必须与 OpenAPI 规范中显示的完全一致。提供的名称将始终被 slugified 和截断。


```
from fastmcp import FastMCP

mcp = FastMCP.from_openapi(
    ...
    mcp_names={
        "list_users__with_pagination": "user_list",
        "create_user__admin_required": "create_user",
        "get_user_details__admin_required": "user_detail",
    }
)

```

`mcp_names` 中未找到的任何 `operationId` 将使用默认策略（`operationId` 最多到第一个 `__`）。

### [​](https://gofastmcp.com/servers/openapi\#advanced-customization) 高级自定义

`版本 2.5.0 新增`

默认情况下，FastMCP 使用 OpenAPI 规范中的各种元数据创建 MCP 组件，例如将 OpenAPI 描述合并到 MCP 组件描述中。

有时您可能希望以多种方式修改这些 MCP 组件，例如添加 LLM 特定指令或标签。对于细粒度自定义，您可以在创建 MCP 服务器时提供 `mcp_component_fn`。创建每个 MCP 组件后，将对其调用此函数，并有可能对其进行就地修改。

您的 `mcp_component_fn` 应就地修改组件，而不是返回新组件。函数的结果将被忽略。


```
from fastmcp import FastMCP
from fastmcp.server.openapi import (
    HTTPRoute,
    OpenAPITool,
    OpenAPIResource,
    OpenAPIResourceTemplate,
)

def customize_components(
    route: HTTPRoute,
    component: OpenAPITool | OpenAPIResource | OpenAPIResourceTemplate,
) -> None:

    # 为所有组件添加自定义标签
    component.tags.add("openapi")

    # 根据组件类型自定义
    if isinstance(component, OpenAPITool):
        component.description = f"🔧 {component.description} (via API)"

    if isinstance(component, OpenAPIResource):
        component.description = f"📊 {component.description}"
        component.tags.add("data")

mcp = FastMCP.from_openapi(
    ...,
    mcp_component_fn=customize_components,
)

```

## [​](https://gofastmcp.com/servers/openapi\#request-parameter-handling) 请求参数处理

FastMCP 智能处理 OpenAPI 请求中的不同类型参数：

### [​](https://gofastmcp.com/servers/openapi\#query-parameters) 查询参数

默认情况下，FastMCP 仅包含具有非空值的查询参数。具有 `None` 值或空字符串的参数会自动过滤掉。

```
# 调用此工具时...
await client.call_tool("search_products", {
    "category": "electronics",  # ✅ 包含
    "min_price": 100,           # ✅ 包含
    "max_price": None,          # ❌ 排除
    "brand": "",                # ❌ 排除
})

# HTTP 请求将是：GET /products?category=electronics&min_price=100

```

### [​](https://gofastmcp.com/servers/openapi\#path-parameters) 路径参数

路径参数通常是 REST API 必需的。FastMCP：

- 过滤掉 `None` 值
- 验证是否提供了所有必需的路径参数
- 对缺少的必需参数引发清晰的错误


```
# ✅ 这有效
await client.call_tool("get_user", {"user_id": 123})

# ❌ 这会引发："Missing required path parameters: {'user_id'}"
await client.call_tool("get_user", {"user_id": None})

```

### [​](https://gofastmcp.com/servers/openapi\#array-parameters) 数组参数

FastMCP 根据 OpenAPI 规范处理数组参数：

- **查询数组**：基于 `explode` 参数序列化（默认：`True`）
- **路径数组**：序列化为逗号分隔值（OpenAPI 'simple' 样式）


```
# 查询数组，explode=true（默认）
# ?tags=red&tags=blue&tags=green

# 查询数组，explode=false
# ?tags=red,blue,green

# 路径数组（始终逗号分隔）
# /items/red,blue,green

```

### [​](https://gofastmcp.com/servers/openapi\#headers) 标头

标头参数自动转换为字符串并包含在 HTTP 请求中。

## [​](https://gofastmcp.com/servers/openapi\#auth) 身份验证

如果您的 API 需要身份验证，请在创建 MCP 服务器之前在 HTTP 客户端上配置它：


```
import httpx
from fastmcp import FastMCP

# Bearer 令牌身份验证
api_client = httpx.AsyncClient(
    base_url="https://api.example.com",
    headers={"Authorization": "Bearer YOUR_TOKEN"}
)

# 使用经过身份验证的客户端创建 MCP 服务器
mcp = FastMCP.from_openapi(..., client=api_client)

```

## [​](https://gofastmcp.com/servers/openapi\#timeouts) 超时

为所有 API 请求设置超时：


```
mcp = FastMCP.from_openapi(
    openapi_spec=spec,
    client=api_client,
    timeout=30.0  # 所有请求的 30 秒超时
)

```

## [​](https://gofastmcp.com/servers/openapi\#fastapi-integration) FastAPI 集成

`版本 2.0.0 新增`

FastMCP 可以通过提取 FastAPI 应用的 OpenAPI 规范直接将其转换为 MCP 服务器：

FastMCP**不**包含 FastAPI 作为依赖项；要使用此集成，您必须单独安装它。


```
from fastapi import FastAPI
from fastmcp import FastMCP

# 您的 FastAPI 应用
app = FastAPI(title="My API", version="1.0.0")

@app.get("/items", tags=["items"], operation_id="list_items")
def list_items():
    return [{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]

@app.get("/items/{item_id}", tags=["items", "detail"], operation_id="get_item")
def get_item(item_id: int):
    return {"id": item_id, "name": f"Item {item_id}"}

@app.post("/items", tags=["items", "create"], operation_id="create_item")
def create_item(name: str):
    return {"id": 3, "name": name}

# 将 FastAPI 应用转换为 MCP 服务器
mcp = FastMCP.from_fastapi(app=app)

if __name__ == "__main__":
    mcp.run()  # 作为 MCP 服务器运行

```

请注意，操作 ID 是可选的，但用于创建组件名称。您也可以提供自定义名称，就像使用 OpenAPI 规范一样。

FastMCP 服务器不是 FastAPI 应用，即使是从 FastAPI 创建的。要了解如何将它们部署为 ASGI 应用，请参阅 [ASGI 集成](https://gofastmcp.com/deployment/asgi) 文档。

### [​](https://gofastmcp.com/servers/openapi\#fastapi-configuration) FastAPI 配置

所有 OpenAPI 集成功能都适用于 FastAPI 应用：


```
from fastmcp.server.openapi import RouteMap, MCPType

# FastAPI 的自定义路由映射
mcp = FastMCP.from_fastapi(
    app=app,
    name="My Custom Server",
    timeout=5.0,
    tags={"api-v1", "fastapi"},  # 所有组件的全局标签
    mcp_names={"operationId": "friendly_name"},  # 自定义组件名称
    route_maps=[\
        # 管理端点成为带有自定义标签的工具\
        RouteMap(\
            methods="*",\
            pattern=r"^/admin/.*",\
            mcp_type=MCPType.TOOL,\
            mcp_tags={"admin", "privileged"}\
        ),\
        # 内部端点被排除\
        RouteMap(methods="*", pattern=r".*", mcp_type=MCPType.EXCLUDE, tags={"internal"}),\
    ],
    route_map_fn=my_route_mapper,
    mcp_component_fn=my_component_customizer,
    mcp_names={
        "get_user_details_users__user_id__get": "get_user_details",
    }
)

```

### [​](https://gofastmcp.com/servers/openapi\#fastapi-benefits) FastAPI 优势

- **零代码重复**：重用现有的 FastAPI 端点
- **模式继承**：保留 Pydantic 模型和验证
- **ASGI 传输**：直接内存通信（无 HTTP 开销）
- **完整的 FastAPI 功能**：依赖项、中间件、身份验证都有效

[中间件](https://gofastmcp.com/servers/middleware) [代理服务器](https://gofastmcp.com/servers/proxy)

本页内容

- [快速开始](https://gofastmcp.com/servers/openapi#quick-start)
- [路由映射...(1631 个字符被截断)