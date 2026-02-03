-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- 操作日志表
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id),
  action_type VARCHAR(50),
  target_id UUID,
  details TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 启用RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 创建策略（暂时允许公开读写以便初始化，生产环境需严格限制）
CREATE POLICY "允许公开访问管理员表" ON admins FOR ALL USING (true);
CREATE POLICY "允许公开访问日志表" ON admin_logs FOR ALL USING (true);

-- 插入默认管理员 (密码: admin123)
-- 注意：实际生产中不应在SQL中明文插入哈希，这里仅为演示方便
-- $2a$10$X/q.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z.Z = admin123 (示例hash)
-- 为了安全，我们将在后端通过API初始化第一个管理员，或者手动插入
