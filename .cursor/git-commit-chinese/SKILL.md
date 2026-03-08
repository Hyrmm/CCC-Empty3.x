---
name: git-commit-chinese
description: 执行 git 提交的完整流程：检查变更、生成中文 Conventional Commits 格式提交信息、处理预提交钩子错误。当用户说"git 提交"、"提交"、"commit" 时使用此 skill。
---

# Git 提交（中文）

## 执行步骤

### 第零步：远端同步门禁（必须先执行）

按顺序执行以下检查：

```bash
git fetch --prune
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

- 若当前分支未配置上游分支（第二条命令失败），跳过远端同步检查，继续后续步骤。
- 若已配置上游分支，继续判断远端是否有新提交：

```bash
git rev-list --count HEAD..@{u}
```

- 返回 `0`：远端无新提交，继续后续步骤。
- 返回 `>0`：先执行拉取：

```bash
git pull --rebase
```

- 若拉取失败（冲突、网络或权限问题），立即终止后续所有操作，并告知用户手动处理后再继续。

### 第一步：收集信息（并行执行）

同时运行以下三条命令：

```bash
git status
git diff HEAD      # 包含已暂存和未暂存的所有变更
git log --oneline -5
```

### 第二步：分析变更，起草提交信息

按照 **Conventional Commits** 格式，主标题英文 type，正文中文：

```
<type>(<scope>): <中文简短描述>

<可选：中文补充说明，一两句，解释"为什么"而不是"做了什么">
```

**type 选择规则：**

| type | 场景 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（不改变行为） |
| `perf` | 性能优化 |
| `chore` | 构建/工具/依赖变更 |
| `docs` | 文档变更 |
| `test` | 测试相关 |

**scope** 取改动最集中的模块名，如 `cpgame`、`voiceroom`、`model`。改动分散时可省略。

### 第三步：暂存并提交

```bash
git add -A
git commit -m "$(cat <<'EOF'
<主标题>

<可选正文>
EOF
)"
```

### 第四步：处理预提交钩子错误

若提交失败（exit code 非 0），按以下优先级处理：

1. **TypeScript 编译错误**（`tsc --noEmit` 失败）
   - 定位报错文件和行号
   - 修复类型错误（常见：隐式 `any`、方法不存在、返回值类型不匹配）
   - 用 `git add` 暂存修复文件后**重新提交**（新 commit，不要 amend）

2. **ESLint 错误**
   - 优先看是否可自动修复（钩子通常已执行 `eslint --fix`）
   - 若还有残留错误，手动修复后重新提交

3. **其他错误**
   - 读取完整错误信息，针对性修复

> 注意：`.lock` 文件警告（`git gc` 相关）可忽略，不影响提交成功。

## 注意事项

- 提交信息聚焦"为什么"，避免逐行描述"做了什么"
- 若变更跨越多个不相关功能，询问用户是否拆分提交
- 不主动 push，除非用户明确要求
