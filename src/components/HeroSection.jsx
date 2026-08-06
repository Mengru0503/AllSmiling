import React from 'react';
import { Sparkles, CheckCircle2, Grid, Sliders, Image as ImageIcon } from 'lucide-react';

export default function HeroSection({ onStartCustomizing }) {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* 背景裝飾光暈 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-craft-primary/30 to-craft-accent/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* 頂部標籤 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-craft-border shadow-craft-sm text-xs font-medium text-craft-text">
            <Sparkles className="w-3.5 h-3.5 text-craft-accent" />
            <span>SunCloud 風格 • 5cm × 5cm (50mm) 正方形相片磁鐵客製</span>
          </div>

          {/* 主標題 */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-craft-text tracking-tight leading-tight">
            將珍貴生活照片，做成<br />
            <span className="relative inline-block text-craft-accent mt-1">
              5×5cm 溫暖 1:1 正方形相片磁鐵
              <span className="absolute bottom-1 left-0 w-full h-2.5 bg-craft-primary/40 -z-10 rounded-full" />
            </span>
          </h2>

          {/* 副標題 */}
          <p className="text-base sm:text-lg text-craft-subtext font-normal leading-relaxed">
            免費線上預覽 1:1 正方形裁切與折線效果！高階 6 色噴墨相紙印製，可選擇滿版裁切或照片完整保留留白。
          </p>

          {/* 特色標籤 */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-craft-text">
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-craft-border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-craft-sage" />
              <span>50mm × 50mm (5*5cm) 標準正方形</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-craft-border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-craft-sage" />
              <span>單組支援一次上傳 6 張相片</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-craft-border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-craft-sage" />
              <span>高階 6 色印表機 • 強力背磁</span>
            </div>
          </div>

          {/* 行動按鈕 */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={onStartCustomizing}
              className="px-8 py-3.5 bg-craft-text text-white font-medium rounded-2xl shadow-craft-md hover:bg-craft-text/90 hover:scale-105 transition-all flex items-center gap-2 group"
            >
              <Grid className="w-5 h-5 text-craft-primary group-hover:rotate-12 transition-transform duration-300" />
              開始線上上傳與 5*5cm 裁切預覽
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
