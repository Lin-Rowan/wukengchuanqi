
import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Complaint {
    id: string;
    content: string;
    contact_info: string | null;
    ip_address: string;
    status: string;
    created_at: string;
}

interface CarouselSlide {
    id: string;
    title: string;
    badge: string;
    description: string;
    refund_policy: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
}

interface GameVersion {
    id: string;
    name: string;
    rhythm: string;
    type: string;
    engine: string;
    description: string;
    score: number;
    appointment_count: number;
    is_active: boolean;
}

type TabType = 'complaints' | 'carousel' | 'games';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('complaints');
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
    const [games, setGames] = useState<GameVersion[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'complaints':
                    const complaintsRes = await fetch(`${API_BASE_URL}/complaints`);
                    setComplaints(await complaintsRes.json());
                    break;
                case 'carousel':
                    const carouselRes = await fetch(`${API_BASE_URL}/carousel/all`);
                    setCarouselSlides(await carouselRes.json());
                    break;
                case 'games':
                    const gamesRes = await fetch(`${API_BASE_URL}/games/all`);
                    setGames(await gamesRes.json());
                    break;
            }
        } catch (error) {
            console.error('加载数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateComplaintStatus = async (id: string, status: string) => {
        try {
            await fetch(`${API_BASE_URL}/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            loadData();
        } catch (error) {
            alert('更新失败');
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('zh-CN');
    };

    return (
        <div className="min-h-screen bg-black py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 返回按钮 */}
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <span className="material-symbols-outlined mr-2">arrow_back</span>
                    返回首页
                </button>

                {/* 标题 */}
                <h1 className="text-3xl font-bold text-white mb-8">管理后台</h1>

                {/* 标签页 */}
                <div className="flex space-x-4 mb-8 border-b border-white/10">
                    {[
                        { key: 'complaints', label: '投诉建议' },
                        { key: 'carousel', label: '轮播图管理' },
                        { key: 'games', label: '游戏版本管理' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as TabType)}
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === tab.key
                                    ? 'text-primary border-primary'
                                    : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 内容区域 */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">加载中...</div>
                    ) : (
                        <>
                            {/* 投诉建议 */}
                            {activeTab === 'complaints' && (
                                <div className="space-y-4">
                                    {complaints.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">暂无投诉建议</div>
                                    ) : (
                                        complaints.map((item) => (
                                            <div key={item.id} className="bg-black border border-white/5 rounded p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`px-2 py-1 text-xs rounded ${item.status === 'processed'
                                                                ? 'bg-green-900/50 text-green-400'
                                                                : 'bg-yellow-900/50 text-yellow-400'
                                                            }`}>
                                                            {item.status === 'processed' ? '已处理' : '待处理'}
                                                        </span>
                                                        <span className="text-gray-500 text-xs">{formatDate(item.created_at)}</span>
                                                    </div>
                                                    {item.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateComplaintStatus(item.id, 'processed')}
                                                            className="text-xs text-primary hover:text-white transition-colors"
                                                        >
                                                            标记已处理
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-white mb-2">{item.content}</p>
                                                <div className="flex space-x-4 text-xs text-gray-500">
                                                    {item.contact_info && <span>联系方式: {item.contact_info}</span>}
                                                    <span>IP: {item.ip_address}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* 轮播图管理 */}
                            {activeTab === 'carousel' && (
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm mb-4">
                                        提示：轮播图的增删改需要在Supabase后台操作，请访问您的Supabase项目进行管理。
                                    </p>
                                    {carouselSlides.map((slide) => (
                                        <div key={slide.id} className="bg-black border border-white/5 rounded p-4 flex gap-4">
                                            <img src={slide.image_url} alt={slide.title} className="w-24 h-24 object-cover rounded" />
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium">{slide.title}</h3>
                                                <p className="text-gray-400 text-sm mt-1">{slide.description?.substring(0, 100)}...</p>
                                                <div className="flex items-center mt-2 space-x-2">
                                                    <span className={`px-2 py-0.5 text-xs rounded ${slide.is_active ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                                                        {slide.is_active ? '已启用' : '已禁用'}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">排序: {slide.sort_order}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 游戏版本管理 */}
                            {activeTab === 'games' && (
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm mb-4">
                                        提示：游戏版本的增删改需要在Supabase后台操作，请访问您的Supabase项目进行管理。
                                    </p>
                                    {games.map((game) => (
                                        <div key={game.id} className="bg-black border border-white/5 rounded p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-white font-medium">{game.name}</h3>
                                                    <p className="text-gray-400 text-sm mt-1">{game.rhythm}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-gold font-bold">{game.score}分</div>
                                                    <div className="text-gray-500 text-xs mt-1">{game.appointment_count}人预约</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center mt-3 space-x-2">
                                                <span className={`px-2 py-0.5 text-xs rounded ${game.is_active ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                                                    {game.is_active ? '已上线' : '已下线'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
