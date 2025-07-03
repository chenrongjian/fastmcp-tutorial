# fastmcp.server.http

## 函数

### `set_http_request` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/http.py#L48" target="_blank">↗</a></sup>

```python
set_http_request(request: Request) -> Generator[Request, None, None]
```

### `setup_auth_middleware_and_routes` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/http.py#L72" target="_blank">↗</a></sup>

```python
setup_auth_middleware_and_routes(auth: OAuthProvider) -> tuple[list[Middleware], list[BaseRoute], list[str]]
```

如果启用了身份验证，则设置身份验证中间件和路由。

**参数：**

* `auth`：OAuthProvider授权服务器提供程序

**返回：**

* 元组 (middleware, auth_routes, required_scopes)

### `create_base_app` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/http.py#L110" target="_blank">↗</a></sup>

```python
create_base_app(routes: list[BaseRoute], middleware: list[Middleware], debug: bool = False, lifespan: Callable | None = None) -> StarletteWithLifespan
```

创建具有通用中间件和路由的基础Starlette应用程序。

**参数：**

* `routes`：要包含在应用程序中的路由列表
* `middleware`：要包含在应用程序中的中间件列表
* `debug`：是否启用调试模式
* `lifespan`：应用程序的可选生命周期管理器

**返回：**

* 一个Starlette应用程序

### `create_sse_app` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/http.py#L138" target="_blank">↗</a></sup>

```python
create_sse_app(server: FastMCP[LifespanResultT], message_path: str, sse_path: str, auth: OAuthProvider | None = None, debug: bool = False, routes: list[BaseRoute] | None = None, middleware: list[Middleware] | None = None) -> StarletteWithLifespan
```

返回SSE服务器应用程序的实例。

**参数：**

* `server`：FastMCP服务器实例
* `message_path`：SSE消息的路径
* `sse_path`：SSE连接的路径
* `auth`：可选的身份验证提供程序
* `debug`：是否启用调试模式
* `routes`：可选的自定义路由列表
* `middleware`：可选的中间件列表

返回：
带有RequestContextMiddleware的Starlette应用程序

### `create_streamable_http_app` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/http.py#L246" target="_blank">↗</a></sup>

```python
create_streamable_http_app(server: FastMCP[LifespanResultT], streamable_http_path: str, event_store: EventStore | None = None, auth: OAuthProvider | None = None, json_response: bool = False, stateless_http: bool = False, debug: bool = False, routes: list[BaseRoute] | None = None, middleware: list[Middleware] | None = None) -> StarletteWithLifespan
```

返回StreamableHTTP服务器应用程序的实例。

**参数：**

* `server`：FastMCP服务器实例
* `streamable_http_path`：StreamableHTTP连接的路径
* `event_store`：用于会话管理的可选事件存储
* `auth`：可选的身份验证提供程序
* `json_response`：是否使用JSON响应格式
* `stateless_http`：是否使用无状态模式（每个请求新的传输）
* `debug`：是否启用调试模式
* `routes`：可选的自定义路由列表
* `middleware`：可选的中间件列表

**返回：**

* 支持StreamableHTTP的Starlette应用程序

## 类

### `StarletteWithLifespan` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/http.py#L41" target="_blank">↗</a></sup>

**方法：**

#### `lifespan` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/http.py#L43" target="_blank">↗</a></sup>

```python
lifespan(self) -> Lifespan
```

### `RequestContextMiddleware` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/http.py#L56" target="_blank">↗</a></sup>

在ContextVar中存储每个请求的中间件