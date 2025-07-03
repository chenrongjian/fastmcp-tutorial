# fastmcp.utilities.http

## 函数

### `create_http_client`

```python
create_http_client(timeout: int = 30, verify_ssl: bool = True) -> AsyncClient
```

创建一个配置好的HTTP客户端实例。

**参数：**
- `timeout`: 请求超时时间（秒），默认30秒
- `verify_ssl`: 是否验证SSL证书，默认True

**返回：**
配置好的AsyncClient实例

### `http_request`

```python
http_request(url: str, method: str = 'GET', **kwargs) -> dict[str, Any]
```

发送HTTP请求并返回解析后的JSON响应。

**参数：**
- `url`: 请求URL
- `method`: HTTP方法，默认'GET'
- `**kwargs`: 其他请求参数（headers, params, json等）

**返回：**
解析后的JSON响应字典

## 类

### `HttpClient`

HTTP客户端包装类，提供便捷的HTTP请求方法。

**方法：**

#### `__init__`

```python
__init__(self, base_url: str | None = None, timeout: int = 30)
```

初始化HTTP客户端。

#### `request`

```python
async def request(self, path: str, method: str = 'GET', **kwargs) -> dict[str, Any]
```

发送异步HTTP请求。

#### `get`

```python
async def get(self, path: str, **kwargs) -> dict[str, Any]
```

发送GET请求。

#### `post`

```python
async def post(self, path: str, data: dict | None = None, **kwargs) -> dict[str, Any]
```

发送POST请求。