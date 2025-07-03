# fastmcp.tools.tool

## 函数

### `default_serializer` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L34" target="_blank">↗</a></sup>

```python
default_serializer(data: Any) -> str
```

## 类

### `Tool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L38" target="_blank">↗</a></sup>

内部工具注册信息。

**方法：**

#### `to_mcp_tool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L49" target="_blank">↗</a></sup>

```python
to_mcp_tool(self, **overrides: Any) -> MCPTool
```

#### `from_function` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L59" target="_blank">↗</a></sup>

```python
from_function(fn: Callable[..., Any], name: str | None = None, description: str | None = None, tags: set[str] | None = None, annotations: ToolAnnotations | None = None, exclude_args: list[str] | None = None, serializer: Callable[[Any], str] | None = None, enabled: bool | None = None) -> FunctionTool
```

从函数创建工具。

#### `from_tool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L86" target="_blank">↗</a></sup>

```python
from_tool(cls, tool: Tool, transform_fn: Callable[..., Any] | None = None, name: str | None = None, transform_args: dict[str, ArgTransform] | None = None, description: str | None = None, tags: set[str] | None = None, annotations: ToolAnnotations | None = None, serializer: Callable[[Any], str] | None = None, enabled: bool | None = None) -> TransformedTool
```

### `FunctionTool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L113" target="_blank">↗</a></sup>

**方法：**

#### `from_function` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L117" target="_blank">↗</a></sup>

```python
from_function(cls, fn: Callable[..., Any], name: str | None = None, description: str | None = None, tags: set[str] | None = None, annotations: ToolAnnotations | None = None, exclude_args: list[str] | None = None, serializer: Callable[[Any], str] | None = None, enabled: bool | None = None) -> FunctionTool
```

从函数创建工具。

### `ParsedFunction` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L194" target="_blank">↗</a></sup>

**方法：**

#### `from_function` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool.py#L201" target="_blank">↗</a></sup>

```python
from_function(cls, fn: Callable[..., Any], exclude_args: list[str] | None = None, validate: bool = True) -> ParsedFunction
```