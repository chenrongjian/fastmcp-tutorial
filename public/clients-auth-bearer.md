版本 2.6.0 新增
您可以通过提供有效的访问令牌来配置FastMCP客户端使用Bearer身份验证。这最适用于服务账户、长期API密钥、CI/CD、身份验证单独管理的应用程序或其他非交互式身份验证方法。

Bearer令牌是用于验证请求的JSON Web令牌（JWT）。它最常用于HTTP请求的Authorization头中，使用Bearer方案：

```
Authorization: Bearer <token>
```

## 客户端使用

使用预先存在的Bearer令牌最直接的方法是将其作为字符串提供给fastmcp.Client或传输实例的auth参数。FastMCP将自动为Authorization头和Bearer方案正确格式化它。

```python
from fastmcp import Client

async with Client(
    "https://fastmcp.cloud/mcp", 
    auth="<your-token>",
) as client:
    await client.ping()
```

您也可以将Bearer令牌提供给传输实例，例如StreamableHttpTransport或SSETransport：

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(
    "http://fastmcp.cloud/mcp", 
    auth="<your-token>",
)

async with Client(transport) as client:
    await client.ping()
```

## BearerAuth辅助工具

如果您希望更明确，不想依赖FastMCP转换字符串令牌，您可以自己使用BearerAuth类，它实现了httpx.Auth接口。

```python
from fastmcp import Client
from fastmcp.client.auth import BearerAuth

async with Client(
    "https://fastmcp.cloud/mcp", 
    auth=BearerAuth(token="<your-token>"),
) as client:
    await client.ping()
```

如果MCP服务器期望自定义头或令牌方案，您可以通过在传输上设置客户端的头而不是使用auth参数：

```python
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

async with Client(
    transport=StreamableHttpTransport(
        "https://fastmcp.cloud/mcp", 
        headers={"X-API-Key": "<your-token>"},
    ),
) as client:
    await client.ping()
```