
import React, { useState, useEffect } from 'react';
import { getCarouselSlides, CarouselSlide } from '../services/api';

// 默认轮播数据（API失败时回退）
const defaultSlides: CarouselSlide[] = [
  {
    id: '1',
    title: "包好玩，不好玩全额退款",
    badge: "[20严选总站]",
    description: "严选市场上最好玩的各类版本，经反复修改，确保好玩才上线，彻底解决玩家找服难的痛点。所有版本测试区免费领顶赞试玩，正式区充值2个小时内，任意原因觉得不好玩，联系客服直接全额退款。中后期万一感觉不好玩，随时反馈给客服，1小时内找技术团队修改调整，为了确保好玩，我们什么都愿意改。",
    refund_policy: "「退款流程：联系客服直接提供充值截图即可办理，30分钟内极速退款。」",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbtf2ucVX_MTuAt_LA1k7F99hKDKyYRV6D1wKtT4kAeZ0i1aPeaHqTxG8H7SXT05efgpOYNYD65Pl-p6EzhmJEsqFRC6GxlVhBnlJbmMosF9YO0VZIWnd97H7mM4xPKsMIJ8mSC3Hi6BnP3upRLhFgvYbkyCSJPqD-RIU78FT45JUN6xGL4OPcvrXFynbC41dXBCeMczuCMePZ4v0YdUxvRp1S-eKZwoNDI9uvSSjIb5YlNTB5funx5ESD9MX4E7D_mIiYT-H3jlk",
    sort_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: "公平透明，绝无暗坑",
    badge: "[诚信运营]",
    description: "我们深知玩家最痛恨的就是托和内服。在20严选，每一个版本都经过严格的人工审核，确保数据全透明、几率真实可靠。无论是散人玩家还是大R用户，都能在公平的环境下享受真正的传奇乐趣。我们拒绝任何破坏平衡的行为，只为打造一片纯净的游戏净土。",
    refund_policy: "「公平承诺：如发现任何管理参与游戏或特殊待遇，举报核实奖励万元。」",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsGwKUZ3rvRNweXpHJb1DVosdMX4vG4vPRLFqYRm2egLoH2a4ZF2aZGJnLU6H3bfI7lSLOjy46Lo4RkXcBiVCn-EXxmE_fiNF9Wx_RsPA1nuoHZXrLOywL4UhwMwFf73TZhs-FRU2BNi8scHyIPRMPR3txlfZkAZL-vJOLPvsvsMaAYV0AP84ZqeaXmNXS7tEd2M5wvfOGev-NxvtZxKLB1EkUswElu0HlmALd1mivZYOJ7_wFrge0N5ZuRKtmJaBaR58o5r_p-S8",
    sort_order: 2,
    is_active: true
  },
  {
    id: '3',
    title: "精品版本，长久稳定",
    badge: "[严选佳作]",
    description: "不做快餐，只做精品。每一个入选版本都具备极高的耐玩性和深度的内容迭代。从怀旧复古到创新沉默，我们不仅关注开区时的热度，更关注合区后的激情。专业的技术团队24小时待命，确保服务器永不卡顿，让你的每一份努力都能在长久的岁月中熠熠生辉。",
    refund_policy: "「稳定保障：服务器如遇非维护性宕机，全服玩家领取高额补偿礼包。」",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvc6O1B_AQQQ8o_mjaFZQXvMXbAjlShYJxxeTehAf5oeZlNpF7aRcN0rv_L_HCSbHgn9esd0VIO-tU8DzRSvxmVATGmEnlxBvfRQZJ726q9kG9ZBiNXBYHGuTZV5aHj04g9kly74GAMWcPbaBrc6FP7V_gJOszA_v0Q5F1mM8MDEmd0CElUIhJaU_EonZEd7TaqQEuFaxDCL_Zk86MHvqwtY_nJuYKI0mufTL9r2R5J9oYkOovgY8dn8_CiviwTw7wVLEqvTJ6Nio",
    sort_order: 3,
    is_active: true
  }
];

const FeatureSection: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, slides.length]);

  const loadSlides = async () => {
    try {
      const data = await getCarouselSlides();
      if (data.length > 0) {
        setSlides(data);
      }
    } catch (error) {
      console.error('加载轮播图失败:', error);
    }
  };

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsFading(false);
    }, 500);
  };

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative overflow-hidden">
      <div
        className={`bg-black content-border p-6 md:p-12 flex flex-col lg:flex-row items-center gap-12 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="flex-1">
          <div className="flex items-center mb-8 md:mb-10">
            <div className="w-1.5 h-8 md:h-10 bg-primary mr-5"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{currentSlide.title}</h2>
          </div>
          <div className="space-y-6 md:space-y-8 text-gray-400 leading-relaxed text-[14px] md:text-[15px]">
            <p>
              <span className="text-primary font-bold">{currentSlide.badge}</span> {currentSlide.description}
            </p>
            <p className="text-gold/80 italic font-medium tracking-wide">
              {currentSlide.refund_policy}
            </p>
          </div>
        </div>
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="relative group">
            <img
              alt="Feature Visual"
              className="w-full aspect-square object-cover rounded-lg shadow-2xl border border-white/5 transition-transform duration-700 group-hover:scale-[1.02]"
              src={currentSlide.image_url}
            />
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx !== currentIndex) {
                setIsFading(true);
                setTimeout(() => {
                  setCurrentIndex(idx);
                  setIsFading(false);
                }, 500);
              }
            }}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary scale-125' : 'bg-white/20 hover:bg-white/40'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
