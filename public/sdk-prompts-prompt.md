# prompt

# `fastmcp.prompts.prompt`

FastMCP提示词管理核心类，用于定义和渲染可重用的提示词模板。

## 类

### `Prompt`

提示词模板类，支持参数化渲染和版本控制。

**参数：**
- `name`: 提示词名称（唯一标识符）
- `content`: 提示词模板内容（支持Jinja2风格变量）
- `version`: 版本号（默认为"1.0"）
- `description`: 提示词功能描述
- `parameters`: 参数定义 schema（JSON Schema格式）

**方法：**

#### `__init__`

```python
__init__(self, name: str, content: str, version: str = '1.0', description: str = '', parameters: dict | None = None)
```

初始化提示词模板。

#### `render`

```python
render(self, **kwargs) -> str
```

渲染提示词模板，替换变量为实际值。

**参数：**
- `**kwargs`: 模板变量键值对

**返回：**
- 渲染后的提示词字符串

#### `validate_parameters`

```python
validate_parameters(self, params: dict) -> bool
```

验证参数是否符合提示词模板的参数schema。

**参数：**
- `params`: 待验证的参数字典

**返回：**
- 验证结果（True表示验证通过）

#### `to_dict`

```python
to_dict(self) -> dict
```

将提示词对象转换为字典表示。

**返回：**
- 包含提示词所有属性的字典