# 如何将LLM连接到REST API

你已经构建了一个强大的REST API，现在希望你的LLM能够使用它。为每个端点手动编写包装函数既繁琐又容易出错，且难以维护。

这正是FastMCP的优势所在。如果你的API有OpenAPI（或Swagger）规范，FastMCP可以自动将你的整个API转换为功能齐全的MCP服务器，使每个端点都能作为安全、类型化的工具供AI模型使用。

本指南将引导你通过几行代码将公共REST API转换为MCP服务器。

## 先决条件

确保你已安装FastMCP。如果没有，请按照安装指南进行安装。
```bash
pip install fastmcp
```

## 步骤1：选择目标API

在本教程中，我们将使用JSONPlaceholder API，这是一个免费的、模拟的在线REST API，用于测试和原型设计。它非常适合，因为它简单且有公开的OpenAPI规范。

- API基础URL：https://jsonplaceholder.typicode.com
- OpenAPI规范URL：我们将使用社区提供的规范。

## 步骤2：创建MCP服务器

现在是神奇的部分。我们将使用FastMCP.from_openapi方法。该方法接受为你的API配置的httpx.AsyncClient及其OpenAPI规范，并自动将每个端点转换为可调用的MCP工具。

创建一个名为api_server.py的文件：
```python
# api_server.py
import httpx
from fastmcp import FastMCP

# 为目标API创建HTTP客户端
client = httpx.AsyncClient(base_url="https://jsonplaceholder.typicode.com")

# 为JSONPlaceholder定义简化的OpenAPI规范
openapi_spec = {
    "openapi": "3.0.0",
    "info": {"title": "JSONPlaceholder API", "version": "1.0"},
    "paths": {
        "/users": {
            "get": {
                "summary": "获取所有用户",
                "operationId": "get_users",
                "responses": {"200": {"description": "用户列表。"}}
            }
        },
        "/users/{id}": {
            "get": {
                "summary": "通过ID获取用户",
                "operationId": "get_user_by_id",
                "parameters": [{"name": "id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {"200": {"description": "单个用户。"}}
            }
        }
    }
}

# 从OpenAPI规范创建MCP服务器
mcp = FastMCP.from_openapi(
    openapi_spec=openapi_spec,
    client=client,
    name="JSONPlaceholder MCP Server"
)

if __name__ == "__main__":
    mcp.run(transport="http", port=8000)
```

就是这样！只需几行代码，你就创建了一个MCP服务器，它将整个JSONPlaceholder API公开为一系列工具。

## 步骤3：测试生成的服务器

让我们验证新创建的MCP服务器是否正常工作。我们可以使用fastmcp.Client连接到它并检查其工具。

创建一个单独的文件api_client.py：
```python
# api_client.py
import asyncio
from fastmcp import Client

async def main():
    # 连接到我们刚刚创建的MCP服务器
    async with Client("http://127.0.0.1:8000/mcp/") as client:
        
        # 列出自动生成的工具
        tools = await client.list_tools()
        print("生成的工具：")
        for tool in tools:
            print(f"- {tool.name}")
            
        # 调用其中一个生成的工具
        print("\n\n调用工具'get_user_by_id'...")
        user = await client.call_tool("get_user_by_id", {"id": 1})
        print(f"结果：\n{user[0].text}")

if __name__ == "__main__":
    asyncio.run(main())
```

首先，运行服务器：
```bash
python api_server.py
```

然后，在另一个终端中运行客户端：
```bash
python api_client.py
```

你应该会看到生成的工具列表（get_users、get_user_by_id）以及调用get_user_by_id工具的结果，该工具从实时JSONPlaceholder API获取数据。

## 步骤4：自定义路由映射

默认情况下，FastMCP将每个API端点转换为MCP工具。这确保了与当代LLM客户端的最大兼容性，其中许多客户端仅支持MCP规范的工具部分。

然而，对于支持完整MCP规范的客户端，将GET请求表示为资源在语义上更正确且更高效。

FastMCP允许用户使用“路由映射”概念自定义此行为。RouteMap是API路由到MCP类型的映射。FastMCP按顺序检查每个API路由与你的自定义映射。如果路由与映射匹配，它将转换为指定的mcp_type。任何与自定义映射不匹配的路由将回退到默认行为（成为工具）。

以下是如何添加自定义路由映射以将GET请求转换为资源和资源模板（如果它们有路径参数）：
```python
# api_server_with_resources.py
import httpx
from fastmcp import FastMCP
from fastmcp.server.openapi import RouteMap, MCPType


# 为目标API创建HTTP客户端
client = httpx.AsyncClient(base_url="https://jsonplaceholder.typicode.com")

# 为JSONPlaceholder定义简化的OpenAPI规范
openapi_spec = {
    "openapi": "3.0.0",
    "info": {"title": "JSONPlaceholder API", "version": "1.0"},
    "paths": {
        "/users": {
            "get": {
                "summary": "获取所有用户",
                "operationId": "get_users",
                "responses": {"200": {"description": "用户列表。"}}
            }
        },
        "/users/{id}": {
            "get": {
                "summary": "通过ID获取用户",
                "operationId": "get_user_by_id",
                "parameters": [{"name": "id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {"200": {"description": "单个用户。"}}
            }
        }
    }
}

# 创建自定义路由映射
route_maps = [
    # 将GET /users转换为资源
    RouteMap(
        path="/users",
        method="GET",
        mcp_type=MCPType.RESOURCE,
        uri="jsonplaceholder://users"
    ),
    # 将GET /users/{id}转换为资源模板
    RouteMap(
        path="/users/{id}",
        method="GET",
        mcp_type=MCPType.RESOURCE_TEMPLATE,
        uri="jsonplaceholder://users/{id}"
    )
]

# 使用自定义路由映射创建MCP服务器
mcp = FastMCP.from_openapi(
    openapi_spec=openapi_spec,
    client=client,
    name="JSONPlaceholder MCP Server",
    route_maps=route_maps
)

if __name__ == "__main__":
    mcp.run(transport="http", port=8000)
```