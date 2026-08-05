import React from 'react';
import { ShoppingBag, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function Navbar({ cartCount, onOpenCart, isAdminOpen, setIsAdminOpen, scrollToEditor }) {
  return (
    <header className="sticky top-0 z-40 bg-craft-bg/90 backdrop-blur-md border-b border-craft-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* 品牌標誌 Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsAdminOpen(false)}>
          <div className="w-11 h-11 rounded-full bg-craft-primary flex items-center justify-center shadow-craft-sm group-hover:scale-105 transition-transform border border-white">
            <Sparkles className="w-6 h-6 text-craft-text" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif tracking-wide text-craft-text flex items-center gap-1.5">
              兜笑了 AllSmiling
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-craft-sage/20 text-craft-text font-sans">
                手作專門店
              </span>
            </h1>
            <p className="text-xs text-craft-subtext font-sans">手繪｜手作｜文創｜圍兜｜平安符袋｜手帕</p>
          </div>
        </div>

        {/* 導覽選項 Navigation Links (全繁體中文) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button 
            onClick={() => { setIsAdminOpen(false); scrollToEditor(); }} 
            className="text-craft-text hover:text-craft-accent transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-craft-accent" />
            線上客製預覽器
          </button>
          <a href="#features" className="text-craft-text/80 hover:text-craft-text transition-colors">
            材質與尺寸規格
          </a>
          <a href="#process" className="text-craft-text/80 hover:text-craft-text transition-colors">
            壓模製作流程
          </a>
        </nav>

        {/* 右側按鈕區 Right Actions */}
        <div className="flex items-center gap-3">
          {/* 後台切換按鈕 */}
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isAdminOpen 
                ? 'bg-craft-text text-white border-craft-text' 
                : 'bg-white text-craft-text border-craft-border hover:bg-craft-secondary/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {isAdminOpen ? '返回前台' : '商家後台'}
          </button>

          {/* 購物車按鈕 */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-craft-primary/80 hover:bg-craft-primary text-craft-text transition-all shadow-craft-sm hover:scale-105 flex items-center justify-center border border-white"
            title="查看購物車"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-craft-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
