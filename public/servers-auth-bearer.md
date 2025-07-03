认证

Bearer Token 认证

`版本新增: 2.6.0`

认证和授权仅与基于HTTP的传输相关。

[MCP规范](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization)要求服务器实现完整的OAuth 2.1授权流程，包括动态客户端注册、服务器元数据发现和完整的令牌端点。FastMCP的Bearer Token认证通过直接验证预发行的JWT令牌提供了一种更简单、更实用的替代方案——非常适合服务到服务通信和编程环境，在这些环境中完整的OAuth流程可能不切实际，并且符合MCP生态系统的实际发展方式。但是，请注意，由于它没有实现完整的OAuth 2.1流程，此实现并不严格符合MCP规范。

Bearer Token认证是保护基于HTTP的API的常用方法。在此模型中，客户端在`Authorization`头中使用“Bearer”方案发送令牌（通常是JSON Web Token或JWT）。然后服务器验证此令牌以授予或拒绝访问。

FastMCP支持其基于HTTP的传输（`streamable-http`和`sse`）的Bearer Token认证，允许您保护服务器免受未授权访问。

## [​](https://gofastmcp.com/servers/auth/bearer\#authentication-strategy) 认证策略

FastMCP使用**非对称加密**进行令牌验证，这在令牌发行者和FastMCP服务器之间提供了清晰的安全分离。这种方法意味着：

- **无共享密钥**：您的FastMCP服务器永远不需要访问私钥或客户端密钥
- **公钥验证**：服务器只需要公钥（或JWKS端点）来验证令牌签名
- **安全令牌发行**：令牌由外部服务使用从未离开发行者的私钥签名
- **可扩展架构**：多个FastMCP服务器可以验证令牌而无需协调密钥

这种设计允许您将FastMCP服务器集成到现有的身份验证基础设施中，而不会损害安全边界。

## [​](https://gofastmcp.com/servers/auth/bearer\#configuration) 配置

要在FastMCP服务器上启用Bearer Token验证，请使用`BearerAuthProvider`类。此提供程序通过验证签名、检查过期时间以及可选地验证声明来验证传入的JWT。

`BearerAuthProvider`验证令牌；它**不**发行令牌（或实现OAuth流程的任何部分）。您需要单独生成令牌， either使用FastMCP实用程序或外部身份提供程序(IdP)或OAuth 2.1授权服务器。

### [​](https://gofastmcp.com/servers/auth/bearer\#basic-setup) 基本设置

要配置bearer令牌认证，请实例化`BearerAuthProvider`实例并将其传递给`FastMCP`实例的`auth`参数。

`BearerAuthProvider`需要静态公钥或JWKS URI（但不能同时需要！）以验证令牌的签名。所有其他参数都是可选的——如果提供，它们将用作额外的验证标准。

```
from fastmcp import FastMCP
from fastmcp.server.auth import BearerAuthProvider

auth = BearerAuthProvider(
    jwks_uri="https://my-identity-provider.com/.well-known/jwks.json",
    issuer="https://my-identity-provider.com/",
    audience="my-mcp-server"
)

mcp = FastMCP(name="My MCP Server", auth=auth)

```

### [​](https://gofastmcp.com/servers/auth/bearer\#configuration-parameters) 配置参数

| 参数 | 类型 | 是否必需 | 描述 |
| --- | --- | --- | --- |
| `public_key` | `str` | 如果未提供`jwks_uri` | PEM格式的RSA公钥，用于静态密钥验证 |
| `jwks_uri` | `str` | 如果未提供`public_key` | JSON Web Key Set端点的URL |
| `issuer` | `str` | 否 | 预期的JWT `iss`声明值 |
| `audience` | `str` | 否 | 预期的JWT `aud`声明值 |
| `required_scopes` | `list[str]` | 否 | 所有请求所需的全局作用域 |

#### [​](https://gofastmcp.com/servers/auth/bearer\#public-key) 公钥

如果您有PEM格式的公钥，可以将其作为字符串提供给`BearerAuthProvider`。

```
from fastmcp.server.auth import BearerAuthProvider
import inspect

public_key_pem = inspect.cleandoc(
    """
    -----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy...
    -----END PUBLIC KEY-----
    """
)

auth = BearerAuthProvider(public_key=public_key_pem)

```

#### [​](https://gofastmcp.com/servers/auth/bearer\#jwks-uri) JWKS URI

