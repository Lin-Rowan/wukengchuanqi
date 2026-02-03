-- 无坑传奇数据库初始化脚本
-- 在Supabase SQL Editor中执行此脚本

-- 网站设置表
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(50) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT now()
);

-- 轮播图表
CREATE TABLE IF NOT EXISTS carousel_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  badge VARCHAR(50),
  description TEXT,
  refund_policy TEXT,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- 竖图卡片表
CREATE TABLE IF NOT EXISTS action_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  action_type VARCHAR(20) NOT NULL,
  action_value TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- 游戏版本表
CREATE TABLE IF NOT EXISTS game_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  rhythm TEXT,
  type TEXT,
  engine TEXT,
  description TEXT,
  score INT DEFAULT 0,
  appointment_count INT DEFAULT 0,
  launcher_url TEXT,
  web_game_url TEXT,
  intro_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- 预约记录表
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game_versions(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL,
  created_at DATE DEFAULT CURRENT_DATE,
  UNIQUE(game_id, ip_address, created_at)
);

-- 投诉建议表
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  contact_info VARCHAR(100),
  ip_address VARCHAR(45),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- 导航链接表
CREATE TABLE IF NOT EXISTS nav_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(50) NOT NULL,
  action_type VARCHAR(20) NOT NULL,
  action_value TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 插入初始数据

-- 初始化顶图设置
INSERT INTO site_settings (key, value) VALUES 
('hero_bg_url', '"https://lh3.googleusercontent.com/aida-public/AB6AXuA3PhZHC2D3aS6wyl0C_Zhahs78Z3Dqa8cipCqegdH8AXriV39tZr3PUAl40XQfD_tnZCi4t-_9rLxvY_-RBc8d_E2a9WR-k99Tz6sHlnvGH0hMhiOLslNpBUS7Wbva3VY2yWdGV4WBvCWqKb5SMjPMrOxRt0JavNoX_Ae84Z-M6ntQlmHpUEworgBMPzwUCX3VzbF1lZbbwdTbA55F9QubN8yBTNkgLtLTZzcqHtZ9fVt_8Q9oCfyH3Eqwqj0JHLEri66MwoPESDE"'),
('hero_sword_url', '"https://lh3.googleusercontent.com/aida-public/AB6AXuBVYr0NeSeCdGFFPIHsQHovnnQJXgXGLtJQqahg8AHwTKog14YIIQCczELg9rXR4D7bEvO_ZILx5zm_5ehVBQZvOp-HeXFxb3faVrMo8PR5T7Vd1f83ZuuM75duWnI3m1C9HgwY62U1mgATVZqKMhlTcYuqc0SBPeKfksWXU1tb8CTC2ieiLobcXm2pIDe5nT7FZJzh0Gve60m7dEEGvba24ZI_w6KtJA79OYrCQ1sl7l5Jflrx6wS8oQIk9vBpW85LpKjS_GhisA0"')
ON CONFLICT (key) DO NOTHING;

