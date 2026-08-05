import React from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, Sliders } from 'lucide-react';

export default function HeroSection({ onStartCustomizing }) {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* 背景裝飾光暈 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-craft-primary/30 to-craft-accent/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* 頂部小標籤 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-craft-border shadow-craft-sm text-xs font-medium text-craft-text">
            <Sparkles className="w-3.5 h-3.5 text-craft-accent" />
            <span>日本台式手動壓模機專用 • 出血線自動輔助系統</span>
          </div>

          {/* 主標題 */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-craft-text tracking-tight leading-tight">
            將美好照片，封存為<br />
            <span className="relative inline-block text-craft-accent mt-1">
              溫暖的圓形質感周邊
              <span className="absolute bottom-1 left-0 w-full h-2.5 bg-craft-primary/40 -z-10 rounded-full" />
            </span>
          </h2>

          {/* 副標題 */}
          <p className="text-base sm:text-lg text-craft-subtext font-normal leading-relaxed">
            免費使用線上 3D 圓形遮罩與出血輔助裁切線編輯器！即時預覽亮面、霧面與炫彩鐳射效果，精準防止切圖留白。
          </p>

          {/* 特色條目 Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-craft-text">
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-craft-border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-craft-sage" />
              <span>獨家「出血邊界」與「安全區」輔助線</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-craft-border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-craft-sage" />
              <span>支援 32 / 44 / 58 / 75 mm 多尺寸</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-craft-border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-craft-sage" />
              <span>少量 1 個即可訂製 • 梯次團購優惠</span>
            </div>
          </div>

          {/* 行動按鈕 */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={onStartCustomizing}
              className="px-8 py-3.5 bg-craft-text text-white font-medium rounded-2xl shadow-craft-md hover:bg-craft-text/90 hover:scale-105 transition-all flex items-center gap-2 group"
            >
              <Sliders className="w-5 h-5 text-craft-primary group-hover:rotate-180 transition-transform duration-500" />
              開始線上客製編輯
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
