# progress

# `fastmcp.client.progress`

FastMCP客户端进度跟踪工具，用于监控长时间运行的操作进度。

## 类

### `ProgressTracker`

进度跟踪器，用于记录和报告操作进度。

**参数：**
- `total`: 总进度量（默认为100）
- `unit`: 进度单位（如"步骤"、"字节"等）
- `description`: 操作描述

**方法：**

#### `__init__`

```python
__init__(self, total: int = 100, unit: str = 'unit', description: str = '')
```

初始化进度跟踪器。

#### `update`

```python
update(self, current: int, message: str | None = None) -> None
```

更新当前进度。

**参数：**
- `current`: 当前进度值
- `message`: 可选的进度消息

#### `get_progress`

```python
get_progress(self) -> dict[str, Any]
```

获取当前进度信息。

**返回：**
- 包含当前进度、总进度、百分比和消息的字典

#### `reset`

```python
reset(self) -> None
```

重置进度跟踪器到初始状态。