-- 初始化轮播图
INSERT INTO carousel_slides (title, badge, description, refund_policy, image_url, sort_order) VALUES 
('包好玩，不好玩全额退款', '[20严选总站]', '严选市场上最好玩的各类版本，经反复修改，确保好玩才上线，彻底解决玩家找服难的痛点。所有版本测试区免费领顶赞试玩，正式区充值2个小时内，任意原因觉得不好玩，联系客服直接全额退款。中后期万一感觉不好玩，随时反馈给客服，1小时内找技术团队修改调整，为了确保好玩，我们什么都愿意改。', '「退款流程：联系客服直接提供充值截图即可办理，30分钟内极速退款。」', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbtf2ucVX_MTuAt_LA1k7F99hKDKyYRV6D1wKtT4kAeZ0i1aPeaHqTxG8H7SXT05efgpOYNYD65Pl-p6EzhmJEsqFRC6GxlVhBnlJbmMosF9YO0VZIWnd97H7mM4xPKsMIJ8mSC3Hi6BnP3upRLhFgvYbkyCSJPqD-RIU78FT45JUN6xGL4OPcvrXFynbC41dXBCeMczuCMePZ4v0YdUxvRp1S-eKZwoNDI9uvSSjIb5YlNTB5funx5ESD9MX4E7D_mIiYT-H3jlk', 1),
('公平透明，绝无暗坑', '[诚信运营]', '我们深知玩家最痛恨的就是托和内服。在20严选，每一个版本都经过严格的人工审核，确保数据全透明、几率真实可靠。无论是散人玩家还是大R用户，都能在公平的环境下享受真正的传奇乐趣。我们拒绝任何破坏平衡的行为，只为打造一片纯净的游戏净土。', '「公平承诺：如发现任何管理参与游戏或特殊待遇，举报核实奖励万元。」', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsGwKUZ3rvRNweXpHJb1DVosdMX4vG4vPRLFqYRm2egLoH2a4ZF2aZGJnLU6H3bfI7lSLOjy46Lo4RkXcBiVCn-EXxmE_fiNF9Wx_RsPA1nuoHZXrLOywL4UhwMwFf73TZhs-FRU2BNi8scHyIPRMPR3txlfZkAZL-vJOLPvsvsMaAYV0AP84ZqeaXmNXS7tEd2M5wvfOGev-NxvtZxKLB1EkUswElu0HlmALd1mivZYOJ7_wFrge0N5ZuRKtmJaBaR58o5r_p-S8', 2),
('精品版本，长久稳定', '[严选佳作]', '不做快餐，只做精品。每一个入选版本都具备极高的耐玩性和深度的内容迭代。从怀旧复古到创新沉默，我们不仅关注开区时的热度，更关注合区后的激情。专业的技术团队24小时待命，确保服务器永不卡顿，让你的每一份努力都能在长久的岁月中熠熠生辉。', '「稳定保障：服务器如遇非维护性宕机，全服玩家领取高额补偿礼包。」', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvc6O1B_AQQQ8o_mjaFZQXvMXbAjlShYJxxeTehAf5oeZlNpF7aRcN0rv_L_HCSbHgn9esd0VIO-tU8DzRSvxmVATGmEnlxBvfRQZJ726q9kG9ZBiNXBYHGuTZV5aHj04g9kly74GAMWcPbaBrc6FP7V_gJOszA_v0Q5F1mM8MDEmd0CElUIhJaU_EonZEd7TaqQEuFaxDCL_Zk86MHvqwtY_nJuYKI0mufTL9r2R5J9oYkOovgY8dn8_CiviwTw7wVLEqvTJ6Nio', 3);

-- 初始化竖图卡片
INSERT INTO action_cards (title, image_url, action_type, action_value, sort_order) VALUES 
('招聘测试/宣传', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvc6O1B_AQQQ8o_mjaFZQXvMXbAjlShYJxxeTehAf5oeZlNpF7aRcN0rv_L_HCSbHgn9esd0VIO-tU8DzRSvxmVATGmEnlxBvfRQZJ726q9kG9ZBiNXBYHGuTZV5aHj04g9kly74GAMWcPbaBrc6FP7V_gJOszA_v0Q5F1mM8MDEmd0CElUIhJaU_EonZEd7TaqQEuFaxDCL_Zk86MHvqwtY_nJuYKI0mufTL9r2R5J9oYkOovgY8dn8_CiviwTw7wVLEqvTJ6Nio', 'qq_friend', '123456789', 1),
('宣传群发奖红包', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpRnSslP7ypjExvVrGHvufx53-jb8EFMjr_8SnOx0F2yh6h6qD902uZ71Q5oaVnCUP5BZoyF8tmy1AzQJrirX4FnUtFgKp-9a76UV_KFsLYtNZJjOGA5ShDCAn_2n34ZU5Ht-FbmNDAKU_LFyIbH7IsGExMeYk6IfvhwEc50H7HVPOFK6Nhj5iMjbK7YjCqunfvAcJ3wMSf9M1RCbZAkBcjuXqet4pRslDqBYUcJ-J0KdDZMByQgej1deptTsSKkf47Daa6P1bCDc', 'qq_group', '987654321', 2),
('包区联系客服', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIDc9_wXUhkHBtbX8-xr3g-tgGaMWQSfkHmo-ksxQqKePIdVEi5_fOyU9T-73lt0_f9qPjHcebi1n4w7w1ZetC1GA_2T5e-SO01mL_Wj3ojg4aqlVRfbMWcYArA7idRNxH4qQrq4lbG-RfcNxiiFDJw1jp-T74y518OCYxke2Hpq8o-rpgqGdrUB-aInn6KdMboXnWYrEFtLVwwTj1LKKInbS0reoW1GNQf2hPeoJKAUTy_l1_Se6BQ9vLasiCFIGC6xPJ6eEOupA', 'qq_friend', '123456789', 3),
('亏损运营/口碑至上', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsGwKUZ3rvRNweXpHJb1DVosdMX4vG4vPRLFqYRm2egLoH2a4ZF2aZGJnLU6H3bfI7lSLOjy46Lo4RkXcBiVCn-EXxmE_fiNF9Wx_RsPA1nuoHZXrLOywL4UhwMwFf73TZhs-FRU2BNi8scHyIPRMPR3txlfZkAZL-vJOLPvsvsMaAYV0AP84ZqeaXmNXS7tEd2M5wvfOGev-NxvtZxKLB1EkUswElu0HlmALd1mivZYOJ7_wFrge0N5ZuRKtmJaBaR58o5r_p-S8', 'link', 'https://example.com', 4);

-- 初始化游戏版本
INSERT INTO game_versions (name, rhythm, type, engine, description, score, appointment_count, launcher_url, web_game_url, intro_url, sort_order) VALUES 
('无坑传奇之【烈阳沉默】', '三职业沉默复古版本，四个大陆', '1-5天持续有爽感，3-5天左右流畅通关', '装备套数丰富，带BUFF元素，BOSS酷炫凶猛有挑战性，光柱漂亮', '经典沉默版本，深度打磨', 88, 88888, '#', '#', '#', 1),
('无坑传奇之【烈阳沉默】', '三职业沉默复古版本，四个大陆', '1-5天持续有爽感，3-5天左右流畅通关', '装备套数丰富，带BUFF元素，BOSS酷炫凶猛有挑战性，光柱漂亮', '经典沉默版本，深度打磨', 88, 88888, '#', '#', '#', 2),
('无坑传奇之【烈阳沉默】', '三职业沉默复古版本，四个大陆', '1-5天持续有爽感，3-5天左右流畅通关', '装备套数丰富，带BUFF元素，BOSS酷炫凶猛有挑战性，光柱漂亮', '经典沉默版本，深度打磨', 88, 88888, '#', '#', '#', 3);

-- 初始化导航链接
INSERT INTO nav_links (label, action_type, action_value, sort_order) VALUES 
('官方客服', 'qq_friend', '123456789', 1),
('官方QQ群', 'qq_group', '987654321', 2),
('投诉建议', 'page', '/complaint', 3);

-- 启用RLS（行级安全）
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略
CREATE POLICY "允许公开读取设置" ON site_settings FOR SELECT USING (true);
CREATE POLICY "允许公开读取轮播图" ON carousel_slides FOR SELECT USING (true);
CREATE POLICY "允许公开读取卡片" ON action_cards FOR SELECT USING (true);
CREATE POLICY "允许公开读取游戏" ON game_versions FOR SELECT USING (true);
CREATE POLICY "允许公开读取导航" ON nav_links FOR SELECT USING (true);

-- 创建插入策略（预约和投诉）
CREATE POLICY "允许公开创建预约" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "允许公开创建投诉" ON complaints FOR INSERT WITH CHECK (true);

-- NOTE: 管理后台的写入操作需要配置Supabase认证或使用service_role key
