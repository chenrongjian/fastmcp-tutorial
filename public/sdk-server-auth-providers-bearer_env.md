# bearer_env

# `fastmcp.server.auth.providers.bearer_env`

FastMCP服务器端基于环境变量的Bearer令牌认证提供器，从环境变量加载允许的令牌列表。

## 类

### `BearerEnvAuthProvider`

从环境变量读取允许的Bearer令牌列表进行认证的提供器。

**参数：**
- `env_var`: 存储允许令牌的环境变量名称（默认为'FASTMCP_BEARER_TOKENS'）
- `token_delimiter`: 环境变量中令牌的分隔符（默认为','）
- `token_location`: 令牌位置（'header'或'query'，默认为'header'）
- `header_name`: 包含令牌的请求头名称（默认为'Authorization'）
- `header_schema`: 请求头中的令牌前缀（默认为'Bearer'）
- `query_param`: 包含令牌的查询参数名称（默认为'token'）

**方法：**

#### `__init__`

```python
__init__(self, env_var: str = 'FASTMCP_BEARER_TOKENS', token_delimiter: str = ',', token_location: str = 'header', header_name: str = 'Authorization', header_schema: str = 'Bearer', query_param: str = 'token')
```

初始化基于环境变量的Bearer认证提供器。

#### `authenticate`

```python
authenticate(self, request: dict) -> AuthContext | None
```

从请求中提取并验证Bearer令牌，使用环境变量中定义的允许令牌列表。

**参数：**
- `request`: MCP请求字典

**返回：**
- 认证上下文对象，如果验证成功；否则为None

#### `_load_tokens_from_env`

```python
_load_tokens_from_env(self) -> list[str]
```

从环境变量加载并解析允许的令牌列表。

**返回：**
- 包含允许令牌的列表