# template

# `fastmcp.resources.template`

FastMCP资源模板类，用于创建支持参数化的动态资源。

## 类

### `TemplateResource`

资源模板类，支持通过URI占位符和参数生成动态内容。

**继承：** Resource

**参数：**
- `uri_template`: 包含占位符的URI模板（如"/users/{user_id}"）
- `description`: 资源模板描述
- `content_type`: 内容类型
- `template_loader`: 模板加载函数，接收参数并返回渲染后的内容
- `allow_caching`: 是否允许缓存渲染结果

**方法：**

#### `__init__`

```python
__init__(self, uri_template: str, description: str = '', content_type: str = 'application/json', template_loader: Callable[[dict], Any] | None = None, allow_caching: bool = True)
```

初始化资源模板实例。

#### `resolve_uri`

```python
resolve_uri(self, **kwargs) -> str
```

使用提供的参数解析URI模板，生成具体资源URI。

**参数：**
- `**kwargs`: URI模板中的占位符参数

**返回：**
- 解析后的具体资源URI

#### `render`

```python
render(self,** kwargs) -> Any
```

使用参数渲染模板内容。

**参数：**
- `**kwargs`: 模板渲染参数

**返回：**
- 渲染后的资源内容

#### `match_uri`

```python
match_uri(self, uri: str) -> dict[str, str] | None
```

检查给定URI是否与模板匹配，并提取参数。

**参数：**
- `uri`: 待匹配的具体资源URI

**返回：**
- 包含提取参数的字典，如不匹配则返回None