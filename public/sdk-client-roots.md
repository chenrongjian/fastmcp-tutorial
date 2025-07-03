# roots

# `fastmcp.client.roots`

FastMCP客户端根证书管理工具，用于处理SSL/TLS连接的根证书验证。

## 函数

### `get_system_root_certs`

```python
get_system_root_certs() -> list[str]
```

获取系统信任的根证书列表。

**返回：**
- 包含PEM格式根证书的字符串列表

### `add_custom_root_cert`

```python
add_custom_root_cert(cert_path: str) -> None
```

添加自定义根证书到客户端信任列表。

**参数：**
- `cert_path`: PEM格式证书文件路径

### `get_trusted_roots`

```python
get_trusted_roots() -> list[str]
```

获取客户端信任的所有根证书（系统根证书+自定义根证书）。

**返回：**
- 包含所有信任根证书的PEM格式字符串列表

### `clear_custom_roots`

```python
clear_custom_roots() -> None
```

清除所有添加的自定义根证书。