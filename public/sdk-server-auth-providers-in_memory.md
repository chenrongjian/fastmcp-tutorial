# in_memory

# `fastmcp.server.auth.providers.in_memory`

FastMCP服务器端基于内存存储的认证提供器，支持动态管理允许的令牌列表。

## 类

### `InMemoryAuthProvider`

在内存中维护允许的令牌列表的认证提供器，支持运行时添加和移除令牌。

**参数：**
- `initial_tokens`: 初始允许的令牌列表（默认为空列表）
- `token_location`: 令牌位置（'header'或'query'，默认为'header'）
- `header_name`: 包含令牌的请求头名称（默认为'Authorization'）
- `header_schema`: 请求头中的令牌前缀（默认为'Bearer'）
- `query_param`: 包含令牌的查询参数名称（默认为'token'）

**方法：**

#### `__init__`

```python
__init__(self, initial_tokens: list[str] = None, token_location: str = 'header', header_name: str = 'Authorization', header_schema: str = 'Bearer', query_param: str = 'token')
```

初始化基于内存的认证提供器。

#### `authenticate`

```python
authenticate(self, request: dict) -> AuthContext | None
```

从请求中提取并验证令牌，使用内存中维护的允许令牌列表。

**参数：**
- `request`: MCP请求字典

**返回：**
- 认证上下文对象，如果验证成功；否则为None

#### `add_token`

```python
add_token(self, token: str) -> None
```

添加新的允许令牌到内存列表。

**参数：**
- `token`: 要添加的令牌字符串

#### `remove_token`

```python
remove_token(self, token: str) -> bool
```

从内存列表中移除令牌。

**参数：**
- `token`: 要移除的令牌字符串

**返回：**
- 如果令牌存在且被成功移除则返回True，否则返回False

#### `clear_tokens`

```python
clear_tokens(self) -> None
```

清空内存中的所有允许令牌。

#### `get_tokens`

```python
get_tokens(self) -> list[str]
```

获取当前允许的令牌列表副本。

**返回：**
- 包含所有允许令牌的列表