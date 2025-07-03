# bearer

# `fastmcp.server.auth.providers.bearer`

FastMCP服务器端Bearer令牌认证提供器，用于验证客户端提交的Bearer令牌。

## 类

### `BearerAuthProvider`

基于Bearer令牌的认证提供器，支持验证JWT令牌和简单令牌。

**参数：**
- `allowed_tokens`: 允许的令牌列表（用于简单令牌验证）
- `jwt_public_key`: JWT验证公钥（用于JWT令牌验证）
- `jwt_algorithms`: JWT支持的算法列表（默认为['HS256']）
- `token_location`: 令牌位置（'header'或'query'，默认为'header'）
- `header_name`: 包含令牌的请求头名称（默认为'Authorization'）
- `header_schema`: 请求头中的令牌前缀（默认为'Bearer'）
- `query_param`: 包含令牌的查询参数名称（默认为'token'）

**方法：**

#### `__init__`

```python
__init__(self, allowed_tokens: list[str] | None = None, jwt_public_key: str | None = None, jwt_algorithms: list[str] = None, token_location: str = 'header', header_name: str = 'Authorization', header_schema: str = 'Bearer', query_param: str = 'token')
```

初始化Bearer认证提供器。

#### `authenticate`

```python
authenticate(self, request: dict) -> AuthContext | None
```

从请求中提取并验证Bearer令牌，返回认证上下文。

**参数：**
- `request`: MCP请求字典

**返回：**
- 认证上下文对象，如果验证成功；否则为None

#### `_verify_jwt_token`

```python
_verify_jwt_token(self, token: str) -> dict | None
```

验证JWT令牌并返回有效载荷。

**参数：**
- `token`: JWT令牌字符串

**返回：**
- 包含令牌载荷的字典，如果验证成功；否则为None

#### `_verify_simple_token`

```python
_verify_simple_token(self, token: str) -> bool
```

验证简单令牌是否在允许的令牌列表中。

**参数：**
- `token`: 简单令牌字符串

**返回：**
- 验证结果（True表示验证通过）