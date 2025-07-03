# resource

# `fastmcp.resources.resource`

FastMCP资源定义核心类，用于创建和管理只读数据资源。

## 类

### `Resource`

资源基类，定义了资源的基本属性和访问接口。

**参数：**
- `uri`: 资源的唯一标识符（统一资源标识符）
- `description`: 资源功能描述
- `content_type`: 资源内容类型（如"text/plain"、"application/json"等）
- `data_loader`: 数据加载函数，用于延迟加载资源内容
- `allow_caching`: 是否允许缓存资源内容（默认为True）

**方法：**

#### `__init__`

```python
__init__(self, uri: str, description: str = '', content_type: str = 'application/json', data_loader: Callable[[], Any] | None = None, allow_caching: bool = True)
```

初始化资源实例。

#### `get_content`

```python
get_content(self) -> Any
```

获取资源内容，如设置了data_loader则调用它加载数据。

**返回：**
- 资源内容数据

#### `to_dict`

```python
to_dict(self) -> dict
```

将资源元数据转换为字典表示。

**返回：**
- 包含资源URI、描述、内容类型等信息的字典

### `StaticResource`

静态资源类，适用于内容固定的资源。

**继承：** Resource

**参数：**
- `uri`: 资源URI
- `content`: 静态资源内容
- `description`: 资源描述
- `content_type`: 内容类型

#### `__init__`

```python
__init__(self, uri: str, content: Any, description: str = '', content_type: str = 'application/json')
```

初始化静态资源。