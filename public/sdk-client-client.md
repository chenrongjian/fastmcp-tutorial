# client

# `fastmcp.client.client`

FastMCP客户端核心类，用于与MCP服务器建立连接和交互。

## 类

### `Client`

MCP客户端主类，负责处理与服务器的通信、认证和请求发送。

**参数：**
- `server_url`: MCP服务器的URL地址
- `auth`: 认证对象（如BearerAuth或OAuth实例）
- `transport`: 传输协议类型（默认为'stdio'）
- `timeout`: 请求超时时间（秒）
- `logger`: 日志记录器实例

**方法：**

#### `__init__`

```python
__init__(self, server_url: str, auth: Any | None = None, transport: str = 'stdio', timeout: int = 30, logger: Logger | None = None)
```

初始化MCP客户端。

#### `connect`

```python
connect(self) -> None
```

建立与MCP服务器的连接。

#### `send_request`

```python
send_request(self, request: dict) -> dict
```

向服务器发送请求并返回响应。

**参数：**
- `request`: 包含请求信息的字典（符合MCP规范）

**返回：**
- 服务器响应字典

#### `close`

```python
close(self) -> None
```

关闭与服务器的连接。

#### `get_tool`

```python
get_tool(self, tool_name: str) -> dict
```

获取服务器上可用工具的元数据。

**参数：**
- `tool_name`: 工具名称

**返回：**
- 工具元数据字典