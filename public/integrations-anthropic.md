# Anthropic API + FastMCP

Anthropic的Messages API支持将MCP服务器作为远程工具源。本教程将展示如何创建FastMCP服务器并将其部署到公共URL，然后从Messages API调用它。

## 创建服务器
首先，创建一个包含要公开的工具的FastMCP服务器。对于本示例，我们将创建一个具有单个掷骰子工具的服务器：
```python
server.py
import random
from fastmcp import FastMCP

mcp = FastMCP(name="Dice Roller")

@mcp.tool
def roll_dice(n_dice: int) -> list[int]:
    """Roll `n_dice` 6-sided dice and return the results."""
    return [random.randint(1, 6) for _ in range(n_dice)]

if __name__ == "__main__":
    mcp.run(transport="http", port=8000)
```

## 部署服务器
您的服务器必须部署到公共URL，以便Anthropic能够访问它。MCP连接器支持SSE和Streamable HTTP传输。

对于开发，您可以使用ngrok等工具将本地运行的服务器临时暴露到互联网。我们将在本示例中这样做（您可能需要安装ngrok并创建免费账户），但您也可以使用任何其他方法部署服务器。

假设您将上述代码保存为server.py，您可以在两个单独的终端中运行以下两个命令来部署服务器并将其暴露到互联网：

## 调用服务器
要将Messages API与MCP服务器一起使用，您需要安装Anthropic Python SDK（FastMCP不包含）：
```bash
pip install anthropic
```

您还需要通过Anthropic进行身份验证。您可以通过设置ANTHROPIC_API_KEY环境变量来实现。有关更多信息，请查阅Anthropic SDK文档。
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

以下是如何从Python调用服务器的示例。请注意，您需要将https://your-server-url.com替换为服务器的实际URL。此外，我们使用/mcp/作为端点，因为我们部署了具有默认路径的streamable-HTTP服务器；如果您自定义了服务器的部署，可能需要使用不同的端点。此时，您还必须包含带有anthropic-beta头的extra_headers参数。
```python
import anthropic
from rich import print

# 您的服务器URL（替换为实际URL）
url = 'https://your-server-url.com'

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Roll a few dice!"}],
    mcp_servers=[
        {
            "type": "url",
            "url": f"{url}/mcp/",
            "name": "dice-server",
        }
    ],
    extra_headers={
        "anthropic-beta": "mcp-client-2025-04-04"
    }
)

print(response.content)
```

如果您运行此代码，您将看到类似以下的输出：
```
I'll roll some dice for you! Let me use the dice rolling tool.

I rolled 3 dice and got: 4, 2, 6

The results were 4, 2, and 6. Would you like me to roll again or roll a different number of dice?
```

## 身份验证
版本新增：2.6.0
MCP连接器通过授权令牌支持OAuth身份验证，这意味着您可以保护服务器，同时仍然允许Anthropic访问它。

### 服务器身份验证
向服务器添加身份验证的最简单方法是使用bearer令牌方案。

对于本示例，我们将使用FastMCP的RSAKeyPair实用程序快速生成自己的令牌，但这可能不适用于生产环境。有关更多详细信息，请参阅完整的服务器端Bearer Auth文档。

我们首先创建一个RSA密钥对来签名和验证令牌：
```python
from fastmcp.server.auth.providers.bearer import RSAKeyPair

key_pair = RSAKeyPair.generate()
access_token = key_pair.create_token(audience="dice-server")
```

接下来，我们将创建一个BearerAuthProvider来验证服务器：
```python
from fastmcp import FastMCP
from fastmcp.server.auth import BearerAuthProvider

auth = BearerAuthProvider(
    public_key=key_pair.public_key,
    audience="dice-server",
)

mcp = FastMCP(name="Dice Roller", auth=auth)
```

这是一个您可以复制/粘贴的完整示例。为简单起见，仅在本示例中，它将把令牌打印到控制台。不要在生产环境中这样做！
```python
server.py
from fastmcp import FastMCP
from fastmcp.server.auth import BearerAuthProvider
from fastmcp.server.auth.providers.bearer import RSAKeyPair
import random

key_pair = RSAKeyPair.generate()
access_token = key_pair.create_token(audience="dice-server")

auth = BearerAuthProvider(
    public_key=key_pair.public_key,
    audience="dice-server",
)

mcp = FastMCP(name="Dice Roller", auth=auth)

@mcp.tool
def roll_dice(n_dice: int) -> list[int]:
    """Roll `n_dice` 6-sided dice and return the results."""
    return [random.randint(1, 6) for _ in range(n_dice)]

if __name__ == "__main__":
    print(f"\n---\n\n🔑 Dice Roller access token:\n\n{access_token}\n\n---\n")
    mcp.run(transport="http", port=8000)
```

### 客户端身份验证
如果您尝试使用我们之前编写的相同Anthropic代码调用经过身份验证的服务器，您将收到一个错误，指示服务器拒绝了请求，因为它未经过身份验证。