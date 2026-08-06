import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCcw, ZoomIn, ZoomOut, Eye, EyeOff, Sparkles, AlertCircle, Check, Grid, Image as ImageIcon } from 'lucide-react';

export default function BadgeEditor({ selectedFinish, onCustomImagesReady }) {
  // 支援 6 張照片多圖客製 (比照 SunCloud 6個/組)
  const [photoCount, setPhotoCount] = useState(6);
  const [activeSlot, setActiveSlot] = useState(0);
  
  // 每張照片獨立的狀態 (圖片, 縮放, 旋轉, 平移, 留白模式)
  const [slots, setSlots] = useState(
    Array.from({ length: 6 }, () => ({
      imageObj: null,
      imageSrc: null,
      zoom: 1,
      rotation: 0,
      offset: { x: 0, y: 0 },
      fitMode: 'crop', // 'crop' (滿版裁切) 或 'white-border' (保留完整照片周圍留白)
    }))
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showBleedLines, setShowBleedLines] = useState(true);
  const [uploadError, setUploadError] = useState('');
  const [finishEffect, setFinishEffect] = useState(selectedFinish || 'glossy');

  const previewCanvasRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentSlot = slots[activeSlot];

  useEffect(() => {
    if (selectedFinish) {
      setFinishEffect(selectedFinish);
    }
  }, [selectedFinish]);

  // 單張或批量上傳圖片
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError('');

    files.forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('檔案大小超過 10MB 限制！請上傳較小的 JPG 或 PNG。');
        return;
      }

      const targetIndex = (activeSlot + index) % photoCount;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setSlots((prev) => {
            const updated = [...prev];
            updated[targetIndex] = {
              ...updated[targetIndex],
              imageObj: img,
              imageSrc: event.target.result,
              zoom: 1,
              rotation: 0,
              offset: { x: 0, y: 0 },
            };
            return updated;
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // 更新當前 Slot 屬性
  const updateCurrentSlot = (key, value) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[activeSlot] = {
        ...updated[activeSlot],
        [key]: typeof value === 'function' ? value(updated[activeSlot][key]) : value,
      };
      return updated;
    });
  };

  // 拖曳平移
  const handleMouseDown = (e) => {
    if (!currentSlot.imageObj) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - currentSlot.offset.x, y: e.clientY - currentSlot.offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateCurrentSlot('offset', {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 繪製 5*5 cm (50mm x 50mm) 1:1 正方形 Canvas 預覽
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width; // 350px
    const margin = 25; // 邊距
    const squareSize = size - margin * 2; // 300px 正方形
    const borderRadius = 12; // 圓角

    ctx.clearRect(0, 0, size, size);

    if (currentSlot.imageObj) {
      ctx.save();

      // 建立 1:1 正方形微圓角遮罩 (50mm x 50mm Magnet)
      ctx.beginPath();
      ctx.roundRect(margin, margin, squareSize, squareSize, borderRadius);
      ctx.clip();

      // 背景色（若留白則為純白）
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(margin, margin, squareSize, squareSize);

      const center = size / 2;
      ctx.translate(center + currentSlot.offset.x, center + currentSlot.offset.y);
      ctx.rotate((currentSlot.rotation * Math.PI) / 180);
      ctx.scale(currentSlot.zoom, currentSlot.zoom);

      const img = currentSlot.imageObj;
      const aspect = img.width / img.height;

      let drawW, drawH;
      if (currentSlot.fitMode === 'white-border') {
        // 完整保留照片（長方形周圍留白）
        if (aspect >= 1) {
          drawW = squareSize * 0.85;
          drawH = drawW / aspect;
        } else {
          drawH = squareSize * 0.85;
          drawW = drawH * aspect;
        }
      } else {
        // 滿版裁切 (Crop Fill)
        if (aspect >= 1) {
          drawH = squareSize;
          drawW = drawH * aspect;
        } else {
          drawW = squareSize;
          drawH = drawW / aspect;
        }
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    } else {
      // 未上傳圖片時預設 5*5cm 提示
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(margin, margin, squareSize, squareSize, borderRadius);
      ctx.fillStyle = '#F5F5F5';
      ctx.fill();
      ctx.strokeStyle = '#D9C5B2';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#8C7A79';
      ctx.font = '14px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`相片 ${activeSlot + 1} 未上傳`, size / 2, size / 2 - 10);
      ctx.fillText('5cm × 5cm 正方形磁鐵', size / 2, size / 2 + 15);
      ctx.restore();
    }

    generateExportCanvases();
  }, [slots, activeSlot, finishEffect, photoCount]);

  // 生成所有相片的高解析度 1200px 50mm x 50mm 印刷原檔 DataURL
  const generateExportCanvases = () => {
    const exportCanvas = exportCanvasRef.current;
    if (!exportCanvas) return;

    const exportDataUrls = slots.slice(0, photoCount).map((slot, idx) => {
      if (!slot.imageObj) return null;

      const ctx = exportCanvas.getContext('2d');
      const exportSize = 1200; // 1200px 高解析度
      const margin = 50;
      const sqSize = exportSize - margin * 2;

      ctx.clearRect(0, 0, exportSize, exportSize);
      ctx.save();

      ctx.beginPath();
      ctx.roundRect(margin, margin, sqSize, sqSize, 30);
      ctx.clip();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(margin, margin, sqSize, sqSize);

      const scaleFactor = exportSize / 350;
      const center = exportSize / 2;
      ctx.translate(center + slot.offset.x * scaleFactor, center + slot.offset.y * scaleFactor);
      ctx.rotate((slot.rotation * Math.PI) / 180);
      ctx.scale(slot.zoom, slot.zoom);

      const img = slot.imageObj;
      const aspect = img.width / img.height;

      let drawW, drawH;
      if (slot.fitMode === 'white-border') {
        if (aspect >= 1) {
          drawW = sqSize * 0.85;
          drawH = drawW / aspect;
        } else {
          drawH = sqSize * 0.85;
          drawW = drawH * aspect;
        }
      } else {
        if (aspect >= 1) {
          drawH = sqSize;
          drawW = drawH * aspect;
        } else {
          drawW = sqSize;
          drawH = drawW / aspect;
        }
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      return exportCanvas.toDataURL('image/png');
    });

    if (onCustomImagesReady) {
      onCustomImagesReady(exportDataUrls.filter(Boolean));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-craft-md border border-craft-border">
      
      {/* 隱藏高解析度輸出 Canvas */}
      <canvas ref={exportCanvasRef} width={1200} height={1200} className="hidden" />

      {/* 標題與簡介 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-craft-border/60">
        <div>
          <h3 className="text-xl font-bold font-serif text-craft-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-craft-accent" />
            5cm × 5cm (50mm) 正方形相片磁鐵 裁切編輯器
          </h3>
          <p className="text-xs text-craft-subtext mt-1">
            參考 SunCloud 日勻風格設計 • 支援單組上傳最多 6 張不同照片 • 1:1 比例正方形裁切
          </p>
        </div>

        {/* 輔助線開關與清空 */}
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
            {showBleedLines ? '隱藏折線輔助' : '顯示折線輔助'}
          </button>
        </div>
      </div>

      {/* 相片套組 6 張切換分頁 (Photo Slots) */}
      <div className="pt-6">
        <label className="block text-xs font-semibold text-craft-subtext uppercase tracking-wider mb-2">
          正方形磁鐵相片清單 (點擊切換編輯第 1 ~ {photoCount} 張)
        </label>
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {slots.slice(0, photoCount).map((slot, index) => (
            <button
              key={index}
              onClick={() => setActiveSlot(index)}
              className={`relative aspect-square rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-center transition-all ${
                activeSlot === index
                  ? 'border-craft-accent ring-2 ring-craft-accent/30 shadow-md scale-105 bg-white'
                  : 'border-craft-border bg-craft-bg hover:bg-white'
              }`}
            >
              {slot.imageSrc ? (
                <img src={slot.imageSrc} alt={`相片 ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-craft-subtext">#{index + 1}</span>
              )}
              {slot.imageSrc && (
                <span className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 編輯雙欄區 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
        
        {/* 左側：5*5cm 正方形磁鐵 2D/3D 預覽 */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative p-6 rounded-3xl bg-craft-bg border border-craft-border shadow-inner flex flex-col items-center">
            
            <div className="text-xs font-bold text-craft-text mb-3 flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-craft-accent" />
              當前編輯：第 {activeSlot + 1} 張 (50mm × 50mm 正方形)
            </div>

            {/* 1:1 正方形磁鐵 Preview Box */}
            <div
              className="relative rounded-2xl shadow-craft-lg overflow-hidden cursor-move transition-transform duration-200"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ width: '320px', height: '320px' }}
            >
              <canvas
                ref={previewCanvasRef}
                width={350}
                height={350}
                className="w-full h-full object-contain bg-white"
              />

              {/* 表面工藝膜層 */}
              {finishEffect === 'laser' && <div className="absolute inset-0 laser-effect rounded-2xl" />}
              {finishEffect === 'matte' && <div className="absolute inset-0 matte-effect rounded-2xl" />}
              {finishEffect === 'canvas' && <div className="absolute inset-0 canvas-effect rounded-2xl" />}
              {finishEffect === 'glossy' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/35 pointer-events-none rounded-2xl" />
              )}

              {/* 立體厚度陰影 (SunCloud 質感正方形磁鐵邊框) */}
              <div className="absolute inset-0 rounded-2xl border-[5px] border-white/70 shadow-inner pointer-events-none" />

              {/* 0.1cm (1mm) 折線邊界輔助線 */}
              {showBleedLines && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                  <div className="w-full h-full border-2 border-dashed border-sky-400/80 rounded-xl flex items-center justify-center">
                    <div className="w-[90%] h-[90%] border border-dotted border-emerald-500/80 rounded-lg" />
                  </div>
                </div>
              )}
            </div>

            {/* 輔助標籤 */}
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] font-medium text-craft-subtext">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-sky-400 border border-sky-500" />
                藍虛線：周圍 0.1cm 包邊折線
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-600" />
                綠點線：正面最佳圖文區
              </span>
            </div>

          </div>
        </div>

        {/* 右側：控制區 (比照 SunCloud 注意事項) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 上傳圖片按鈕 */}
          <div>
            <label className="block text-sm font-semibold text-craft-text mb-2">
              1. 上傳相片 (可一次選擇多張照片批次匯入)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
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
              <span className="text-sm font-bold text-craft-text">
                {currentSlot.imageSrc ? `更換第 ${activeSlot + 1} 張相片 (或一次選擇 6 張上傳)` : `上傳第 ${activeSlot + 1} 張相片 (支援批量選擇)`}
              </span>
              <span className="text-xs text-craft-subtext">1:1 正方形 50mm × 50mm • 檔案需求 &lt; 10MB</span>
            </button>

            {uploadError && (
              <div className="mt-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* 圖片處理方式 (SunCloud 核心需求: 滿版 vs 周圍留白) */}
          <div>
            <label className="block text-sm font-semibold text-craft-text mb-2">
              2. 選擇相片版面處理方式
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateCurrentSlot('fitMode', 'crop')}
                className={`p-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                  currentSlot.fitMode === 'crop'
                    ? 'bg-craft-text text-white border-craft-text shadow-sm'
                    : 'bg-white text-craft-text border-craft-border hover:bg-craft-bg'
                }`}
              >
                <div>
                  <div className="font-bold">滿版裁切 (推薦)</div>
                  <div className="text-[10px] opacity-80 mt-0.5">自動填滿 5x5cm 正方形</div>
                </div>
                {currentSlot.fitMode === 'crop' && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => updateCurrentSlot('fitMode', 'white-border')}
                className={`p-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                  currentSlot.fitMode === 'white-border'
                    ? 'bg-craft-text text-white border-craft-text shadow-sm'
                    : 'bg-white text-craft-text border-craft-border hover:bg-craft-bg'
                }`}
              >
                <div>
                  <div className="font-bold">完整保留照片 (周圍留白)</div>
                  <div className="text-[10px] opacity-80 mt-0.5">不裁切照片，長方形留白</div>
                </div>
                {currentSlot.fitMode === 'white-border' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 手勢與旋轉/縮放 */}
          <div className="space-y-4 pt-2 border-t border-craft-border/60">
            <label className="block text-sm font-semibold text-craft-text">
              3. 位置微調 (手勢拖曳平移與縮放)
            </label>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-craft-subtext">
                <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> 縮放比例</span>
                <span>{Math.round(currentSlot.zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCurrentSlot('zoom', (z) => Math.max(0.5, z - 0.1))}
                  disabled={!currentSlot.imageObj}
                  className="p-1.5 rounded-lg border border-craft-border bg-white text-craft-text disabled:opacity-40"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={currentSlot.zoom}
                  onChange={(e) => updateCurrentSlot('zoom', parseFloat(e.target.value))}
                  disabled={!currentSlot.imageObj}
                  className="w-full accent-craft-accent disabled:opacity-40 cursor-pointer"
                />
                <button
                  onClick={() => updateCurrentSlot('zoom', (z) => Math.min(3, z + 0.1))}
                  disabled={!currentSlot.imageObj}
                  className="p-1.5 rounded-lg border border-craft-border bg-white text-craft-text disabled:opacity-40"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  updateCurrentSlot('zoom', 1);
                  updateCurrentSlot('rotation', 0);
                  updateCurrentSlot('offset', { x: 0, y: 0 });
                }}
                disabled={!currentSlot.imageObj}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border border-craft-border text-craft-subtext hover:text-craft-text disabled:opacity-40 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重置當前相片位置
              </button>

              <span className="text-xs text-craft-subtext">已編輯相片：{slots.filter(s => s.imageObj).length} / {photoCount} 張</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
