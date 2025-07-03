# fastmcp.tools.tool_manager

## 类

### `ToolManager` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool_manager.py#L22" target="_blank">↗</a></sup>

管理FastMCP工具。

**方法：**

#### `mount` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool_manager.py#L46" target="_blank">↗</a></sup>

```python
mount(self, server: MountedServer) -> None
```

添加挂载的服务器作为工具的来源。

#### `add_tool_from_fn` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool_manager.py#L113" target="_blank">↗</a></sup>

```python
add_tool_from_fn(self, fn: Callable[..., Any], name: str | None = None, description: str | None = None, tags: set[str] | None = None, annotations: ToolAnnotations | None = None, serializer: Callable[[Any], str] | None = None, exclude_args: list[str] | None = None) -> Tool
```

向服务器添加工具。

#### `add_tool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool_manager.py#L142" target="_blank">↗</a></sup>

```python
add_tool(self, tool: Tool) -> Tool
```

向服务器注册工具。

#### `remove_tool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/tools/tool_manager.py#L159" target="_blank">↗</a></sup>

```python
remove_tool(self, key: str) -> None
```

从服务器移除工具。

**参数：**

* `key`：要移除的工具的键

**引发：**

* `NotFoundError`：如果工具未找到