# OpenAI API + FastMCP

OpenAI的Responses API支持将MCP服务器作为远程工具源，允许您通过自定义函数扩展AI功能。

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
您的服务器必须部署到公共URL，以便OpenAI能够访问它。

对于开发，您可以使用ngrok等工具将本地运行的服务器临时暴露到互联网。我们将在本示例中这样做（您可能需要安装ngrok并创建免费账户），但您也可以使用任何其他方法部署服务器。

假设您将上述代码保存为server.py，您可以在两个单独的终端中运行以下两个命令来部署服务器并将其暴露到互联网：

## 调用服务器
要使用Responses API，您需要安装OpenAI Python SDK（FastMCP不包含）：
```bash
pip install openai
```

您还需要通过OpenAI进行身份验证。您可以通过设置OPENAI_API_KEY环境变量来实现。有关更多信息，请查阅OpenAI SDK文档。
```bash
export OPENAI_API_KEY="your-api-key"
```

以下是如何从Python调用服务器的示例。请注意，您需要将https://your-server-url.com替换为服务器的实际URL。此外，我们使用/mcp/作为端点，因为我们部署了具有默认路径的streamable-HTTP服务器；如果您自定义了服务器的部署，可能需要使用不同的端点。
```python
from openai import OpenAI

# 您的服务器URL（替换为实际URL）
url = 'https://your-server-url.com'

client = OpenAI()

resp = client.responses.create(
    model="gpt-4.1",
    tools=[
        {
            "type": "mcp",
            "server_label": "dice_server",
            "server_url": f"{url}/mcp/",
            "require_approval": "never",
        },
    ],
    input="Roll a few dice!",
)

print(resp.output_text)
```

如果您运行此代码，您将看到类似以下的输出：
```
You rolled 3 dice and got the following results: 6, 4, and 2!
```

## 身份验证
版本新增：2.6.0
Responses API可以包含用于身份验证的请求头，这意味着您不必担心服务器是否可公开访问。

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
如果您尝试使用我们之前编写的相同OpenAI代码调用经过身份验证的服务器，您将收到类似以下的错误：
```
pythonAPIStatusError: Error code: 424 - {
    "error": {
        "message": "Error retrieving tool list from MCP server: 'dice_server'. Http status code: 401 (Unauthorized)",
        "type": "external_connector_error",
        "param": "tools",
        "code": "http_error"
    }
}
```

正如预期的那样，服务器拒绝了请求，因为它未经过身份验证。

要验证客户端，您可以使用Bearer方案在Authorization头中传递令牌：
```python
from openai import OpenAI

# 您的服务器URL（替换为实际URL）
url = 'https://your-server-url.com'

# 您的访问令牌（替换为您的