```
provider = BearerAuthProvider(
    jwks_uri="https://idp.example.com/.well-known/jwks.json"
)

```

JWKS推荐用于生产环境，因为它支持自动密钥轮换和多个签名密钥。

## [​](https://gofastmcp.com/servers/auth/bearer\#generating-tokens) 生成令牌

对于开发和测试，FastMCP提供`RSAKeyPair`实用程序类来生成令牌，无需外部OAuth提供程序。

`RSAKeyPair`实用程序仅用于开发和测试。对于生产环境，请使用适当的OAuth 2.1授权服务器或身份提供程序。

### [​](https://gofastmcp.com/servers/auth/bearer\#basic-token-generation) 基本令牌生成


```
from fastmcp import FastMCP
from fastmcp.server.auth import BearerAuthProvider
from fastmcp.server.auth.providers.bearer import RSAKeyPair

# 生成新的密钥对
key_pair = RSAKeyPair.generate()

# 使用公钥配置身份验证提供程序
auth = BearerAuthProvider(
    public_key=key_pair.public_key,
    issuer="https://dev.example.com",
    audience="my-dev-server"
)

mcp = FastMCP(name="Development Server", auth=auth)

# 生成测试令牌
token = key_pair.create_token(
    subject="dev-user",
    issuer="https://dev.example.com",
    audience="my-dev-server",
    scopes=["read", "write"]
)

print(f"测试令牌: {token}")

```

### [​](https://gofastmcp.com/servers/auth/bearer\#token-creation-parameters) 令牌创建参数

`create_token()`方法接受以下参数：

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `subject` | `str` | `"fastmcp-user"` | JWT主题声明（通常是用户ID） |
| `issuer` | `str` | `"https://fastmcp.example.com"` | JWT发行者声明 |
| `audience` | `str` | `None` | JWT受众声明 |
| `scopes` | `list[str]` | `None` | 要包含的OAuth作用域 |
| `expires_in_seconds` | `int` | `3600` | 令牌过期时间 |
| `additional_claims` | `dict` | `None` | 要包含的额外声明 |
| `kid` | `str` | `None` | JWKS查找的密钥ID |

## [​](https://gofastmcp.com/servers/auth/bearer\#accessing-token-claims) 访问令牌声明

身份验证后，您的工具、资源或提示可以使用`get_access_token()`依赖函数访问令牌信息：


```
from fastmcp import FastMCP, Context, ToolError
from fastmcp.server.dependencies import get_access_token, AccessToken

@mcp.tool
async def get_my_data(ctx: Context) -> dict:
    access_token: AccessToken = get_access_token()

    user_id = access_token.client_id  # 来自JWT 'sub'或'client_id'声明
    user_scopes = access_token.scopes

    if "data:read_sensitive" not in user_scopes:
        raise ToolError("权限不足: 需要'data:read_sensitive'作用域。")

    return {
        "user": user_id,
        "sensitive_data": f"{user_id}的私有数据",
        "granted_scopes": user_scopes
    }

```

### [​](https://gofastmcp.com/servers/auth/bearer\#accesstoken-properties) AccessToken属性

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `token` | `str` | 原始JWT字符串 |
| `client_id` | `str` | 已认证主体标识符 |
| `scopes` | `list[str]` | 授予的作用域 |
| `expires_at` | `datetime | None` | 令牌过期时间戳 |

[上下文](https://gofastmcp.com/servers/context) [中间件](https://gofastmcp.com/servers/middleware)

本页内容

- [认证策略](https://gofastmcp.com/servers/auth/bearer#authentication-strategy)
- [配置](https://gofastmcp.com/servers/auth/bearer#configuration)
- [基本设置](https://gofastmcp.com/servers/auth/bearer#basic-setup)
- [配置参数](https://gofastmcp.com/servers/auth/bearer#configuration-parameters)
- [公钥](https://gofastmcp.com/servers/auth/bearer#public-key)
- [JWKS URI](https://gofastmcp.com/servers/auth/bearer#jwks-uri)
- [生成令牌](https://gofastmcp.com/servers/auth/bearer#generating-tokens)
- [基本令牌生成](https://gofastmcp.com/servers/auth/bearer#basic-token-generation)
- [令牌创建参数](https://gofastmcp.com/servers/auth/bearer#token-creation-parameters)
- [访问令牌声明](https://gofastmcp.com/servers/auth/bearer#accessing-token-claims)
- [AccessToken属性](https://gofastmcp.com/servers/auth/bearer#accesstoken-properties)