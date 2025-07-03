# fastmcp.utilities.logging

## 函数

### `setup_logging`

```python
setup_logging(level: str | int = logging.INFO, format: str | None = None, handlers: list[logging.Handler] | None = None) -> None
```

配置FastMCP的日志系统。

**参数：**
- `level`: 日志级别，可以是字符串（如'INFO'）或整数，默认logging.INFO
- `format`: 日志格式字符串，默认使用预定义格式
- `handlers`: 自定义日志处理器列表，如未提供将使用默认处理器

### `get_logger`

```python
get_logger(name: str | None = None) -> logging.Logger
```

获取FastMCP专用日志记录器。

**参数：**
- `name`: 记录器名称，如未提供则使用根记录器

**返回：**
配置好的日志记录器实例

## 类

### `StructuredFormatter`

结构化日志格式化器，支持输出JSON格式日志。

**方法：**

#### `__init__`

```python
__init__(self, fmt: dict[str, Any] | None = None, datefmt: str | None = None)
```

初始化结构化日志格式化器。

#### `format`

```python
def format(self, record: logging.LogRecord) -> str
```

将日志记录格式化为结构化字符串（默认JSON）。