# oauth

# `fastmcp.client.auth.oauth`

## 类

### `OAuth`

FastMCP客户端的OAuth认证辅助工具，用于处理OAuth 2.1授权码流程（包括PKCE）。

**参数：**
- `mcp_url`: MCP服务器的基础URL
- `scopes`: 申请的权限范围列表
- `client_name`: 客户端名称，用于用户授权界面显示
- `token_storage_cache_dir`: 令牌存储缓存目录
- `additional_client_metadata`: 附加的客户端元数据

**方法：**

#### `auth_flow`

```python
auth_flow(self, request)
```

处理OAuth授权流程，返回经过认证的请求。

#### `get_cached_token`

```python
get_cached_token(self)
```

获取缓存的令牌，如果存在且有效。

#### `clear_token`

```python
clear_token(self, server_url: str | None = None)
```

清除特定服务器的缓存令牌，如未指定则清除所有令牌。