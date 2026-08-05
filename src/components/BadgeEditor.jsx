import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCcw, ZoomIn, ZoomOut, Move, Eye, EyeOff, Sparkles, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';

export default function BadgeEditor({ selectedSize, selectedFinish, onCustomImageReady }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showBleedLines, setShowBleedLines] = useState(true);
  const [uploadError, setUploadError] = useState('');
  const [finishEffect, setFinishEffect] = useState(selectedFinish || 'glossy'); // glossy, matte, laser, canvas

  const previewCanvasRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // 當父組件切換 selectedFinish 時連動
  useEffect(() => {
    if (selectedFinish) {
      setFinishEffect(selectedFinish);
    }
  }, [selectedFinish]);

  // 處理圖片上傳
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB 大小限制檢查
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('檔案大小超過 10MB 限制！請選擇較小的 JPG 或 PNG 圖片。');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('圖片格式不支援！請上傳 JPG、PNG 或 WEBP 格式圖片。');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageObj(img);
        setImageSrc(event.target.result);
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // 拖曳平移邏輯
  const handleMouseDown = (e) => {
    if (!imageObj) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 重置圖片位置
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // 繪製前台即時預覽 Canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = size * 0.42; // 正面直徑區域

    // 清空背景
    ctx.clearRect(0, 0, size, size);

    if (imageObj) {
      ctx.save();
      // 建立圓形裁切遮罩 (Circular Mask)
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.clip();

      // 繪製背景底色防止透明
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      // 移動與旋轉變換
      ctx.translate(center + offset.x, center + offset.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // 計算縮放保持比例繪製
      const aspect = imageObj.width / imageObj.height;
      let drawW = size * 0.85;
      let drawH = drawW / aspect;
      if (aspect < 1) {
        drawH = size * 0.85;
        drawW = drawH * aspect;
      }

      ctx.drawImage(imageObj, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    } else {
      // 未上傳圖片時預設圖案與提示
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#F3ECE7';
      ctx.fill();
      ctx.strokeStyle = '#D9C5B2';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#8C7A79';
      ctx.font = '14px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('請點擊右側「上傳照片」', center, center - 10);
      ctx.fillText('即可開啓圓形裁切預覽', center, center + 15);
      ctx.restore();
    }

    // 產生高解析度圖檔數據給父組件
    generateExportCanvas();

  }, [imageObj, zoom, rotation, offset, finishEffect]);

  // 生成商家實體切圓機專用 300DPI 高解析圖檔 Export Canvas
  const generateExportCanvas = () => {
    const exportCanvas = exportCanvasRef.current;
    if (!exportCanvas || !imageObj) return;

    const ctx = exportCanvas.getContext('2d');
    const exportSize = 1200; // 1200px 高解析度
    const center = exportSize / 2;
    const outerBleedRadius = exportSize * 0.48; // 包邊出血半徑

    ctx.clearRect(0, 0, exportSize, exportSize);

    ctx.save();
    // 切圓圓形
    ctx.beginPath();
    ctx.arc(center, center, outerBleedRadius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, exportSize, exportSize);

    // 等比例放大 offset 與 zoom
    const scaleFactor = exportSize / 350; // 350 為預覽 Canvas 尺寸
    ctx.translate(center + offset.x * scaleFactor, center + offset.y * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const aspect = imageObj.width / imageObj.height;
    let drawW = exportSize * 0.85;
    let drawH = drawW / aspect;
    if (aspect < 1) {
      drawH = exportSize * 0.85;
      drawW = drawH * aspect;
    }

    ctx.drawImage(imageObj, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const dataUrl = exportCanvas.toDataURL('image/png');
    if (onCustomImageReady) {
      onCustomImageReady(dataUrl);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-craft-md border border-craft-border">
      
      {/* 區塊標題 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-craft-border/60">
        <div>
          <h3 className="text-xl font-bold font-serif text-craft-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-craft-accent" />
            線上圓形胸章預覽與裁切編輯器
          </h3>
          <p className="text-xs text-craft-subtext mt-1">
            專利實體壓模雙線提示：【藍虛線】切圓機出血界線 • 【綠點線】正面安全圖文區
          </p>
        </div>

        {/* 輔助線開關與重置按鈕 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBleedLines(!showBleedLines)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              showBleedLines
                ? 'bg-craft-sage/15 text-craft-text border-craft-sage/40'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            {showBleedLines ? <Eye className="w-3.5 h-3.5 text-craft-sage" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showBleedLines ? '隱藏裁切輔助線' : '顯示裁切輔助線'}
          </button>

          <button
            onClick={handleReset}
            disabled={!imageObj}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-craft-border text-craft-subtext hover:text-craft-text hover:bg-craft-bg disabled:opacity-40 flex items-center gap-1 transition-all"
            title="恢復原圖位置"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置原圖
          </button>
        </div>
      </div>

      {/* 主要編輯雙欄 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
        
        {/* 左側：Canvas 即時圓形與材質預覽區 */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative group p-4 rounded-3xl bg-craft-bg border border-craft-border shadow-inner">
            
            {/* 隱藏用的高解析 300DPI 導出 Canvas */}
            <canvas ref={exportCanvasRef} width={1200} height={1200} className="hidden" />

            {/* 實體胸章 3D 視覺框 */}
            <div
              className="relative rounded-full shadow-craft-lg overflow-hidden cursor-move transition-transform duration-200"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ width: '320px', height: '320px' }}
            >
              {/* 預覽繪製 Canvas */}
              <canvas
                ref={previewCanvasRef}
                width={350}
                height={350}
                className="w-full h-full object-contain bg-white"
              />

              {/* 表面材質工藝覆蓋層 (Surface Finish Overlay) */}
              {finishEffect === 'laser' && <div className="absolute inset-0 laser-effect rounded-full" />}
              {finishEffect === 'matte' && <div className="absolute inset-0 matte-effect rounded-full" />}
              {finishEffect === 'canvas' && <div className="absolute inset-0 canvas-effect rounded-full" />}
              {finishEffect === 'glossy' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none rounded-full" />
              )}

              {/* 實體胸章擬真金屬立體陰影 border */}
              <div className="absolute inset-0 rounded-full border-[6px] border-white/60 shadow-inner pointer-events-none" />

              {/* 輔助出血線與安全區 Overlay (全繁體中文提示) */}
              {showBleedLines && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* 外圈切圓出血線（藍色虛線） */}
                  <div className="w-[92%] h-[92%] rounded-full border-2 border-dashed border-sky-400/80 flex items-center justify-center">
                    {/* 內圈正面圖文安全邊界（綠色點線） */}
                    <div className="w-[84%] h-[84%] rounded-full border-2 border-dotted border-emerald-500/80" />
                  </div>
                </div>
              )}
            </div>

            {/* 底部輔助說明標籤 */}
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] font-medium text-craft-subtext">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-sky-500" />
                藍虛線：台式切圓機範圍
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600" />
                綠點線：正面完美圖文區
              </span>
            </div>

          </div>
        </div>

        {/* 右側：控制區（全中文選項） */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 上傳圖片區 */}
          <div>
            <label className="block text-sm font-semibold text-craft-text mb-2">
              1. 選擇客製圖片 (上傳圖檔)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-craft-primary hover:border-craft-accent bg-craft-bg/50 hover:bg-craft-bg transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-craft-accent shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-craft-text">
                {imageObj ? '重新選擇 / 更換照片' : '點擊上傳圖片 (支援 JPG / PNG)'}
              </span>
              <span className="text-xs text-craft-subtext">圖片大寫需小於 10MB • 系統將自動套用圓形裁切</span>
            </button>

            {uploadError && (
              <div className="mt-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* 表面材質切換選項 */}
          <div>
            <label className="block text-sm font-semibold text-craft-text mb-2">
              2. 預覽表面質感工藝
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'glossy', label: '經典亮面', icon: '🌟' },
                { id: 'matte', label: '微砂霧面', icon: '📜' },
                { id: 'laser', label: '星幻鐳射', icon: '✨' },
                { id: 'canvas', label: '復古布紋', icon: '🧵' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFinishEffect(item.id)}
                  className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    finishEffect === item.id
                      ? 'bg-craft-text text-white border-craft-text shadow-sm'
                      : 'bg-white text-craft-text border-craft-border hover:bg-craft-bg'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 圖片大小與旋轉控制控制桿 */}
          <div className="space-y-4 pt-2 border-t border-craft-border/60">
            <label className="block text-sm font-semibold text-craft-text">
              3. 圖片縮放與旋轉調整
            </label>

            {/* 縮放控制 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-craft-subtext">
                <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> 縮放比例</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                  disabled={!imageObj}
                  className="p-1.5 rounded-lg border border-craft-border bg-white text-craft-text disabled:opacity-40"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  disabled={!imageObj}
                  className="w-full accent-craft-accent disabled:opacity-40 cursor-pointer"
                />
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                  disabled={!imageObj}
                  className="p-1.5 rounded-lg border border-craft-border bg-white text-craft-text disabled:opacity-40"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 旋轉控制 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-craft-subtext">
                <span className="flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> 旋轉角度</span>
                <span>{rotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  disabled={!imageObj}
                  className="w-full accent-craft-accent disabled:opacity-40 cursor-pointer"
                />
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  disabled={!imageObj}
                  className="px-2 py-1 rounded-lg border border-craft-border text-xs bg-white text-craft-text disabled:opacity-40 shrink-0"
                >
                  +90°
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
