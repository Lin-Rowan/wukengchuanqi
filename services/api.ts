/**
 * API服务层 - 统一处理前端与后端的通信
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * 通用请求函数
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: '请求失败' }));
        throw new Error(error.error || '请求失败');
    }

    // 处理204 No Content
    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}

// ============ 类型定义 ============

export interface CarouselSlide {
    id: string;
    title: string;
    badge: string;
    description: string;
    refund_policy: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
}

export interface ActionCard {
    id: string;
    title: string;
    image_url: string;
    action_type: 'qq_friend' | 'qq_group' | 'link' | 'page';
    action_value: string;
    sort_order: number;
    is_active: boolean;
}

export interface GameVersion {
    id: string;
    name: string;
    rhythm: string;
    type: string;
    engine: string;
    description: string;
    score: number;
    appointment_count: number;
    launcher_url: string;
    web_game_url: string;
    intro_url: string;
    sort_order: number;
    is_active: boolean;
}

export interface NavLink {
    id: string;
    label: string;
    action_type: 'qq_friend' | 'qq_group' | 'link' | 'page';
    action_value: string;
    sort_order: number;
    is_active: boolean;
}

export interface SiteSetting {
    id: string;
    key: string;
    value: string;
    updated_at: string;
}

// ============ API 函数 ============

/**
 * 获取网站设置
 */
export async function getSetting(key: string): Promise<SiteSetting> {
    return request<SiteSetting>(`/settings/${key}`);
}

/**
 * 获取轮播图列表
 */
export async function getCarouselSlides(): Promise<CarouselSlide[]> {
    return request<CarouselSlide[]>('/carousel');
}

/**
 * 获取竖图卡片列表
 */
export async function getActionCards(): Promise<ActionCard[]> {
    return request<ActionCard[]>('/cards');
}

/**
 * 获取游戏版本列表
 */
export async function getGameVersions(): Promise<GameVersion[]> {
    return request<GameVersion[]>('/games');
}

/**
 * 预约游戏
 */
export async function appointGame(gameId: string): Promise<{ success: boolean; appointment_count: number }> {
    return request(`/games/${gameId}/appoint`, { method: 'POST' });
}

/**
 * 获取导航链接
 */
export async function getNavLinks(): Promise<NavLink[]> {
    return request<NavLink[]>('/nav-links');
}

/**
 * 提交投诉建议
 */
export async function submitComplaint(content: string, contactInfo?: string): Promise<{ success: boolean; id: string }> {
    return request('/complaints', {
        method: 'POST',
        body: JSON.stringify({ content, contact_info: contactInfo }),
    });
}


// ============ 管理后台 API - 轮播图 ============

/**
 * 获取所有轮播图（包括未激活的）
 */
export async function getAllCarouselSlides(): Promise<CarouselSlide[]> {
    const token = localStorage.getItem('admin_token');
    return request<CarouselSlide[]>('/carousel/all', {
        headers: { Authorization: `Bearer ${token}` }
    });
}

/**
 * 创建轮播图
 */
