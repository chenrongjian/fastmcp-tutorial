# fastmcp.utilities.mcp_config

## 函数

### `load_mcp_config`

```python
load_mcp_config(path: str | None = None) -> dict[str, Any]
```

加载MCP配置文件。如果未指定路径，将尝试从默认位置加载。

**参数：**
- `path`: 配置文件路径，可选

**返回：**
解析后的配置字典

### `validate_mcp_config`

```python
validate_mcp_config(config: dict[str, Any]) -> tuple[bool, list[str]]
```

验证MCP配置是否符合规范。

**参数：**
- `config`: 要验证的配置字典

**返回：**
包含验证结果（布尔值）和错误消息列表的元组

### `merge_mcp_configs`

```python
merge_mcp_configs(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]
```

合并基础配置和覆盖配置，后者将覆盖前者中的同名键。

**参数：**
- `base`: 基础配置
- `override`: 覆盖配置

**返回：**
合并后的配置字典

## 类

### `MCPConfig`

MCP配置管理类。

**方法：**

#### `__init__`

```python
__init__(self, config: dict[str, Any] | None = None)
```

初始化配置管理器。

#### `get`

```python
def get(self, key: str, default: Any = None) -> Any
```

获取配置值。

#### `set`

```python
def set(self, key: str, value: Any) -> None
```

设置配置值。

#### `save`

```python
def save(self, path: str) -> None
```

将配置保存到文件。