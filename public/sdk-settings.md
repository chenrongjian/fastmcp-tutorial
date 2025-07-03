# 设置

# `fastmcp.settings`

## 类

### `ExtendedEnvSettingsSource`

一个特殊的环境设置源，允许使用多个环境变量前缀。
如果使用旧的`FASTMCP_SERVER_`前缀，会引发弃用警告。

**方法：**

#### `get_field_value`

```python
get_field_value(self, field: FieldInfo, field_name: str) -> tuple[Any, str, bool]
```

### `ExtendedSettingsConfigDict`

### `Settings`

FastMCP设置类。

**方法：**

#### `settings_customise_sources`

```python
settings_customise_sources(cls, settings_cls: type[BaseSettings], init_settings: PydanticBaseSettingsSource, env_settings: PydanticBaseSettingsSource, dotenv_settings: PydanticBaseSettingsSource, file_secret_settings: PydanticBaseSettingsSource) -> tuple[PydanticBaseSettingsSource, ...]
```

#### `settings`

```python
settings(self) -> Self
```

此属性用于与FastMCP < 2.8.0版本向后兼容，该版本通过fastmcp.settings.settings访问设置。

#### `setup_logging`

```python
setup_logging(self) -> Self
```

完成设置的初始化。