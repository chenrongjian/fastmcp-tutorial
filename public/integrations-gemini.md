# Gemini SDK + FastMCP

Google的Gemini API在其Python和JavaScript SDK中包含对MCP服务器的内置支持，允许您直接连接到MCP服务器并将其工具与Gemini模型无缝结合使用。

## Gemini Python SDK
Google的Gemini Python SDK可以直接使用FastMCP客户端。

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
    mcp.run()
```

## 调用服务器
要将Gemini API与MCP一起使用，您需要安装Google Generative AI SDK：
```bash
pip install google-genai
```

您还需要通过Google进行身份验证。您可以通过设置GEMINI_API_KEY环境变量来实现。有关更多信息，请查阅Gemini SDK文档。
```bash
export GEMINI_API_KEY="your-api-key"
```

Gemini的SDK直接与MCP客户端会话交互。要调用服务器，您需要实例化FastMCP客户端，进入其连接上下文，并将客户端会话传递给Gemini SDK：
```python
from fastmcp import Client
from google import genai
import asyncio

mcp_client = Client("server.py")
gemini_client = genai.Client()

async def main():    
    async with mcp_client:
        response = await gemini_client.aio.models.generate_content(
            model="gemini-2.0-flash",
            contents="Roll 3 dice!",
            config=genai.types.GenerateContentConfig(
                temperature=0,
                tools=[mcp_client.session],  # 传递FastMCP客户端会话
            ),
        )
        print(response.text)

if __name__ == "__main__":
    asyncio.run(main())
```

如果您运行此代码，您将看到类似以下的输出：
```
Okay, I rolled 3 dice and got a 5, 4, and 1.
```

## 远程和经过身份验证的服务器
在上面的示例中，我们使用stdio传输连接到本地服务器。因为我们使用的是FastMCP客户端，您还可以连接到任何本地或远程MCP服务器，使用FastMCP支持的任何传输或身份验证方法，只需更改客户端配置即可。

例如，要连接到远程经过身份验证的服务器，您可以使用以下客户端：
```python
from fastmcp import Client
from fastmcp.client.auth import BearerAuth

mcp_client = Client(
    "https://my-server.com/mcp/",
    auth=BearerAuth("<your-token>"),
)
```

代码的其余部分保持不变。