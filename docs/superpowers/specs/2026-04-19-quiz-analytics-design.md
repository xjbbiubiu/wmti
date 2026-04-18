# 测试数据分析埋点设计方案

## Context

现有 `page_views` 表已有 `POST /api/analytics/track` 埋点基础设施，只需扩展地域字段，并在用户查看测试结果时上报一个 `result_submitted` 事件即可。

## 改动

### 1. `page_views` 表新增字段

ALTER TABLE 添加：

| 字段 | 类型 | 说明 |
|------|------|------|
| country | VARCHAR(64) | 国家 |
| province | VARCHAR(64) | 省份/州 |
| city | VARCHAR(64) | 城市 |

地域解析使用离线库 `ip2region`，无需外部 API。

### 2. `backend/src/middleware/analytics.js`

- `parseIP(ip)` 函数：用 `ip2region` 离线库解析 IP，返回 `{ country, province, city }`
- `trackEvent` 中增加 country/province/city 字段写入
- App 启动时执行 ALTER TABLE 确保字段存在（幂等）

### 3. `backend/src/routes/results.js`

- WMTI 测试结果提交成功后，调用 `trackEvent` 上报 `result_submitted` 事件
- event_type = `result_submitted`，quiz_type = `wmti`，quiz_type_code = 类型代码

### 4. `backend/src/routes/earResults.js`

- 同上，空耳测试结果提交时上报 `result_submitted` 事件

## 前端改动

无需改动。前端已有 `/api/analytics/track` 调用，只需在结果页渲染时触发一次上报（可能已实现）。

## 查询示例

```sql
-- 各结果的提交次数分布
SELECT quiz_type, quiz_type_code, COUNT(*) as cnt
FROM page_views
WHERE event_type = 'result_submitted'
GROUP BY quiz_type, quiz_type_code
ORDER BY cnt DESC;

-- 每日趋势
SELECT DATE(created_at) as date, quiz_type, COUNT(*) as cnt
FROM page_views
WHERE event_type = 'result_submitted'
GROUP BY DATE(created_at), quiz_type
ORDER BY date DESC;

-- 按设备分布
SELECT quiz_type, device_type, COUNT(*) as cnt
FROM page_views
WHERE event_type = 'result_submitted'
GROUP BY quiz_type, device_type;

-- 按地域分布（国家）
SELECT quiz_type, country, COUNT(*) as cnt
FROM page_views
WHERE event_type = 'result_submitted'
GROUP BY quiz_type, country
ORDER BY cnt DESC
LIMIT 20;

-- 重复提交 IP
SELECT ip, quiz_type, COUNT(*) as cnt, MAX(created_at) as last_at
FROM page_views
WHERE event_type = 'result_submitted'
GROUP BY ip, quiz_type
HAVING cnt > 3
ORDER BY cnt DESC;
```

## 验证

1. 启动后端，确认 ALTER TABLE 执行无报错
2. 完成一次 WMTI 测试并查看结果
3. MySQL 查询确认 `page_views` 有 `event_type = 'result_submitted'` 记录
4. country/province/city 字段有值
