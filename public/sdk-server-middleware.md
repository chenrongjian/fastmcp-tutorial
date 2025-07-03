# fastmcp.server.middleware

## 函数

### `make_middleware_wrapper`

```python
make_middleware_wrapper(middleware: Middleware, call_next: CallNext[T, R]) -> CallNext[T, R]
```

创建一个将单个中间件应用于上下文的包装器。闭包中包含了中间件和call_next函数，因此它可以传递给其他期望call_next函数的函数。

## 类

### `CallNext`

### `CallToolResult`

### `ListToolsResult`

### `ListResourcesResult`

### `ListResourceTemplatesResult`

### `ListPromptsResult`

### `ServerResultProtocol`

### `MiddlewareContext`

所有中间件操作的统一上下文。

**方法：**

#### `copy`

```python
copy(self, **kwargs: Any) -> MiddlewareContext[T]
```

### `Middleware`

带有调度钩子的FastMCP中间件基类。