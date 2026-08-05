import React, { useState } from 'react';
import { ShoppingCart, Check, Tag, Info, Gift } from 'lucide-react';

export default function ProductConfigurator({
  selectedSize,
  setSelectedSize,
  selectedFinish,
  setSelectedFinish,
  customImageDataUrl,
  onAddToCart
}) {
  const [productType, setProductType] = useState('pin'); // pin, keychain, magnet
  const [quantity, setQuantity] = useState(10);

  // 尺寸規格資料
  const sizes = [
    { id: '32mm', label: '32 mm', desc: '輕巧精緻 • 包包標配', popular: false },
    { id: '44mm', label: '44 mm', desc: '經典熱銷 • 展覽同人', popular: false },
    { id: '58mm', label: '58 mm', desc: '最受歡迎 • 圖像清晰', popular: true },
    { id: '75mm', label: '75 mm', desc: '超大圖面 • 收藏首選', popular: false },
  ];

  // 表面工藝選單
  const finishes = [
    { id: 'glossy', label: '經典光澤亮面', desc: '色彩鮮明高透光', priceBonus: 0 },
    { id: 'matte', label: '日系微砂霧面', desc: '不反光細緻質感', priceBonus: 2 },
    { id: 'laser', label: '炫彩星幻鐳射', desc: '陽光下幻彩閃爍', priceBonus: 5 },
    { id: 'canvas', label: '復古手感布紋', desc: '手作帆布溫暖觸感', priceBonus: 3 },
  ];

  // 計算單價與梯次優惠
  const getUnitPrice = (qty, finishId) => {
    let basePrice = 45;
    if (qty >= 100) basePrice = 20;
    else if (qty >= 50) basePrice = 28;
    else if (qty >= 10) basePrice = 35;

    const finishObj = finishes.find((f) => f.id === finishId);
    const bonus = finishObj ? finishObj.priceBonus : 0;
    return basePrice + bonus;
  };

  const unitPrice = getUnitPrice(quantity, selectedFinish);
  const totalPrice = unitPrice * quantity;

  // 處理加購物車
  const handleAdd = () => {
    const item = {
      id: Date.now(),
      productType: productType === 'pin' ? '圓形金屬胸章' : productType === 'keychain' ? '圓形壓模鑰匙圈' : '圓形相片磁鐵',
      size: selectedSize,
      finish: finishes.find(f => f.id === selectedFinish)?.label || '經典光澤亮面',
      quantity,
      unitPrice,
      totalPrice,
      imageDataUrl: customImageDataUrl,
    };
    onAddToCart(item);
  };

  return (
    <div id="features" className="bg-white rounded-3xl p-6 sm:p-8 shadow-craft-md border border-craft-border space-y-8">
      
      {/* 區塊標題 */}
      <div className="border-b border-craft-border/60 pb-4">
        <h3 className="text-xl font-bold font-serif text-craft-text flex items-center gap-2">
          <Tag className="w-5 h-5 text-craft-accent" />
          4. 選擇周邊規格與訂購數量
        </h3>
        <p className="text-xs text-craft-subtext mt-1">
          直營實體設備壓模製作 • 少量 1 個可訂 • 團購享有梯次級距優惠
        </p>
      </div>

      {/* 1. 周邊類型選擇 */}
      <div>
        <label className="block text-sm font-semibold text-craft-text mb-3">
          周邊產品種類
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'pin', name: '圓形金屬胸章', desc: '別針金屬底盤' },
            { id: 'keychain', name: '圓形鑰匙圈', desc: '鑰匙扣隨身掛' },
            { id: 'magnet', name: '圓形相片磁鐵', desc: '強力背磁吸附' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setProductType(item.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                productType === item.id
                  ? 'bg-craft-bg border-craft-text ring-2 ring-craft-text/10 shadow-sm'
                  : 'bg-white border-craft-border hover:bg-craft-bg/50'
              }`}
            >
              <div className="text-sm font-bold text-craft-text">{item.name}</div>
              <div className="text-xs text-craft-subtext mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. 圓形尺寸選擇 */}
      <div>
        <label className="block text-sm font-semibold text-craft-text mb-3">
          圓形外徑尺寸 (直徑)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sizes.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSize(s.id)}
              className={`relative p-3.5 rounded-2xl text-left border transition-all ${
                selectedSize === s.id
                  ? 'bg-craft-text text-white border-craft-text shadow-craft-sm'
                  : 'bg-white text-craft-text border-craft-border hover:bg-craft-bg'
              }`}
            >
              {s.popular && (
                <span className="absolute -top-2.5 right-2 px-2 py-0.5 bg-craft-accent text-white text-[10px] font-bold rounded-full shadow-sm">
                  熱銷推薦
                </span>
              )}
              <div className="text-base font-bold font-serif">{s.label}</div>
              <div className={`text-xs mt-1 ${selectedSize === s.id ? 'text-white/80' : 'text-craft-subtext'}`}>
                {s.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 表面材質選購 */}
      <div>
        <label className="block text-sm font-semibold text-craft-text mb-3">
          表面工藝膜層
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {finishes.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFinish(f.id)}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                selectedFinish === f.id
                  ? 'bg-craft-primary/20 border-craft-text ring-1 ring-craft-text'
                  : 'bg-white border-craft-border hover:bg-craft-bg'
              }`}
            >
              <div>
                <div className="text-sm font-bold text-craft-text flex items-center gap-1.5">
                  {f.label}
                  {f.priceBonus > 0 && (
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-craft-accent/10 text-craft-accent">
                      +NT${f.priceBonus}/個
                    </span>
                  )}
                </div>
                <div className="text-xs text-craft-subtext mt-0.5">{f.desc}</div>
              </div>
              {selectedFinish === f.id && <Check className="w-5 h-5 text-craft-text shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 數量與梯次優惠試算 */}
      <div className="p-5 rounded-2xl bg-craft-bg border border-craft-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-sm font-semibold text-craft-text">
              訂購數量 (個)
            </label>
            <div className="text-xs text-craft-subtext mt-0.5 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-craft-accent" />
              <span>多量團購享階梯優惠價格</span>
            </div>
          </div>

          {/* 數量微調按鈕 */}
          <div className="flex items-center gap-2">
            {[1, 10, 50, 100].map((num) => (
              <button
                key={num}
                onClick={() => setQuantity(num)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                  quantity === num
                    ? 'bg-craft-text text-white border-craft-text'
                    : 'bg-white text-craft-text border-craft-border hover:bg-craft-secondary/60'
                }`}
              >
                {num} 個
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="9999"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-1 text-center font-bold border border-craft-border rounded-lg bg-white text-sm"
            />
          </div>
        </div>

        {/* 價格計算明細卡 */}
        <div className="pt-3 border-t border-craft-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-craft-subtext">
              當前梯次優惠單價：<span className="font-bold text-craft-text">NT$ {unitPrice}</span> / 個
            </div>
            <div className="text-2xl font-bold font-serif text-craft-accent mt-0.5">
              總金額：NT$ {totalPrice.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full sm:w-auto px-8 py-3.5 bg-craft-accent text-white font-bold rounded-2xl shadow-craft-md hover:bg-craft-accent/90 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            加入購物車 / 確定訂購
          </button>
        </div>
      </div>

    </div>
  );
}
