[​](https://gofastmcp.com/changelog#v2-8-0)

v2.8.0

2024年6月10日

## [​](https://gofastmcp.com/changelog\#v2-8-0%3A-transform-and-roll-out)  [v2.8.0: 转换与推出](https://github.com/jlowin/fastmcp/releases/tag/v2.8.0)

FastMCP 2.8.0 引入了强大的新方式来自定义和控制您的MCP服务器！

### [​](https://gofastmcp.com/changelog\#tool-transformation)  工具转换

此版本的亮点是一流的[**工具转换**](https://gofastmcp.com/patterns/tool-transformation)，这是一项新功能，可让您创建现有工具的增强变体。现在，您可以轻松重命名参数、隐藏参数、修改描述，甚至使用自定义验证或后处理逻辑包装工具——所有这些都无需重写原始代码。这使得为特定LLM用例调整通用工具或简化复杂API变得比以往更加容易。非常感谢[@strawgate](https://github.com/strawgate)的合作，从[#591](https://github.com/jlowin/fastmcp/discussions/591)和[#599](https://github.com/jlowin/fastmcp/pull/599)开始，并在离线状态下继续。

### [​](https://gofastmcp.com/changelog\#component-control)  组件控制

此版本还为您提供了对向客户端公开哪些组件的更精细控制。通过新的[**基于标签的过滤**](https://gofastmcp.com/servers/fastmcp#tag-based-filtering)，您可以根据标签选择性地启用或禁用工具、资源和提示，非常适合管理不同的环境或用户权限。作为补充，每个组件现在都支持[可编程启用或禁用](https://gofastmcp.com/servers/tools#disabling-tools)，提供对服务器功能的动态控制。

### [​](https://gofastmcp.com/changelog\#tools-by-default)  默认工具

最后，为了提高与更广泛LLM客户端的兼容性，此版本更改了OpenAPI集成的默认行为：所有API端点现在默认转换为`工具`。这是一个**突破性变化**，但实际上是必要的，因为当今可用的大多数MCP客户端遗憾地仅与MCP工具兼容。因此，此更改显著简化了开箱即用的体验，并确保您的整个API可立即被任何使用工具的代理访问。

## [​](https://gofastmcp.com/changelog\#what%E2%80%99s-changed)  变更内容

### [​](https://gofastmcp.com/changelog\#new-features-%F0%9F%8E%89)  新功能 🎉

- 一流的工具转换由[@jlowin](https://github.com/jlowin)在[#745](https://github.com/jlowin/fastmcp/pull/745)中实现
- 支持启用/禁用所有FastMCP组件（工具、提示、资源、模板）由[@jlowin](https://github.com/jlowin)在[#781](https://github.com/jlowin/fastmcp/pull/781)中实现
- 添加对基于标签的组件过滤的支持由[@jlowin](https://github.com/jlowin)在[#748](https://github.com/jlowin/fastmcp/pull/748)中实现
- 允许为OpenAPI分配标签由[@jlowin](https://github.com/jlowin)在[#791](https://github.com/jlowin/fastmcp/pull/791)中实现

### [​](https://gofastmcp.com/changelog\#enhancements-%F0%9F%94%A7)  增强功能 🔧

- 为组件创建通用基类由[@jlowin](https://github.com/jlowin)在[#776](https://github.com/jlowin/fastmcp/pull/776)中实现
- 将组件移至单独文件；添加资源由[@jlowin](https://github.com/jlowin)在[#777](https://github.com/jlowin/fastmcp/pull/777)中实现
- 使用**eq**和**repr**更新FastMCP组件由[@jlowin](https://github.com/jlowin)在[#779](https://github.com/jlowin/fastmcp/pull/779)中实现
- 删除开放式和服务器特定设置由[@jlowin](https://github.com/jlowin)在[#750](https://github.com/jlowin/fastmcp/pull/750)中实现

### [​](https://gofastmcp.com/changelog\#fixes-%F0%9F%90%9E)  修复 🐞

- 确保客户端仅初始化一次由[@jlowin](https://github.com/jlowin)在[#758](https://github.com/jlowin/fastmcp/pull/758)中实现
- 修复资源的字段验证器由[@jlowin](https://github.com/jlowin)在[#778](https://github.com/jlowin/fastmcp/pull/778)中实现
- 确保代理可以覆盖远程工具而不会回退到远程由[@jlowin](https://github.com/jlowin)在[#782](https://github.com/jlowin/fastmcp/pull/782)中实现

### [​](https://gofastmcp.com/changelog\#breaking-changes-%F0%9F%9B%AB)  突破性变化 🛫

- 将所有openapi路由视为工具由[@jlowin](https://github.com/jlowin)在[#788](https://github.com/jlowin/fastmcp/pull/788)中实现
- 修复全局OpenAPI标签的问题由[@jlowin](https://github.com/jlowin)在[#792](https://github.com/jlowin/fastmcp/pull/792)中实现

### [​](https://gofastmcp.com/changelog\#docs-%F0%9F%93%9A)  文档 📚

- 次要文档更新由[@jlowin](https://github.com/jlowin)在[#755](https://github.com/jlowin/fastmcp/pull/755)中实现
- 添加2.7更新由[@jlowin](https://github.com/jlowin)在[#756](https://github.com/jlowin/fastmcp/pull/756)中实现
- 减小2.7镜像大小由[@jlowin](https://github.com/jlowin)在[#757](https://github.com/jlowin/fastmcp/pull/757)中实现
- 更新updates.mdx由[@jlowin](https://github.com/jlowin)在[#765](https://github.com/jlowin/fastmcp/pull/765)中实现
- 默认隐藏文档侧边栏滚动条由[@jlowin](https://github.com/jlowin)在[#766](https://github.com/jlowin/fastmcp/pull/766)中实现
- 添加“停止氛围测试”到教程由[@jlowin](https://github.com/jlowin)在[#767](https://github.com/jlowin/fastmcp/pull/767)中实现
- 添加文档链接由[@jlowin](https://github.com/jlowin)在[#768](https://github.com/jlowin/fastmcp/pull/768)中实现
- 修复：更新Gemini远程客户端下的变量名由[@yrangana](https://github.com/yrangana)在[#769](https://github.com/jlowin/fastmcp/pull/769)中实现
- 恢复“默认隐藏文档侧边栏滚动条”由[@jlowin](https://github.com/jlowin)在[#770](https://github.com/jlowin/fastmcp/pull/770)中实现
- 添加更新由[@jlowin](https://github.com/jlowin)在[#773](https://github.com/jlowin/fastmcp/pull/773)中实现
- 添加教程由[@jlowin](https://github.com/jlowin)在[#783](https://github.com/jlowin/fastmcp/pull/783)中实现
- 更新LLM友好文档由[@jlowin](https://github.com/jlowin)在[#784](https://github.com/jlowin/fastmcp/pull/784)中实现
- 更新oauth.mdx由[@JeremyCraigMartinez](https://github.com/JeremyCraigMartinez)在[#787](https://github.com/jlowin/fastmcp/pull/787)中实现
- 添加变更日志由[@jlowin](https://github.com/jlowin)在[#789](https://github.com/jlowin/fastmcp/pull/789)中实现
- 添加教程由[@jlowin](https://github.com/jlowin)在[#790](https://github.com/jlowin/fastmcp/pull/790)中实现
- 添加基于标签的过滤文档由[@jlowin](https://github.com/jlowin)在[#793](https://github.com/jlowin/fastmcp/pull/793)中实现

### [​](https://gofastmcp.com/changelog\#other-changes-%F0%9F%A6%BE)  其他变更 🦾

- 创建dependabot.yml由[@jlowin](https://github.com/jlowin)在[#759](https://github.com/jlowin/fastmcp/pull/759)中实现
- 将astral-sh/setup-uv从3升级到6由[@dependabot](https://github.com/dependabot)在[#760](https://github.com/jlowin/fastmcp/pull/760)中实现
- 添加依赖项部分到发布由[@jlowin](https://github.com/jlowin)在[#761](https://github.com/jlowin/fastmcp/pull/761)中实现
- 为MCPConfig移除额外导入由[@Maanas-Verma](https://github.com/Maanas-Verma)在[#763](https://github.com/jlowin/fastmcp/pull/763)中实现
- 在发布说明中拆分增强功能由[@jlowin](https://github.com/jlowin)在[#764](https://github.com/jlowin/fastmcp/pull/764)中实现

## [​](https://gofastmcp.com/changelog\#new-contributors)  新贡献者

- [@dependabot](https://github.com/dependabot)在[#760](https://github.com/jlowin/fastmcp/pull/760)中首次贡献
- [@Maanas-Verma](https://github.com/Maanas-Verma)在[#763](https://github.com/jlowin/fastmcp/pull/763)中首次贡献
- [@JeremyCraigMartinez](https://github.com/JeremyCraigMartinez)在[#787](https://github.com/jlowin/fastmcp/pull/787)中首次贡献

**完整变更日志**：[v2.7.1…v2.8.0](https://github.com/jlowin/fastmcp/compare/v2.7.1...v2.8.0)

[​](https://gofastmcp.com/changelog#v2-7-1)

v2.7.1

2024年6月8日

## [​](https://gofastmcp.com/changelog\#v2-7-1%3A-the-bearer-necessities)  [v2.7.1: 基本认证需求](https://github.com/jlowin/fastmcp/releases/tag/v2.7.1)

此版本主要包含修复提供给FastMCP客户端的字符串令牌解析问题。

### [​](https://gofastmcp.com/changelog\#new-features-%F0%9F%8E%89-2)  新功能 🎉

- 尊重缓存设置，默认为1秒由[@jlowin](https://github.com/jlowin)在[#747](https://github.com/jlowin/fastmcp/pull/747)中实现

### [​](https://gofastmcp.com/changelog\#fixes-%F0%9F%90%9E-2)  修复 🐞

- 确保事件存储正确类型化由[@jlowin](https://github.com/jlowin)在[#753](https://github.com/jlowin/fastmcp/pull/753)中实现
- 修复将令牌字符串传递给客户端认证 & 添加认证到MCPConfig客户端由[@jlowin](https://github.com/jlowin)在[#754](https://github.com/jlowin/fastmcp/pull/754)中实现

### [​](https://gofastmcp.com/changelog\#docs-%F0%9F%93%9A-2)  文档 📚

- 文档：修复Gemini示例中的client为mcp\_client由[@yrangana](https://github.com/yrangana)在[#734](https://github.com/jlowin/fastmcp/pull/734)中实现
- 更新添加工具文档字符串由[@strawgate](https://github.com/strawgate)在[#739](https://github.com/jlowin/fastmcp/pull/739)中实现
- 修复贡献链接由[@richardkmichael](https://github.com/richardkmichael)在[#749](https://github.com/jlowin/fastmcp/pull/749)中实现

### [​](https://gofastmcp.com/changelog\#other-changes-%F0%9F%A6%BE-2)  其他变更 🦾

- 将Pydantic默认值切换为kwargs由[@strawgate](https://github.com/strawgate)在[#731](https://github.com/jlowin/fastmcp/pull/731)中实现
- 修复CLI模块中的拼写错误由[@wfclark5](https://github.com/wfclark5)在[#737](https://github.com/jlowin/fastmcp/pull/737)中实现
-  chore: 修复提示文档字符串由[@danb27](https://github.com/danb27)在[#752](https://github.com/jlowin/fastmcp/pull/752)中实现
- 添加accept到排除的头信息由[@jlowin](https://github.com/jlowin)在[#751](https://github.com/jlowin/fastmcp/pull/751)中实现

### [​](https://gofastmcp.com/changelog\#new-contributors-2)  新贡献者

- [@wfclark5](https://github.com/wfclark5)在[#737](https://github.com/jlowin/fastmcp/pull/737)中首次贡献
- [@richardkmichael](https://github.com/richardkmichael)在[#749](https://github.com/jlowin/fastmcp/pull/749)中首次贡献
- [@danb27](https://github.com/danb27)在[#752](https://github.com/jlowin/fastmcp/pull/752)中首次贡献

**完整变更日志**：[v2.7.0…v2.7.1](https://github.com/jlowin/fastmcp/compare/v2.7.0...v2.7.1)

[​](https://gofastmcp.com/changelog#v2-7-0)

v2.7.0

2024年6月5日

## [​](https://gofastmcp.com/changelog\#v2-7-0%3A-pare-programming)  [v2.7.0: 精简编程](https://github.com/jlowin/fastmcp/releases/tag/v2.7.0)

这主要是一个清理版本，用于删除或弃用自v1以来积累的冗余代码。主要是，此版本重构了FastMCP的内部结构，为下几个主要版本中计划的功能做准备。但请注意，因此，此版本有一些小的突破性变化（这就是为什么根据仓库指南，它是2.7，而不是2.6.2），尽管不是核心用户面临的API。

### [​](https://gofastmcp.com/changelog\#breaking-changes-%F0%9F%9B%AB-2)  突破性变化 🛫

- 装饰器返回它们创建的对象，而不是被装饰的函数
- websockets是可选依赖项
- 服务器上用于自动将函数转换为工具/资源/提示的方法已被弃用，转而直接使用装饰器

### [​](https://gofastmcp.com/changelog\#new-features-%F0%9F%8E%89-3)  新功能 🎉

- 允许向服务器传递标志由[@zzstoatzz](https://github.com/zzstoatzz)在[#690](https://github.com/jlowin/fastmcp/pull/690)中实现
- 将指向\`#/components/schemas/\`的引用替换为\`#/defs/\`由[@phateffect](https://github.com/phateffect)在[#697](https://github.com/jlowin/fastmcp/pull/697)中实现
- 将Tool拆分为Tool和FunctionTool由[@jlowin](https://github.com/jlowin)在[#700](https://github.com/jlowin/fastmcp/pull/700)中实现
- 对Prompt使用严格的basemodel；放宽from\_function弃用由[@jlowin](https://github.com/jlowin)在[#701](https://github.com/jlowin/fastmcp/pull/701)中实现
- 正式确定resource/functionresource关系由[@jlowin](https://github.com/jlowin)在[#702](https://github.com/jlowin/fastmcp/pull/702)中实现
- 正式确定template/functiontemplate拆分由[@jlowin](https://github.com/jlowin)在[#703](https://github.com/jlowin/fastmcp/pull/703)中实现
- 支持灵活的@tool装饰器调用模式由[@jlowin](https://github.com/jlowin)在[#706](https://github.com/jlowin/fastmcp/pull/706)中实现
- 确保弃用警告的stacklevel=2由[@jlowin](https://github.com/jlowin)在[#710](https://github.com/jlowin/fastmcp/pull/710)中实现
- 允许裸提示装饰器由[@jlowin](https://github.com/jlowin)在[#711](https://github.com/jlowin/fastmcp/pull/711)中实现

### [​](https://gofastmcp.com/changelog\#fixes-%F0%9F%90%9E-3)  修复 🐞

- 工具内容转换的更新/修复由[@strawgate](https://github.com/strawgate)在[#642](https://github.com/jlowin/fastmcp/pull/642)中实现
- 修复pr标签器权限由[@jlowin](https://github.com/jlowin)在[#708](https://github.com/jlowin/fastmcp/pull/708)中实现
- 删除-n auto由[@jlowin](https://github.com/jlowin)在[#709](https://github.com/jlowin/fastmcp/pull/709)中实现
- 修复README.md中的链接由[@alainivars](https://github.com/alainivars)在[#723](https://github.com/jlowin/fastmcp/pull/723)中实现

令人高兴的是，此版本确实允许使用“裸”装饰器以符合Python实践：

```
@mcp.tool
def my_tool():
    ...

```

**完整变更日志**：[v2.6.2…v2.7.0](https://github.com/jlowin/fastmcp/compare/v2.6.2...v2.7.0)

[​](https://gofastmcp.com/changelog#v2-6-1)

v2.6.1

2024年6月3日

## [​](https://gofastmcp.com/changelog\#v2-6-1%3A-blast-auth-second-ignition)  [v2.6.1: 快速认证（二次点火）](https://github.com/jlowin/fastmcp/releases/tag/v2.6.1)

这是一个补丁版本，用于在#686中恢复py.typed。

### [​](https://gofastmcp.com/changelog\#docs-%F0%9F%93%9A-3)  文档 📚

- 更新readme由[@jlowin](https://github.com/jlowin)在[#679](https://github.com/jlowin/fastmcp/pull/679)中实现
- 添加gemini教程由[@jlowin](https://github.com/jlowin)在[#680](https://github.com/jlowin/fastmcp/pull/680)中实现
- 修复：修复CLI文档的路径错误由[@yrangana](https://github.com/yrangana)在[#684](https://github.com/jlowin/fastmcp/pull/684)中实现
- 更新认证文档由[@jlowin](https://github.com/jlowin)在[#687](https://github.com/jlowin/fastmcp/pull/687)中实现

### [​](https://gofastmcp.com/changelog\#other-changes-%F0%9F%A6%BE-3)  其他变更 🦾

- 删除弃用通知由[@jlowin](https://github.com/jlowin)在[#677](https://github.com/jlowin/fastmcp/pull/677)中实现
- 删除server.py由[@jlowin](https://github.com/jlowin)在[#681](https://github.com/jlowin/fastmcp/pull/681)中实现
- 恢复py.typed由[@jlowin](https://github.com/jlowin)在[#686](https://github.com/jlowin/fastmcp/pull/686)中实现

### [​](https://gofastmcp.com/changelog\#new-contributors-3)  新贡献者

- [@yrangana](https://github.com/yrangana)在[#684](https://github.com/jlowin/fastmcp/pull/684)中首次贡献

**完整变更日志**：[v2.6.0…v2.6.1](https://github.com/jlowin/fastmcp/compare/v2.6.0...v2.6.1)

[​](https://gofastmcp.com/changelog#v2-6-0)

v2.6.0

2024年6月2日

## [​](https://gofastmcp.com/changelog\#v2-6-0%3A-blast-auth)  [v2.6.0: 快速认证](https://github.com/jlowin/fastmcp/releases/tag/v2.6.0)

### [​](https://gofastmcp.com/changelog\#new-features-%F0%9F%8E%89-4)  新功能 🎉

- 引入MCP客户端oauth流程由[@jlowin](https://github.com/jlowin)在[#478](https://github.com/jlowin/fastmcp/pull/478)中实现
- 支持在初始化时提供工具由[@jlowin](https://github.com/jlowin)在[#647](https://github.com/jlowin/fastmcp/pull/647)中实现
- 简化测试期间在进程中运行服务器的代码由[@jlowin](https://github.com/jlowin)在[#649](https://github.com/jlowin/fastmcp/pull/649)中实现
- 为服务器和客户端添加基本的bearer认证由[@jlowin](https://github.com/jlowin)在[#650](https://github.com/jlowin/fastmcp/pull/650)中实现
- 支持从环境变量配置bearer认证由[@jlowin](https://github.com/jlowin)在[#652](https://github.com/jlowin/fastmcp/pull/652)中实现
- feat(tool): 添加支持从工具定义中排除参数由[@deepak-stratforge](https://github.com/deepak-stratforge)在[#626](https://github.com/jlowin/fastmcp/pull/626)中实现
- 添加服务器+客户端认证文档由[@jlowin](https://github.com/jlowin)在[#655](https://github.com/jlowin/fastmcp/pull/655)中实现

### [​](https://gofastmcp.com/changelog\#fixes-%F0%9F%90%9E-4)  修复 🐞

- fix: 支持FastMcpProxy（和Client）中的并发由[@Sillocan](https://github.com/Sillocan)在[#635](https://github.com/jlowin/fastmcp/pull/635)中实现
- 确保Client.close()适当地清理客户端上下文由[@jlowin](https://github.com/jlowin)在[#643](https://github.com/jlowin/fastmcp/pull/643)中实现
- 更新client.mdx: ClientError命名空间由[@mjkaye](https://github.com/mjkaye)在[#657](https://github.com/jlowin/fastmcp/pull/657)中实现

### [​](https://gofastmcp.com/changelog\#docs-%F0%9F%93%9A-4)  文档 📚

- 使FastMCPTransport支持模拟Streamable HTTP传输（不起作用）由[@jlowin](https://github.com/jlowin)在[#645](https://github.com/jlowin/fastmcp/pull/645)中实现
- 文档exclude\_args由[@jlowin](https://github.com/jlowin)在[#653](https://github.com/jlowin/fastmcp/pull/653)中实现
- 更新欢迎页面由[@jlowin](https://github.com/jlowin)在[#673](https://github.com/jlowin/fastmcp/pull/673)中实现
- 添加Anthropic + Claude桌面集成指南由[@jlowin](https://github.com/jlowin)在[#674](https://github.com/jlowin/fastmcp/pull/674)中实现
- 次要文档设计更新由[@jlowin](https://github.com/jlowin)在[#676](https://github.com/jlowin/fastmcp/pull/676)中实现

### [​](https://gofastmcp.com/changelog\#other-changes-%F0%9F%A6%BE-4)  其他变更 🦾

- 更新测试类型由[@jlowin](https://github.com/jlowin)在[#646](https://github.com/jlowin/fastmcp/pull/646)中实现
- 添加OpenAI集成文档由[@jlowin](https://github.com/jlowin)在[#660](https://github.com/jlowin/fastmcp/pull/660)中实现

### [​](https://gofastmcp.com/changelog\#new-contributors-4)  新贡献者

- [@Sillocan](https://github.com/Sillocan)在[#635](https://github.com/jlowin/fastmcp/pull/635)中首次贡献
- [@deepak-stratforge](https://github.com/deepak-stratforge)在[#626](https://github.com/jlowin/fastmcp/pull/626)中首次贡献
- [@mjkaye](https://github.com/mjkaye)在[#657](https://github.com/jlowin/fastmcp/pull/657)中首次贡献

**完整变更日志**：[v2.5.2…v2.6.0](https://github.com/jlowin/fastmcp/compare/v2.5.2...v2.6.0)

[​](https://gofastmcp.com/changelog#v2-5-2)

v2.5.2

2024年5月29日

## [​](https://gofastmcp.com/changelog\#v2-5-2%3A-stayin%E2%80%99-alive)  [v2.5.2: 保持活跃](https://github.com/jlowin/fastmcp/releases/tag/v2.5.2)

### [​](https://gofastmcp.com/changelog\#new-features-%F0%9F%8E%89-5)  新功能 🎉

- 添加优雅的错误处理...