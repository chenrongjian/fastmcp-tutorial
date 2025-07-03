# sampling

# `fastmcp.client.sampling`

FastMCP客户端采样工具，用于配置和管理请求采样策略。

## 类

### `SamplingConfig`

采样配置类，定义请求采样的规则和参数。

**参数：**
- `sample_rate`: 采样率（0.0-1.0，默认为1.0，表示100%采样）
- `sampler_type`: 采样器类型（'random'或' deterministic'，默认为'random'）
- `seed`: 随机数种子（用于确定性采样）

**方法：**

#### `should_sample`

```python
should_sample(self, request_id: str | None = None) -> bool
```

决定是否对当前请求进行采样。

**参数：**
- `request_id`: 请求ID（用于确定性采样）

**返回：**
- 是否采样的布尔值

### `SamplingMiddleware`

采样中间件，用于在请求流程中应用采样策略。

**参数：**
- `config`: SamplingConfig实例

**方法：**

#### `__call__`

```python
__call__(self, request: dict) -> dict
```

处理请求并应用采样策略，添加采样标记到请求头。

**参数：**
- `request`: MCP请求字典

**返回：**
- 添加采样信息后的请求字典