export async function createCarouselSlide(data: Partial<CarouselSlide>): Promise<CarouselSlide> {
    const token = localStorage.getItem('admin_token');
    return request<CarouselSlide>('/carousel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}

/**
 * 更新轮播图
 */
export async function updateCarouselSlide(id: string, data: Partial<CarouselSlide>): Promise<CarouselSlide> {
    const token = localStorage.getItem('admin_token');
    return request<CarouselSlide>(`/carousel/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}

/**
 * 删除轮播图
 */
export async function deleteCarouselSlide(id: string): Promise<void> {
    const token = localStorage.getItem('admin_token');
    return request<void>(`/carousel/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
}


// ============ 管理后台 API - 游戏版本 ============

/**
 * 获取所有游戏版本（包括未激活的）
 */
export async function getAllGameVersions(): Promise<GameVersion[]> {
    const token = localStorage.getItem('admin_token');
    return request<GameVersion[]>('/games/all', {
        headers: { Authorization: `Bearer ${token}` }
    });
}

/**
 * 创建游戏版本
 */
export async function createGameVersion(data: Partial<GameVersion>): Promise<GameVersion> {
    const token = localStorage.getItem('admin_token');
    return request<GameVersion>('/games', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}

/**
 * 更新游戏版本
 */
export async function updateGameVersion(id: string, data: Partial<GameVersion>): Promise<GameVersion> {
    const token = localStorage.getItem('admin_token');
    return request<GameVersion>(`/games/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}

/**
 * 删除游戏版本
 */
export async function deleteGameVersion(id: string): Promise<void> {
    const token = localStorage.getItem('admin_token');
    return request<void>(`/games/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
}


// ============ 管理后台 API - 竖图卡片 ============

/**
 * 获取所有卡片（包括未激活的）
 */
export async function getAllActionCards(): Promise<ActionCard[]> {
    const token = localStorage.getItem('admin_token');
    return request<ActionCard[]>('/cards/all', {
        headers: { Authorization: `Bearer ${token}` }
    });
}

/**
 * 创建卡片
 */
export async function createActionCard(data: Partial<ActionCard>): Promise<ActionCard> {
    const token = localStorage.getItem('admin_token');
    return request<ActionCard>('/cards', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}

/**
 * 更新卡片
 */
export async function updateActionCard(id: string, data: Partial<ActionCard>): Promise<ActionCard> {
    const token = localStorage.getItem('admin_token');
    return request<ActionCard>(`/cards/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}

/**
 * 删除卡片
 */
export async function deleteActionCard(id: string): Promise<void> {
    const token = localStorage.getItem('admin_token');
    return request<void>(`/cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
}


// ============ 管理后台 API - 投诉建议 ============

export interface Complaint {
    id: string;
    content: string;
    contact_info: string;
    ip_address: string;
    status: 'pending' | 'processed' | 'ignored';
    created_at: string;
}

export async function getAllComplaints(status?: string): Promise<Complaint[]> {
    const token = localStorage.getItem('admin_token');
    const query = status ? `?status=${status}` : '';
    return request<Complaint[]>(`/complaints${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function updateComplaintStatus(id: string, status: string): Promise<Complaint> {
    const token = localStorage.getItem('admin_token');
    return request<Complaint>(`/complaints/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
    });
}

export async function deleteComplaint(id: string): Promise<void> {
    const token = localStorage.getItem('admin_token');
    return request<void>(`/complaints/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
}

// ============ 管理后台 API - 系统设置 ============

export async function updateSetting(key: string, value: any): Promise<SiteSetting> {
    const token = localStorage.getItem('admin_token');
    return request<SiteSetting>(`/settings/${key}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value })
    });
}

// ============ Auth API ============

/**
 * 管理员登录
 */
export async function loginAdmin(username: string, password: string): Promise<{ token: string; admin: any }> {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}
/**
 * 检查Token有效性
 */
export async function checkAuth(): Promise<boolean> {
    const token = localStorage.getItem('admin_token');
    return !!token;
}

// ============ 工具函数 ============

/**
 * 处理点击动作（QQ好友、QQ群、链接、页面跳转）
 */
export function handleAction(actionType: string, actionValue: string): void {
    switch (actionType) {
        case 'qq_friend':
            // 拉起QQ添加好友
            window.open(`tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=${actionValue}`, '_blank');
            break;
        case 'qq_group':
            // 拉起QQ加群
            window.open(`tencent://groupwpa/?subcmd=all&param=${btoa(`{"groupkey":"${actionValue}"}`)}`, '_blank');
            break;
        case 'link':
            // 打开外部链接
            window.open(actionValue, '_blank');
            break;
        case 'page':
            // 页面内跳转
            window.location.href = actionValue;
            break;
        default:
            console.warn('未知的动作类型:', actionType);
    }
}
