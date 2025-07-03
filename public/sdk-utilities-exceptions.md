# fastmcp.utilities.exceptions

## 类

### `FastMCPException`

FastMCP的基础异常类，所有其他异常都继承自此。

### `InvalidConfigurationError`

配置无效时引发的异常。

### `ComponentNotFoundError`

找不到指定组件（工具、资源等）时引发的异常。

### `ValidationError`

数据验证失败时引发的异常。

### `SerializationError`

序列化或反序列化数据时引发的异常。

### `AuthenticationError`

身份验证失败时引发的异常。

### `AuthorizationError`

授权失败时引发的异常。

### `RateLimitError`

超出速率限制时引发的异常。

### `TimeoutError`

操作超时时引发的异常。

## 函数

### `exception_to_dict`

```python
exception_to_dict(exc: Exception) -> dict[str, Any]
```

将异常转换为字典表示形式，包含类型、消息和堆栈跟踪信息。

### `register_exception_handlers`

```python
register_exception_handlers(app: Starlette) -> None
```

为Starlette应用程序注册FastMCP异常的默认异常处理器。