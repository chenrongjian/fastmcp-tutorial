# fastmcp.server.proxy

## 类

### `ProxyToolManager` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L36" target="_blank">↗</a></sup>

一种ToolManager，除了本地和挂载的工具外，还从远程客户端获取工具。

### `ProxyResourceManager` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L81" target="_blank">↗</a></sup>

一种ResourceManager，除了本地和挂载的资源外，还从远程客户端获取资源。

### `ProxyPromptManager` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L159" target="_blank">↗</a></sup>

一种PromptManager，除了本地和挂载的提示词外，还从远程客户端获取提示词。

### `ProxyTool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L209" target="_blank">↗</a></sup>

表示并在远程服务器上执行工具的工具。

**方法：**

#### `from_mcp_tool` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L219" target="_blank">↗</a></sup>

```python
from_mcp_tool(cls, client: Client, mcp_tool: mcp.types.Tool) -> ProxyTool
```

从原始MCP工具模式创建ProxyTool的工厂方法。

### `ProxyResource` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L246" target="_blank">↗</a></sup>

表示并从远程服务器读取资源的资源。

**方法：**

#### `from_mcp_resource` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L260" target="_blank">↗</a></sup>

```python
from_mcp_resource(cls, client: Client, mcp_resource: mcp.types.Resource) -> ProxyResource
```

从原始MCP资源模式创建ProxyResource的工厂方法。

### `ProxyTemplate` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L287" target="_blank">↗</a></sup>

表示并从远程服务器模板创建资源的ResourceTemplate。

**方法：**

#### `from_mcp_template` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L297" target="_blank">↗</a></sup>

```python
from_mcp_template(cls, client: Client, mcp_template: mcp.types.ResourceTemplate) -> ProxyTemplate
```

从原始MCP模板模式创建ProxyTemplate的工厂方法。

### `ProxyPrompt` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L343" target="_blank">↗</a></sup>

表示并从远程服务器呈现提示词的提示词。

**方法：**

#### `from_mcp_prompt` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L355" target="_blank">↗</a></sup>

```python
from_mcp_prompt(cls, client: Client, mcp_prompt: mcp.types.Prompt) -> ProxyPrompt
```

从原始MCP提示词模式创建ProxyPrompt的工厂方法。

### `FastMCPProxy` <sup><a href="https://github.com/jlowin/fastmcp/blob/main/src/fastmcp/server/proxy.py#L381" target="_blank">↗</a></sup>

充当远程MCP兼容服务器代理的FastMCP服务器。它使用通过HTTP客户端满足请求的专用管理器。