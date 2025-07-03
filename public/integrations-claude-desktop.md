# Claude Desktop + FastMCP

Claude Desktop通过本地STDIO连接和远程服务器（测试版）支持MCP服务器，允许您通过FastMCP服务器的自定义工具、资源和提示词扩展Claude的功能。

## 要求
Claude Desktop传统上要求MCP服务器使用STDIO传输在本地运行，服务器通过标准输入/输出而非HTTP与Claude通信。不过，某些计划的用户现在也可以访问远程服务器支持。

## 创建服务器
本指南中的示例将使用以下简单的掷骰子服务器，保存为server.py：
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

## 安装服务器
### FastMCP CLI
在Claude Desktop中安装FastMCP服务器最简单的方法是使用fastmcp install命令。它会自动处理配置和依赖管理：
```bash
fastmcp install server.py
```

install命令支持与run命令相同的file.py:object表示法。如果未指定对象，它会自动在文件中查找名为mcp、server或app的FastMCP服务器对象：
```bash
# 如果服务器对象名为'mcp'，这些命令等效
fastmcp install server.py
fastmcp install server.py:mcp

# 如果服务器有不同名称，使用显式对象名
fastmcp install server.py:my_custom_server
```

安装后，完全重启Claude Desktop。您应该在输入框左下角看到一个锤子图标（🔨），表示MCP工具可用。

### 依赖项
如果服务器有依赖项，可使用--with标志包含它们：
```bash
fastmcp install server.py --with pandas --with requests
```

或者，您可以在服务器代码中直接指定依赖项：
```python
server.py
from fastmcp import FastMCP

mcp = FastMCP(
    name="Dice Roller",
    dependencies=["pandas", "requests"]
)
```

### 环境变量
如果服务器需要环境变量（如API密钥），必须包含它们：
```bash
fastmcp install server.py --name "Weather Server" \
  --env-var API_KEY=your-api-key \
  --env-var DEBUG=true
```

或从.env文件加载：
```bash
fastmcp install server.py --name "Weather Server" --env-file .env
```

## 手动配置
要获得对配置的更多控制，您可以手动编辑Claude Desktop的配置文件。您可以从Claude的开发者设置中打开配置文件，或在以下位置找到它：

- macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
- Windows: %APPDATA%\Claude\claude_desktop_config.json

配置文件是一个JSON对象，包含mcpServers键，其中包含每个MCP服务器的配置：
```json
{
  "mcpServers": {
    "dice-roller": {
      "command": "python",
      "args": ["path/to/your/server.py"]
    }
  }
}
```

更新配置文件后，完全重启Claude Desktop。查找锤子图标（🔨）以确认服务器已加载。

### 依赖项
如果服务器有依赖项，您可以使用uv或其他包管理器设置环境：
```json
{
  "mcpServers": {
    "dice-roller": {
      "command": "uv",
      "args": [
        "run",
        "--with", "pandas",
        "--with", "requests", 
        "python",
        "path/to/your/server.py"
      ]
    }
  }
}
```

### 环境变量
您也可以在配置中指定环境变量：
```json
{
  "mcpServers": {
    "weather-server": {
      "command": "python",
      "args": ["path/to/weather_server.py"],
      "env": {
        "API_KEY": "your-api-key",
        "DEBUG": "true"
      }
    }
  }
}
```

## 远程服务器
Claude Pro、Max、Team和Enterprise计划的用户通过集成获得一流的远程服务器支持。对于其他用户，或作为替代方法，FastMCP可以创建一个代理服务器，将请求转发到远程HTTP服务器。您可以在Claude Desktop中安装代理服务器。

创建连接到远程HTTP服务器的代理服务器：
```python
proxy_server.py
from fastmcp import FastMCP

# 创建远程服务器代理
proxy = FastMCP.as_proxy(
    "https://example.com/mcp/sse", 
    name="Remote Server Proxy"
)

if __name__ == "__main__":
    proxy.run()  # 通过STDIO运行以用于Claude Desktop
```

## 身份验证
对于经过身份验证的远程服务器，按照客户端身份验证文档中的指导创建经过身份验证的客户端，并将其传递给代理：
```python
auth_proxy_server.py
from fastmcp import FastMCP, Client
from fastmcp.client.auth import BearerAuth

# 创建经过身份验证的客户端
client = Client(
    "https://api.example.com/mcp/sse",
    auth=BearerAuth(token="your-access-token")
)

# 使用经过身份验证的客户端创建代理
proxy = FastMCP.as_proxy(client, name="Authenticated Proxy")

if __name__ == "__main__":
    proxy.run()
```