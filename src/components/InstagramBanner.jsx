import React, { useState, useEffect } from 'react';

export default function InstagramBanner() {
  const [useFinalFrame, setUseFinalFrame] = useState(false);

  useEffect(() => {
    // GIF 動畫單次播放時長 (約 3.5 秒)，播放完了自動切換至第 30 幀高解析度 PNG 定格檔
    const animationDuration = 3500;

    const timer = setTimeout(() => {
      setUseFinalFrame(true);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 text-center">
      {/* 點擊連至 IG 主頁 */}
      <a
        href="https://www.instagram.com/all_smiling/"
        target="_blank"
        rel="noopener noreferrer"
        className="block relative group cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
        title="點擊前往 兜笑了 AllSmiling Instagram 主頁"
      >
        {/* 精準矩形比例遮罩 */}
        <div className="relative w-full aspect-[1.55/1] overflow-hidden rounded-3xl bg-white shadow-craft-sm hover:shadow-craft-md border border-craft-border/40 transition-all flex items-center justify-center p-2 sm:p-4">
          
          {/* 動畫播放 1 次 (3.5秒) 後，自動切換為第 30 幀最後一頁的高解析度定格 PNG 圖片 */}
          <img
            src={useFinalFrame ? "./instagram-banner-final.png" : "./instagram-banner-single.gif"}
            alt="兜笑了 AllSmiling Instagram 官方主頁展示"
            className="w-full h-full object-cover object-center scale-[1.33] sm:scale-[1.28] transition-transform duration-500 ease-out group-hover:scale-[1.32]"
            onError={(e) => {
              // 若 fallback，使用單次循環 GIF 或定格檔
              e.currentTarget.src = "./instagram-banner-final.png";
            }}
          />

        </div>
      </a>
    </div>
  );
}
