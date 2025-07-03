# run

# `fastmcp.cli.run`

FastMCP运行命令实现。

## 函数

### `is_url`

```python
is_url(path: str) -> bool
```

检查字符串是否为URL。

### `parse_file_path`

```python
parse_file_path(server_spec: str) -> tuple[Path, str | None]
```

解析可能包含服务器对象规范的文件路径。

**参数：**

* `server_spec`：文件路径，可选带:object后缀

**返回：**

* (file_path, server_object)的元组

### `import_server`

```python
import_server(file: Path, server_object: str | None = None) -> Any
```

从文件导入MCP服务器。

**参数：**

* `file`：文件路径
* `server_object`：可选的对象名称，格式为"module:object"或仅"object"

**返回：**

* 服务器对象

### `create_client_server`

```python
create_client_server(url: str) -> Any
```

从客户端URL创建FastMCP服务器。

**参数：**

* `url`：要连接的URL

**返回：**

* FastMCP服务器实例

### `import_server_with_args`

```python
import_server_with_args(file: Path, server_object: str | None = None, server_args: list[str] | None = None) -> Any
```

使用可选的命令行参数导入服务器。

**参数：**

* `file`：服务器文件路径
* `server_object`：可选的服务器对象名称
* `server_args`：可选的要注入的命令行参数

**返回：**

* 导入的服务器对象

### `run_command`

```python
run_command(server_spec: str, transport: str | None = None, host: str | None = None, port: int | None = None, log_level: str | None = None, server_args: list[str] | None = None) -> None
```

运行MCP服务器或连接到远程服务器。

**参数：**

* `server_spec`：Python文件、对象规范(file:obj)或URL
* `transport`：要使用的传输协议
* `host`：使用http传输时绑定的主机
* `port`：使用http传输时绑定的端口
* `log_level`：日志级别
* `server_args`：要传递给服务器的附加参数