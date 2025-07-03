# prompt_manager

# `fastmcp.prompts.prompt_manager`

FastMCP提示词管理器，用于注册、检索和管理多个提示词模板。

## 类

### `PromptManager`

提示词模板管理器，支持多版本提示词的存储和访问。

**方法：**

#### `__init__`

```python
__init__(self)
```

初始化提示词管理器。

#### `register_prompt`

```python
register_prompt(self, prompt: Prompt) -> None
```

注册提示词模板到管理器。

**参数：**
- `prompt`: Prompt类实例

#### `get_prompt`

```python
get_prompt(self, name: str, version: str | None = None) -> Prompt
```

检索指定名称和版本的提示词模板。

**参数：**
- `name`: 提示词名称
- `version`: 版本号（如未指定则返回最新版本）

**返回：**
- Prompt类实例

**引发：**
- `NotFoundError`: 如果指定名称或版本的提示词不存在

#### `list_prompts`

```python
list_prompts(self) -> list[dict]
```

列出所有已注册的提示词模板元信息。

**返回：**
- 包含提示词名称、版本和描述的字典列表

#### `remove_prompt`

```python
remove_prompt(self, name: str, version: str | None = None) -> None
```

移除指定名称和版本的提示词模板。

**参数：**
- `name`: 提示词名称
- `version`: 版本号（如未指定则移除所有版本）