# claude

# `fastmcp.cli.claude`

Claude应用集成工具。

## 函数

### `get_claude_config_path`

```python
get_claude_config_path() -> Path | None
```

根据平台获取Claude配置目录。

### `update_claude_config`

```python
update_claude_config(file_spec: str, server_name: str) -> bool
```

在Claude的配置中添加或更新FastMCP服务器。

**参数：**

* `file_spec`：服务器文件路径，可选带:object后缀
* `server_name`：服务器在Claude配置中的名称
* `with_editable`：可选的可编辑安装目录
* `with_packages`：可选的附加安装包列表
* `env_vars`：可选的环境变量字典。这些变量将与现有变量合并，新值优先。

**引发：**

* `RuntimeError`：如果未找到Claude Desktop的配置目录，表示Claude Desktop可能未安装或未正确设置。