# fastmcp.server.openapi

FastMCP服务器OpenAPI集成实现。

## 类

### `MCPType` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/openapi.py#L76" target="_blank">↗</a></sup>

从路由创建的FastMCP组件类型。

### `RouteType` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/openapi.py#L95" target="_blank">↗</a></sup>

已弃用：请改用MCPType。

此类保留用于向后兼容，并将在未来版本中删除。

### `RouteMap` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/openapi.py#L109" target="_blank">↗</a></sup>

HTTP路由到FastMCP组件类型的映射配置。

### `OpenAPITool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/openapi.py#L227" target="_blank">↗</a></sup>

OpenAPI端点的工具实现。

### `OpenAPIResource` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/openapi.py#L478" target="_blank">↗</a></sup>

OpenAPI端点的资源实现。

### `OpenAPIResourceTemplate` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/openapi.py#L597" target="_blank">↗</a></sup>

OpenAPI端点的资源模板实现。

### `FastMCPOpenAPI` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/openapi.py#L651" target="_blank">↗</a></sup>

从OpenAPI模式创建组件的FastMCP服务器实现。

此类解析OpenAPI规范，并基于路由映射创建适当的FastMCP组件（工具、资源、资源模板）。