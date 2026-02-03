
import React, { useState, useEffect } from 'react';
import { getSetting } from '../services/api';

const Hero: React.FC = () => {
  const [bgUrl, setBgUrl] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuA3PhZHC2D3aS6wyl0C_Zhahs78Z3Dqa8cipCqegdH8AXriV39tZr3PUAl40XQfD_tnZCi4t-_9rLxvY_-RBc8d_E2a9WR-k99Tz6sHlnvGH0hMhiOLslNpBUS7Wbva3VY2yWdGV4WBvCWqKb5SMjPMrOxRt0JavNoX_Ae84Z-M6ntQlmHpUEworgBMPzwUCX3VzbF1lZbbwdTbA55F9QubN8yBTNkgLtLTZzcqHtZ9fVt_8Q9oCfyH3Eqwqj0JHLEri66MwoPESDE");
  const [swordUrl, setSwordUrl] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuBVYr0NeSeCdGFFPIHsQHovnnQJXgXGLtJQqahg8AHwTKog14YIIQCczELg9rXR4D7bEvO_ZILx5zm_5ehVBQZvOp-HeXFxb3faVrMo8PR5T7Vd1f83ZuuM75duWnI3m1C9HgwY62U1mgATVZqKMhlTcYuqc0SBPeKfksWXU1tb8CTC2ieiLobcXm2pIDe5nT7FZJzh0Gve60m7dEEGvba24ZI_w6KtJA79OYrCQ1sl7l5Jflrx6wS8oQIk9vBpW85LpKjS_GhisA0");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [bgSetting, swordSetting] = await Promise.all([
        getSetting('hero_bg_url').catch(() => null),
        getSetting('hero_sword_url').catch(() => null)
      ]);

      if (bgSetting?.value) {
        setBgUrl(bgSetting.value);
      }
      if (swordSetting?.value) {
        setSwordUrl(swordSetting.value);
      }
    } catch (error) {
      console.error('加载顶图设置失败:', error);
    }
  };

  return (
    <header
      className="relative flex flex-col items-center justify-start pt-24 md:pt-32 bg-cover bg-center h-[700px] md:h-[900px]"
      style={{ backgroundImage: `url('${bgUrl}')` }}
    >
      <div className="absolute inset-0 hero-overlay"></div>

      <div className="relative z-10 flex flex-col items-center px-4">
        <div className="relative">
          <div className="red-seal text-[10px] md:text-[11px] absolute -left-8 md:-left-12 top-4 md:top-8 tracking-[0.2em]">正版授权</div>
          <h1 className="font-display text-[80px] md:text-[140px] text-white leading-none text-shadow-glow">无坑传奇</h1>
        </div>

        <div className="mt-4 flex items-center space-x-4 md:space-x-8">
          <div className="h-[1px] w-8 md:w-16 bg-gold/30"></div>
          <div className="flex items-center">
            <span className="text-gold text-lg md:text-2xl">★</span>
            <span className="text-gold tracking-[0.5em] md:tracking-[1em] text-lg md:text-2xl mx-2 md:mx-4 font-bold">20 严 选 总 站</span>
            <span className="text-gold text-lg md:text-2xl">★</span>
          </div>
          <div className="h-[1px] w-8 md:w-16 bg-gold/30"></div>
        </div>

        <div className="text-[9px] md:text-[11px] text-gold/50 mt-2 tracking-[0.5em] uppercase">20 YAN XUAN ZONG ZHAN</div>

        <div className="mt-8 md:mt-12 relative w-full max-w-[800px] h-[300px] md:h-[450px]">
          <img
            alt="Legendary Sword"
            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            src={swordUrl}
          />
        </div>
      </div>

      <div className="absolute bottom-10 md:bottom-20 w-full glass-banner py-6 md:py-8 z-10">
        <div className="text-center max-w-[1200px] mx-auto px-4">
          <p className="text-white/80 text-sm md:text-lg tracking-[0.1em] md:tracking-[0.2em] mb-2 font-light">
            你再也不用在垃圾服里浪费时间了，我们为你严选市场上最好玩的版本！
          </p>
          <p className="text-primary font-bold text-base md:text-xl tracking-[0.1em] md:tracking-[0.3em]">
            全网最严格的筛选机制：不好玩，绝不上线！没修改到位，绝不上线！
          </p>
        </div>
      </div>
    </header>
  );
};

export default Hero;
