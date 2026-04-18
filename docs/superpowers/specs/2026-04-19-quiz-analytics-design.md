# 测试数据分析埋点设计方案

## Context

当前测试结果只存在 JSON 文件中，无法做数据分析和统计。需要增加 MySQL 日志表，在用户提交测试结果时记录一条原始日志，后续通过 SQL 聚合查询支持多维度分析（地域、设备、IP 频次、时间趋势等）。

## 数据库表

### `quiz_submission_logs`

每次提交测试结果时写入一条记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT AUTO_INCREMENT | 主键 |
| quiz_type | VARCHAR(32) | 测试类型，wmti / ear |
| type_code | VARCHAR(64) | 结果代码，如 W3M2L1 或空耳等级 |
| total_score | INT | 总分 |
| ip | VARCHAR(45) | 用户 IP（支持 IPv6） |
| device_type | VARCHAR(32) | mobile / tablet / desktop |
| browser | VARCHAR(128) | 浏览器名称 |
| os | VARCHAR(64) | 操作系统 |
| country | VARCHAR(64) | 国家 |
| province | VARCHAR(64) | 省份/州 |
| city | VARCHAR(64) | 城市 |
| submitted_at | DATETIME | 提交时间 |

IP 地域解析使用离线库 `ip2region`，无需外部 API。

## 改动文件

### `backend/src/middleware/analytics.js`

- 初始化 MySQL 连接池
- App 启动时自动创建 `quiz_submission_logs` 表（如不存在）
- 导出 IP 地域解析函数 `parseIP(ip)`

### `backend/src/routes/results.js`

- WMTI 测试结果提交成功后，写入一条 `quiz_submission_logs`
- 从 `req.ip` / `req.headers['user-agent']` 获取 IP 和 UA
- 从 UA 解析 device_type、browser、os
- 从 `ip2region` 解析 country、province、city

### `backend/src/routes/earResults.js`

- 空耳测试结果提交成功后，同上逻辑写入一条日志

## 查询示例（数据分析师可直接执行）

```sql
-- 各结果的提交次数分布
SELECT quiz_type, type_code, COUNT(*) as cnt
FROM quiz_submission_logs
GROUP BY quiz_type, type_code
ORDER BY cnt DESC;

-- 每日提交趋势
SELECT DATE(submitted_at) as date, quiz_type, COUNT(*) as cnt
FROM quiz_submission_logs
GROUP BY DATE(submitted_at), quiz_type
ORDER BY date DESC;

-- 按设备类型分布
SELECT quiz_type, device_type, COUNT(*) as cnt
FROM quiz_submission_logs
GROUP BY quiz_type, device_type;

-- 按地域分布（国家）
SELECT quiz_type, country, COUNT(*) as cnt
FROM quiz_submission_logs
GROUP BY quiz_type, country
ORDER BY cnt DESC
LIMIT 20;

-- 重复提交 IP（防刷）
SELECT ip, quiz_type, COUNT(*) as cnt, MAX(submitted_at) as last_at
FROM quiz_submission_logs
GROUP BY ip, quiz_type
HAVING cnt > 3
ORDER BY cnt DESC;
```

## 验证方式

1. 本地启动后端：`cd backend && npm start`
2. 完成一次 WMTI 测试，查看结果
3. 登录 MySQL 确认 `quiz_submission_logs` 表有数据
4. 执行上述 SQL 验证查询结果正确
