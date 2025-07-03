````
# 类型

# `fastmcp.utilities.types`

FastMCP中常用的类型。

## 函数

### `get_cached_typeadapter`

```python
get_cached_typeadapter(cls: T) -> TypeAdapter[T]
```

TypeAdapter是重量级对象，在应用上下文中，我们通常会在全局作用域中创建一次，并尽可能多地重用它们。
然而，这对于用户生成的函数来说并不可行。相反，我们使用缓存来尽可能减少创建它们的成本。

### `issubclass_safe`

```python
issubclass_safe(cls: type, base: type) -> bool
```

检查cls是否是base的子类，即使cls是类型变量也可正常工作。

### `is_class_member_of_type`

```python
is_class_member_of_type(cls: type, base: type) -> bool
```

检查cls是否是base的成员，即使cls是类型变量也可正常工作。

base可以是类型、UnionType或Annotated类型。泛型类型不被视为成员（例如T不是list\[T]的成员）。

### `find_kwarg_by_type`

```python
find_kwarg_by_type(fn: Callable, kwarg_type: type) -> str | None
```

查找类型为kwarg\_type的关键字参数名称。

包括包含kwarg\_type的联合类型以及Annotated类型。

## 类

### `FastMCPBaseModel`

FastMCP模型的基础模型。

### `Image`

用于从工具返回图像的辅助类。

**方法：**

#### `to_image_content`

```python
to_image_content(self, mime_type: str | None = None, annotations: Annotations | None = None) -> ImageContent
```

转换为MCP ImageContent。

### `Audio`

用于从工具返回音频的辅助类。

**方法：**

#### `to_audio_content`

```python
to_audio_content(self, mime_type: str | None = None, annotations: Annotations | None = None) -> AudioContent
```

### `File`

用于从工具返回文件的辅助类。

**方法：**

#### `to_resource_content`

```python
to_resource_content(self, mime_type: str | None = None, annotations: Annotations | None = None) -> EmbeddedResource
```

````