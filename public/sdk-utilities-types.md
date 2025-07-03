# fastmcp.utilities.types

## 枚举

### `LogLevel`

日志级别枚举，定义了不同的日志严重程度。

**成员：**
- `DEBUG`: 调试信息，用于开发和问题诊断
- `INFO`: 一般信息，记录正常操作
- `WARNING`: 警告信息，表示潜在问题
- `ERROR`: 错误信息，表示操作失败但不影响系统运行
- `CRITICAL`: 严重错误信息，表示系统可能无法继续运行

### `MCPComponentType`

MCP组件类型枚举，标识不同类型的MCP组件。

**成员：**
- `TOOL`: 工具组件
- `RESOURCE`: 资源组件
- `RESOURCE_TEMPLATE`: 资源模板组件
- `PROMPT`: 提示词组件

## 类型别名

### `JSONValue`

```python
JSONValue = Union[str, int, float, bool, None, dict[str, 'JSONValue'], list['JSONValue']]
```

JSON兼容值的类型别名。

### `MCPConfigDict`

```python
MCPConfigDict = dict[str, JSONValue]
```

MCP配置字典的类型别名。

### `ComponentKey`

```python
ComponentKey = str
```

组件键的类型别名，用于标识组件。

## 数据类

### `ComponentMetadata`

组件元数据的数据类，包含组件的基本信息。

**属性：**
- `name`: 组件名称
- `type`: 组件类型（MCPComponentType）
- `description`: 组件描述
- `version`: 组件版本
- `author`: 组件作者
- `tags`: 组件标签列表

### `ServerInfo`

服务器信息的数据类，包含服务器的基本信息。

**属性：**
- `name`: 服务器名称
- `version`: 服务器版本
- `transport`: 传输协议类型
- `components`: 可用组件数量统计
- `uptime`: 服务器运行时间（秒）

## 抽象基类

### `MCPComponentProtocol`

MCP组件的抽象基类协议，定义了所有组件应实现的基本接口。

**方法：**

#### `key`

```python
@property
def key(self) -> ComponentKey
```

返回组件的唯一键。

#### `metadata`

```python
@property
def metadata(self) -> ComponentMetadata
```

返回组件的元数据。

#### `is_enabled`

```python
@property
def is_enabled(self) -> bool
```

返回组件是否启用。