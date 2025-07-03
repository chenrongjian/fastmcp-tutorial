# fastmcp.utilities.json_schema

## 函数

### `validate_json`

```python
validate_json(data: Any, schema: dict[str, Any]) -> tuple[bool, list[str]]
```

使用JSON模式验证数据。

**参数：**
- `data`: 要验证的数据
- `schema`: JSON模式定义

**返回：**
包含验证结果（布尔值）和错误消息列表的元组

### `generate_schema`

```python
generate_schema(data: Any) -> dict[str, Any]
```

从示例数据生成JSON模式。

**参数：**
- `data`: 用于生成模式的示例数据

**返回：**
生成的JSON模式字典

### `merge_schemas`

```python
merge_schemas(*schemas: dict[str, Any]) -> dict[str, Any]
```

合并多个JSON模式。

**参数：**
- `*schemas`: 要合并的JSON模式

**返回：**
合并后的JSON模式

## 类

### `JsonSchemaValidator`

JSON模式验证器类。

**方法：**

#### `__init__`

```python
__init__(self, schema: dict[str, Any])
```

使用指定的模式初始化验证器。

#### `validate`

```python
def validate(self, data: Any) -> list[str]
```

验证数据并返回错误消息列表。