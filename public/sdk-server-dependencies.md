# dependencies

# `fastmcp.server.dependencies`

FastMCP服务器依赖注入模块，提供请求处理过程中的依赖管理和注入功能。

## 类

### `DependencyManager`

依赖管理器类，用于注册、解析和注入请求处理所需的依赖项。

**参数：**
- `providers`: 依赖提供器字典，键为依赖名称，值为提供器函数或类
- `scopes`: 依赖作用域配置，定义依赖的生命周期（'singleton'、'request'或' transient'）

**方法：**

#### `__init__`

```python
__init__(self, providers: dict[str, Any] = None, scopes: dict[str, str] = None)
```

初始化依赖管理器。

#### `register`

```python
register(self, name: str, provider: Any, scope: str = 'transient') -> None
```

注册新的依赖提供器。

**参数：**
- `name`: 依赖名称
- `provider`: 依赖提供器（可调用对象或类）
- `scope`: 依赖作用域（'singleton'、'request'或'transient'）

#### `resolve`

```python
resolve(self, name: str, context: Context = None) -> Any
```

解析并获取依赖实例。

**参数：**
- `name`: 依赖名称
- `context`: 请求上下文对象（用于'request'作用域的依赖）

**返回：**
- 解析后的依赖实例

#### `inject`

```python
inject(self, func: Callable) -> Callable
```

装饰器，自动注入函数所需的依赖参数。

**参数：**
- `func`: 需要注入依赖的函数

**返回：**
- 包装后的函数

## 函数

### `get_dependency`

```python
get_dependency(name: str, context: Context = None) -> Any
```

全局获取依赖实例的便捷函数。

**参数：**
- `name`: 依赖名称
- `context`: 请求上下文对象

**返回：**
- 依赖实例

### `inject_dependencies`

```python
inject_dependencies(func: Callable, dependencies: dict[str, Any]) -> Callable
```

手动为函数注入指定依赖的装饰器。

**参数：**
- `func`: 目标函数
- `dependencies`: 依赖字典

**返回：**
- 包装后的函数