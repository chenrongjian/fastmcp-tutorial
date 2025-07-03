# oauth_callback

# `fastmcp.client.oauth_callback`

OAuth回调处理工具，用于接收和处理OAuth授权服务器返回的授权码。

## 函数

### `handle_oauth_callback`

```python
handle_oauth_callback(request: dict) -> tuple[str, str | None]
```

处理OAuth回调请求，提取授权码和状态参数。

**参数：**
- `request`: 包含回调参数的请求字典

**返回：**
- 包含(authorization_code, state)的元组

### `parse_callback_query`

```python
parse_callback_query(query_string: str) -> dict[str, str]
```

解析回调URL中的查询字符串参数。

**参数：**
- `query_string`: URL查询字符串部分

**返回：**
- 解析后的参数字典

### `validate_callback_state`

```python
validate_callback_state(received_state: str, expected_state: str) -> bool
```

验证回调中的state参数是否与请求时一致，防止CSRF攻击。

**参数：**
- `received_state`: 回调中接收的state值
- `expected_state`: 请求时生成的预期state值

**返回：**
- 验证结果（True表示验证通过）