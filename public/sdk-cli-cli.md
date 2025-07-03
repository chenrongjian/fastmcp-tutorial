# cli

# `fastmcp.cli.cli`

FastMCP命令行工具。

## 函数

### `version`

```python
version(ctx: Context)
```

### `dev`

```python
dev(server_spec: str = typer.Argument(..., help='要运行的Python文件，可选带:object后缀'), with_editable: Annotated[Path | None, typer.Option('--with-editable', '-e', help='包含pyproject.toml的目录，以可编辑模式安装', exists=True, file_okay=False, resolve_path=True)] = None, with_packages: Annotated[list[str], typer.Option('--with', help='要安装的附加包')] = [], inspector_version: Annotated[str | None, typer.Option('--inspector-version', help='要使用的MCP Inspector版本')] = None, ui_port: Annotated[int | None, typer.Option('--ui-port', help='MCP Inspector UI的端口')] = None, server_port: Annotated[int | None, typer.Option('--server-port', help='MCP Inspector代理服务器的端口')] = None) -> None
```

使用MCP Inspector运行MCP服务器。

### `run`

```python
run(ctx: typer.Context, server_spec: str = typer.Argument(..., help='Python文件、对象规范(file:obj)或URL'), transport: Annotated[str | None, typer.Option('--transport', '-t', help='要使用的传输协议(stdio, streamable-http, 或sse)')] = None, host: Annotated[str | None, typer.Option('--host', help='使用http传输时绑定的主机(默认: 127.0.0.1)')] = None, port: Annotated[int | None, typer.Option('--port', '-p', help='使用http传输时绑定的端口(默认: 8000)')] = None, log_level: Annotated[str | None, typer.Option('--log-level', '-l', help='日志级别(DEBUG, INFO, WARNING, ERROR, CRITICAL)')] = None) -> None
```

运行MCP服务器或连接到远程服务器。

可以通过三种方式指定服务器：

1. 模块方式：server.py - 直接运行模块，查找名为mcp/server/app的对象。

2. 导入方式：server.py:app - 导入并运行指定的服务器对象。

3. URL方式：[http://server-url](http://server-url) - 连接到远程服务器并创建代理。

注意：此命令直接运行服务器。您负责确保所有依赖项都可用。

服务器参数可以在--后传递：
fastmcp run server.py -- --config config.json --debug

### `install`

```python
install(server_spec: str = typer.Argument(..., help='要运行的Python文件，可选带:object后缀'), server_name: Annotated[str | None, typer.Option('--name', '-n', help='服务器的自定义名称(默认为服务器的name属性或文件名)')] = None, with_editable: Annotated[Path | None, typer.Option('--with-editable', '-e', help='包含pyproject.toml的目录，以可编辑模式安装', exists=True, file_okay=False, resolve_path=True)] = None, with_packages: Annotated[list[str], typer.Option('--with', help='要安装的附加包')] = [], env_vars: Annotated[list[str], typer.Option('--env-var', '-v', help='KEY=VALUE格式的环境变量')] = [], env_file: Annotated[Path | None, typer.Option('--env-file', '-f', help='从.env文件加载环境变量', exists=True, file_okay=True, dir_okay=False, resolve_path=True)] = None) -> None
```

在Claude桌面应用中安装MCP服务器。

环境变量一旦添加就会被保留，只有显式提供新值时才会更新。

### `inspect`

```python
inspect(server_spec: str = typer.Argument(..., help='要检查的Python文件，可选带:object后缀'), output: Annotated[Path, typer.Option('--output', '-o', help='JSON报告的输出文件路径(默认: server-info.json)')] = Path('server-info.json')) -> None
```

检查FastMCP服务器并生成JSON报告。

此命令分析FastMCP服务器(v1.x或v2.x)并生成全面的JSON报告，包含服务器的名称、说明、版本、工具、提示词、资源、模板和功能等信息。

示例：
```python
fastmcp inspect server.py
fastmcp inspect server.py -o report.json
fastmcp inspect server.py:mcp -o analysis.json
fastmcp inspect path/to/server.py:app -o /tmp/server-info.json
```