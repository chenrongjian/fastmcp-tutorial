# logging

# `fastmcp.client.logging`

FastMCP客户端日志工具，用于配置和管理客户端日志记录。

## 函数

### `setup_client_logger`

```python
setup_client_logger(level: str = 'INFO', format: str = '%(asctime)s - %(name)s - %(levelname)s - %(message)s') -> Logger
```

配置客户端日志记录器。

**参数：**
- `level`: 日志级别（DEBUG, INFO, WARNING, ERROR, CRITICAL）
- `format`: 日志格式字符串

**返回：**
- 配置好的日志记录器实例

### `get_client_logger`

```python
get_client_logger(name: str | None = None) -> Logger
```

获取客户端日志记录器。

**参数：**
- `name`: 记录器名称，如未指定则使用默认名称

**返回：**
- 日志记录器实例

### `enable_debug_logging`

```python
enable_debug_logging() -> None
```

启用调试级别日志记录，等价于`setup_client_logger(level='DEBUG')`。