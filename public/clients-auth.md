版本 2.6.0 新增
当您的FastMCP客户端需要访问受OAuth 2.1保护的MCP服务器，且该过程需要用户交互（如登录和授予权限）时，您应该使用授权码流程。FastMCP提供了fastmcp.client.auth.OAuth辅助工具来简化整个过程。

此流程常见于面向用户的应用程序，其中应用程序代表用户执行操作。

## 客户端使用

### 默认配置

使用OAuth最简单的方法是将字符串"oauth"传递给Client或传输实例的auth参数。FastMCP将自动配置客户端使用带有默认设置的OAuth：

```python
from fastmcp import Client

# 使用默认OAuth设置
async with Client("https://fastmcp.cloud/mcp", auth="oauth") as client:
    await client.ping()
```

### OAuth辅助工具

要完全配置OAuth流程，请使用OAuth辅助工具并将其传递给Client或传输实例的auth参数。OAuth管理OAuth 2.1授权码授予与PKCE（代码交换证明密钥）的复杂性以增强安全性，并实现完整的httpx.Auth接口。

```python
from fastmcp import Client
from fastmcp.client.auth import OAuth

oauth = OAuth(mcp_url="https://fastmcp.cloud/mcp")

async with Client("https://fastmcp.cloud/mcp", auth=oauth) as client:
    await client.ping()
```

### OAuth参数

- **mcp_url (str)**：目标MCP服务器端点的完整URL。用于发现OAuth服务器元数据
- **scopes (str | list[str], 可选)**：要请求的OAuth作用域。可以是空格分隔的字符串或字符串列表
- **client_name (str, 可选)**：动态注册的客户端名称。默认为"FastMCP Client"
- **token_storage_cache_dir (Path, 可选)**：令牌缓存目录。默认为~/.fastmcp/oauth-mcp-client-cache/
- **additional_client_metadata (dict[str, Any], 可选)**：用于客户端注册的额外元数据

## OAuth流程

当您使用配置为使用OAuth的FastMCP客户端时，将触发OAuth流程。

## 令牌管理

### 令牌存储

OAuth访问令牌自动缓存在~/.fastmcp/oauth-mcp-client-cache/中，并在应用程序运行之间保持。文件按OAuth服务器的基本URL进行键控。

### 管理缓存

要清除特定服务器的令牌，请实例化FileTokenStorage实例并调用clear方法：

```python
from fastmcp.client.auth.oauth import FileTokenStorage

storage = FileTokenStorage(server_url="https://fastmcp.cloud/mcp")
await storage.clear()
```

要清除所有服务器的所有令牌，请在FileTokenStorage类上调用clear_all方法：

```python
from fastmcp.client.auth.oauth import FileTokenStorage

FileTokenStorage.clear_all()
```