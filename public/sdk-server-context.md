# context

# `fastmcp.server.context`

FastMCP服务器上下文管理模块，提供请求处理过程中的上下文信息存储和访问功能。

## 类

### `Context`

服务器上下文类，用于在请求处理过程中传递和共享数据。

**属性：**
- `request_id`: 请求唯一标识符
- `timestamp`: 请求处理开始时间戳
- `auth_context`: 认证上下文对象（来自AuthContext）
- `logger`: 请求专用日志记录器
- `metadata`: 自定义元数据字典
- `transport`: 传输层对象
- `server_config`: 服务器配置对象

**方法：**

#### `__init__`

```python
__init__(self, request_id: str = None, server_config: dict = None)
```

初始化上下文对象。如果未提供request_id，将自动生成UUID。

#### `get`

```python
get(self, key: str, default: Any = None) -> Any
```

获取上下文中的属性值。

**参数：**
- `key`: 属性键名
- `default`: 键不存在时的默认返回值

**返回：**
- 属性值或默认值

#### `set`

```python
set(self, key: str, value: Any) -> None
```

设置上下文中的属性值。

**参数：**
- `key`: 属性键名
- `value`: 属性值

#### `has`

```python
has(self, key: str) -> bool
```

检查上下文中是否存在指定键。

**参数：**
- `key`: 属性键名

**返回：**
- 存在性检查结果（True表示存在）

#### `to_dict`

```python
to_dict(self) -> dict
```

将上下文内容转换为字典。

**返回：**
- 包含上下文所有属性的字典

#### `get_logger`

```python
get_logger(self, name: str = None) -> logging.Logger
```

获取或创建与上下文关联的日志记录器。

**参数：**
- `name`: 日志记录器名称

**返回：**
- 配置好的日志记录器实例