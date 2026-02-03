
import React, { useState, useEffect } from 'react';
import { getNavLinks, handleAction, NavLink } from '../services/api';

const Navbar: React.FC = () => {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNavLinks();
  }, []);

  const loadNavLinks = async () => {
    try {
      const data = await getNavLinks();
      setNavLinks(data);
    } catch (error) {
      console.error('加载导航链接失败:', error);
      // 回退到默认链接
      setNavLinks([
        { id: '1', label: '官方客服', action_type: 'qq_friend', action_value: '123456789', sort_order: 1, is_active: true },
        { id: '2', label: '官方QQ群', action_type: 'qq_group', action_value: '987654321', sort_order: 2, is_active: true },
        { id: '3', label: '投诉建议', action_type: 'page', action_value: '/complaint', sort_order: 3, is_active: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (e: React.MouseEvent, link: NavLink) => {
    e.preventDefault();
    handleAction(link.action_type, link.action_value);
  };

  return (
    <nav className="absolute top-0 w-full z-50 bg-black/40 border-b border-white/5">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-white text-2xl font-black tracking-tighter mr-2">WK</span>
          <span className="text-white/60 text-[12px] md:text-sm border-l border-white/20 pl-2">无坑传奇 | 20yanxuan.com</span>
        </div>
        <div className="flex space-x-6 md:space-x-10 text-[12px] md:text-[13px] font-medium">
          {!loading && navLinks.map((link) => (
            <a
              key={link.id}
              className="text-white hover:text-gold transition-colors cursor-pointer"
              href="#"
              onClick={(e) => handleNavClick(e, link)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
