
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-black text-center border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-center mb-6">
            <span className="text-white/40 text-sm font-bold tracking-widest">© 2024 无坑传奇 20yanxuan.com All Rights Reserved.</span>
        </div>
        <p className="text-[11px] md:text-[12px] text-gray-600 tracking-wider leading-loose max-w-4xl mx-auto">
          抵制不良游戏 拒绝盗版游戏 注意自我保护 谨防受骗上当 适度游戏益脑 沉迷游戏伤身 合理安排时间 享受健康生活
        </p>
      </div>
    </footer>
  );
};

export default Footer;
