# resource_manager

# `fastmcp.resources.resource_manager`

FastMCP资源管理器，用于注册、检索和管理多个资源实例。

## 类

### `ResourceManager`

资源管理器类，负责资源的集中管理和访问控制。

**方法：**

#### `__init__`

```python
__init__(self)
```

初始化资源管理器。

#### `register_resource`

```python
register_resource(self, resource: Resource) -> None
```

向管理器注册资源实例。

**参数：**
- `resource`: Resource类实例

**引发：**
- `ValidationError`: 如果资源URI已存在或资源无效

#### `get_resource`

```python
get_resource(self, uri: str) -> Resource
```

根据URI检索资源实例。

**参数：**
- `uri`: 资源的唯一标识符

**返回：**
- Resource类实例

**引发：**
- `NotFoundError`: 如果指定URI的资源不存在

#### `list_resources`

```python
list_resources(self) -> list[dict]
```

列出所有已注册资源的元信息。

**返回：**
- 包含资源URI、描述和内容类型的字典列表

#### `remove_resource`

```python
remove_resource(self, uri: str) -> None
```

移除指定URI的资源。

**参数：**
- `uri`: 要移除的资源URI

#### `clear_resources`

```python
clear_resources(self) -> None
```

清除所有已注册的资源。