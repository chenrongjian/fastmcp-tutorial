# types

# `fastmcp.resources.types`

FastMCP资源类型定义，包含资源相关的数据类型、枚举和类型别名。

## 枚举

### `ResourceType`

资源类型枚举，定义了FastMCP支持的资源类别。

```python
class ResourceType(Enum):
    STATIC = 'static'  # 静态资源
    TEMPLATE = 'template'  # 模板资源
    DYNAMIC = 'dynamic'  # 动态资源
    EXTERNAL = 'external'  # 外部资源
```

### `ContentType`

内容类型常量，定义了常见的资源内容类型。

```python
class ContentType:
    JSON = 'application/json'
    TEXT = 'text/plain'
    HTML = 'text/html'
    MARKDOWN = 'text/markdown'
    XML = 'application/xml'
    BINARY = 'application/octet-stream'
```

## 类型别名

### `ResourceLoader`

资源加载函数类型，用于动态加载资源内容。

```python
ResourceLoader = Callable[[], Any]
```

### `TemplateLoader`

模板渲染函数类型，接收参数并返回渲染后的内容。

```python
TemplateLoader = Callable[[dict], Any]
```

### `ResourceMetadata`

资源元数据字典类型，包含资源的基本信息。

```python
ResourceMetadata = dict[str, str | dict | list]
```

## 数据类

### `ResourceCacheEntry`

资源缓存条目数据类，用于存储缓存的资源内容和元信息。

```python
@dataclass
class ResourceCacheEntry:
    content: Any
    timestamp: float
    ttl: int | None  # 缓存生存时间（秒）
    etag: str | None  # 实体标签，用于缓存验证
```