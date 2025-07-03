# auth

# `fastmcp.server.auth.auth`

FastMCP服务器端认证核心模块，提供认证中间件和认证流程处理功能。

## 类

### `AuthMiddleware`

认证中间件基类，用于处理服务器请求的认证逻辑。

**参数：**
- `providers`: 认证提供器列表，用于验证不同类型的凭证
- `required`: 是否要求所有请求都必须经过认证（默认为True）
- `exclude_paths`: 不需要认证的路径列表

**方法：**

#### `__init__`

```python
__init__(self, providers: list[AuthProvider], required: bool = True, exclude_paths: list[str] = None)
```

初始化认证中间件。

#### `__call__`

```python
__call__(self, request: dict, context: Context) -> dict
```

处理请求认证，验证请求中的凭证并设置上下文认证信息。

**参数：**
- `request`: MCP请求字典
- `context`: 服务器上下文对象

**返回：**
- 处理后的请求字典

**引发：**
- `AuthenticationError`: 如果认证失败且请求路径不在排除列表中

### `AuthContext`

认证上下文类，存储请求的认证信息。

**属性：**
- `user_id`: 认证用户ID
- `roles`: 用户角色列表
- `permissions`: 用户权限列表
- `auth_provider`: 用于认证的提供器名称
- `credentials`: 原始凭证数据

## 函数

### `authenticate_request`

```python
authenticate_request(request: dict, providers: list[AuthProvider]) -> AuthContext | None
```

尝试使用提供的认证提供器验证请求。

**参数：**
- `request`: MCP请求字典
- `providers`: 认证提供器列表

**返回：**
- 认证上下文对象，如果认证成功；否则为None

### `authorize_request`

```python
authorize_request(context: AuthContext, required_permissions: list[str]) -> bool
```

检查认证上下文是否具有所需权限。

**参数：**
- `context`: 认证上下文对象
- `required_permissions`: 所需权限列表

**返回：**
- 如果具有所有所需权限则返回True，否则返回False