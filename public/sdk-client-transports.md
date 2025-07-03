# transports

# `fastmcp.client.transports`

FastMCP客户端传输协议实现，负责客户端与服务器之间的通信。

## 类

### `Transport`

传输协议基类，定义了传输层的通用接口。

**方法：**

#### `connect`

```python
connect(self) -> None
```

建立与服务器的连接。

#### `send`

```python
send(self, data: bytes) -> None
```

向服务器发送数据。

**参数：**
- `data`: 要发送的字节数据

#### `receive`

```python
receive(self) -> bytes
```

从服务器接收数据。

**返回：**
- 接收到的字节数据

#### `close`

```python
close(self) -> None
```

关闭与服务器的连接。

### `StdioTransport`

基于标准输入输出的传输实现，适用于本地进程间通信。

**继承：** Transport

### `HttpTransport`

基于HTTP的传输实现，支持streamable-http和sse协议。

**继承：** Transport

**参数：**
- `server_url`: HTTP服务器URL
- `timeout`: 请求超时时间（秒）
- `headers`: 额外的HTTP请求头

#### `__init__`

```python
__init__(self, server_url: str, timeout: int = 30, headers: dict[str, str] | None = None)
```

初始化HTTP传输实例。