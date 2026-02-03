
import React, { useState, useEffect } from 'react';
import { getActionCards, handleAction, ActionCard } from '../services/api';

// 默认卡片数据（API失败时回退）
const defaultCards: ActionCard[] = [
  {
    id: '1',
    title: "招聘测试/宣传",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvc6O1B_AQQQ8o_mjaFZQXvMXbAjlShYJxxeTehAf5oeZlNpF7aRcN0rv_L_HCSbHgn9esd0VIO-tU8DzRSvxmVATGmEnlxBvfRQZJ726q9kG9ZBiNXBYHGuTZV5aHj04g9kly74GAMWcPbaBrc6FP7V_gJOszA_v0Q5F1mM8MDEmd0CElUIhJaU_EonZEd7TaqQEuFaxDCL_Zk86MHvqwtY_nJuYKI0mufTL9r2R5J9oYkOovgY8dn8_CiviwTw7wVLEqvTJ6Nio",
    action_type: 'qq_friend',
    action_value: '123456789',
    sort_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: "宣传群发奖红包",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpRnSslP7ypjExvVrGHvufx53-jb8EFMjr_8SnOx0F2yh6h6qD902uZ71Q5oaVnCUP5BZoyF8tmy1AzQJrirX4FnUtFgKp-9a76UV_KFsLYtNZJjOGA5ShDCAn_2n34ZU5Ht-FbmNDAKU_LFyIbH7IsGExMeYk6IfvhwEc50H7HVPOFK6Nhj5iMjbK7YjCqunfvAcJ3wMSf9M1RCbZAkBcjuXqet4pRslDqBYUcJ-J0KdDZMByQgej1deptTsSKkf47Daa6P1bCDc",
    action_type: 'qq_group',
    action_value: '987654321',
    sort_order: 2,
    is_active: true
  },
  {
    id: '3',
    title: "包区联系客服",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIDc9_wXUhkHBtbX8-xr3g-tgGaMWQSfkHmo-ksxQqKePIdVEi5_fOyU9T-73lt0_f9qPjHcebi1n4w7w1ZetC1GA_2T5e-SO01mL_Wj3ojg4aqlVRfbMWcYArA7idRNxH4qQrq4lbG-RfcNxiiFDJw1jp-T74y518OCYxke2Hpq8o-rpgqGdrUB-aInn6KdMboXnWYrEFtLVwwTj1LKKInbS0reoW1GNQf2hPeoJKAUTy_l1_Se6BQ9vLasiCFIGC6xPJ6eEOupA",
    action_type: 'qq_friend',
    action_value: '123456789',
    sort_order: 3,
    is_active: true
  },
  {
    id: '4',
    title: "亏损运营/口碑至上",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsGwKUZ3rvRNweXpHJb1DVosdMX4vG4vPRLFqYRm2egLoH2a4ZF2aZGJnLU6H3bfI7lSLOjy46Lo4RkXcBiVCn-EXxmE_fiNF9Wx_RsPA1nuoHZXrLOywL4UhwMwFf73TZhs-FRU2BNi8scHyIPRMPR3txlfZkAZL-vJOLPvsvsMaAYV0AP84ZqeaXmNXS7tEd2M5wvfOGev-NxvtZxKLB1EkUswElu0HlmALd1mivZYOJ7_wFrge0N5ZuRKtmJaBaR58o5r_p-S8",
    action_type: 'link',
    action_value: 'https://example.com',
    sort_order: 4,
    is_active: true
  }
];

const ActionCards: React.FC = () => {
  const [cards, setCards] = useState<ActionCard[]>(defaultCards);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await getActionCards();
      if (data.length > 0) {
        setCards(data);
      }
    } catch (error) {
      console.error('加载卡片失败:', error);
    }
  };

  const handleCardClick = (card: ActionCard) => {
    handleAction(card.action_type, card.action_value);
  };

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="relative group cursor-pointer overflow-hidden aspect-[3/4] border border-white/5 rounded-sm"
          onClick={() => handleCardClick(card)}
        >
          <img
            alt={card.title}
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
            src={card.image_url}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 md:bottom-10 w-full text-center px-4">
            <h3 className="text-sm md:text-xl text-white font-medium tracking-[0.1em] md:tracking-[0.2em] group-hover:text-gold transition-colors">
              {card.title}
            </h3>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ActionCards;
