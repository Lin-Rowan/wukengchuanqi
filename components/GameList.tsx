
import React, { useState, useEffect } from 'react';
import { getGameVersions, appointGame, handleAction, GameVersion } from '../services/api';

// 默认游戏数据（API失败时回退）
const defaultGames: GameVersion[] = [
  {
    id: '1',
    name: "无坑传奇之【烈阳沉默】",
    rhythm: "三职业沉默复古版本，四个大陆",
    type: "1-5天持续有爽感，3-5天左右流畅通关",
    engine: "装备套数丰富，带BUFF元素，BOSS酷炫凶猛有挑战性，光柱漂亮",
    description: "经典沉默版本，深度打磨",
    score: 88,
    appointment_count: 88888,
    launcher_url: "#",
    web_game_url: "#",
    intro_url: "#",
    sort_order: 1,
    is_active: true
  },
  {
    id: '2',
    name: "无坑传奇之【烈阳沉默】",
    rhythm: "三职业沉默复古版本，四个大陆",
    type: "1-5天持续有爽感，3-5天左右流畅通关",
    engine: "装备套数丰富，带BUFF元素，BOSS酷炫凶猛有挑战性，光柱漂亮",
    description: "经典沉默版本，深度打磨",
    score: 88,
    appointment_count: 88888,
    launcher_url: "#",
    web_game_url: "#",
    intro_url: "#",
    sort_order: 2,
    is_active: true
  },
  {
    id: '3',
    name: "无坑传奇之【烈阳沉默】",
    rhythm: "三职业沉默复古版本，四个大陆",
    type: "1-5天持续有爽感，3-5天左右流畅通关",
    engine: "装备套数丰富，带BUFF元素，BOSS酷炫凶猛有挑战性，光柱漂亮",
    description: "经典沉默版本，深度打磨",
    score: 88,
    appointment_count: 88888,
    launcher_url: "#",
    web_game_url: "#",
    intro_url: "#",
    sort_order: 3,
    is_active: true
  }
];

const GameList: React.FC = () => {
  const [games, setGames] = useState<GameVersion[]>(defaultGames);
  const [appointingId, setAppointingId] = useState<string | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const data = await getGameVersions();
      if (data.length > 0) {
        setGames(data);
      }
    } catch (error) {
      console.error('加载游戏列表失败:', error);
    }
  };

  const handleAppoint = async (gameId: string) => {
    if (appointingId) return; // 防止重复点击

    setAppointingId(gameId);
    try {
      const result = await appointGame(gameId);
      // 更新本地预约数
      setGames(prev => prev.map(game =>
        game.id === gameId
          ? { ...game, appointment_count: result.appointment_count }
          : game
      ));
      alert('预约成功！');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '预约失败';
      alert(errorMessage);
    } finally {
      setAppointingId(null);
    }
  };

  const handleLinkClick = (url: string) => {
    if (url && url !== '#') {
      handleAction('link', url);
    }
  };

  return (
    <section className="overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-[#121212] border-b border-white/10">
            <tr className="text-gray-500 text-[12px] md:text-[13px] tracking-wider uppercase">
              <th className="px-6 md:px-10 py-5 font-medium">游戏介绍</th>
              <th className="px-4 md:px-6 py-5 font-medium text-center">登录器下载</th>
              <th className="px-4 md:px-6 py-5 font-medium text-center">游戏网页</th>
              <th className="px-4 md:px-6 py-5 font-medium text-center">原始版本介绍</th>
              <th className="px-4 md:px-6 py-5 font-medium text-center">预约上线</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {games.map((game) => (
              <tr key={game.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 md:px-10 py-8 md:py-10">
                  <div className="space-y-2 text-[13px] md:text-[14px] text-gray-400">
                    <p><span className="text-white/60">版本名称：</span> <span className="text-white font-medium">{game.name}</span></p>
                    <p><span className="text-white/60">版本节奏：</span> {game.rhythm}</p>
                    <p><span className="text-white/60">版本类型：</span> {game.type}</p>
                    <p><span className="text-white/60">版本引擎：</span> {game.engine}</p>
                    <p><span className="text-white/60">版本介绍：</span> <span className="text-gold font-bold">{game.score}分</span>（满分为100分）</p>
                  </div>
                </td>
                <td className="text-center px-4 md:px-6">
                  <button
                    className="px-6 md:px-8 py-2 md:py-2.5 bg-[#222] text-gray-300 text-xs md:text-sm border border-white/10 hover:bg-primary hover:text-white transition-all rounded-sm"
                    onClick={() => handleLinkClick(game.launcher_url)}
                  >
                    登录器下载
                  </button>
                </td>
                <td className="text-center px-4 md:px-6">
                  <button
                    className="px-6 md:px-8 py-2 md:py-2.5 bg-[#222] text-gray-300 text-xs md:text-sm border border-white/10 hover:bg-primary hover:text-white transition-all rounded-sm"
                    onClick={() => handleLinkClick(game.web_game_url)}
                  >
                    进入网页
                  </button>
                </td>
                <td className="text-center px-4 md:px-6">
                  <a
                    className="text-gold hover:text-white text-xs md:text-sm underline underline-offset-8 decoration-gold/30 transition-colors cursor-pointer"
                    onClick={() => handleLinkClick(game.intro_url)}
                  >
                    原始版本介绍
                  </a>
                </td>
                <td className="text-center px-4 md:px-6">
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleAppoint(game.id)}
                  >
                    <span className={`material-symbols-outlined text-primary text-2xl md:text-3xl mb-2 group-hover:scale-125 transition-transform ${appointingId === game.id ? 'animate-pulse' : ''}`}>
                      favorite
                    </span>
                    <span className="text-[12px] md:text-sm text-white font-bold tracking-widest whitespace-nowrap">
                      {appointingId === game.id ? '预约中...' : '立即预约'}
                    </span>
                    <span className="text-[10px] md:text-[11px] text-gray-600 mt-1">{game.appointment_count}人预约</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default GameList;
