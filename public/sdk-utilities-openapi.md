# fastmcp.utilities.openapi

## 函数

### `generate_openapi_spec`

```python
generate_openapi_spec(title: str, version: str, description: str | None = None) -> dict[str, Any]
```

生成基础的OpenAPI规范文档结构。

**参数：**
- `title`: API标题
- `version`: API版本
- `description`: API描述，可选

**返回：**
包含基础结构的OpenAPI规范字典

### `add_openapi_path`

```python
add_openapi_path(spec: dict[str, Any], path: str, method: str, operation: dict[str, Any]) -> None
```

向OpenAPI规范添加路径和操作定义。

**参数：**
- `spec`: OpenAPI规范字典
- `path`: API路径（如'/api/tools'）
- `method`: HTTP方法（如'get'、'post'）
- `operation`: 操作定义字典，包含'summary'、'parameters'、'responses'等

### `validate_openapi_spec`

```python
validate_openapi_spec(spec: dict[str, Any]) -> tuple[bool, list[str]]
```

验证OpenAPI规范是否符合OpenAPI规范标准。

**参数：**
- `spec`: 要验证的OpenAPI规范字典

**返回：**
包含验证结果（布尔值）和错误消息列表的元组

## 类

### `OpenAPIGenerator`

OpenAPI规范生成器类，提供链式API构建方法。

**方法：**

#### `__init__`

```python
__init__(self, title: str, version: str)
```

初始化OpenAPI生成器。

#### `with_description`

```python
def with_description(self, description: str) -> Self
```

添加API描述。

#### `add_path`

```python
def add_path(self, path: str, method: str, operation: dict[str, Any]) -> Self
```

添加路径和操作定义。

#### `to_dict`

```python
def to_dict(self) -> dict[str, Any]
```

将生成的规范转换为字典。

#### `to_yaml`

```python
def to_yaml(self) -> str
```

将生成的规范转换为YAML字符串。