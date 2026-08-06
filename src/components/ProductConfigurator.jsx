import React, { useState } from 'react';
import { ShoppingCart, Check, Tag, Info, Gift, HelpCircle, Package, ShieldAlert } from 'lucide-react';

export default function ProductConfigurator({
  selectedFinish,
  setSelectedFinish,
  customImageDataUrls = [],
  onAddToCart
}) {
  // 套組選擇 (5x5cm 磁鐵 6個入 / 9個入 / 12個入)
  const [packageOption, setPackageOption] = useState('6pack'); // '6pack', '9pack', '12pack'
  const [shareConsent, setShareConsent] = useState('願意'); // '願意', '不願意'
  const [packagingType, setPackagingType] = useState('combined'); // 'combined', 'separate'
  const [cropPreference, setCropPreference] = useState('auto-crop'); // 'auto-crop', 'white-border'
  const [quantity, setQuantity] = useState(1);

  // 套組資料
  const packageTypes = [
    { id: '6pack', label: '63.5mm / 50mm 正方形磁鐵 6 個組', count: 6, price: 450, popular: true },
    { id: '9pack', label: '50mm 正方形磁鐵 9 個滿滿組', count: 9, price: 630, popular: false },
    { id: '12pack', label: '50mm 正方形磁鐵 12 個優惠組', count: 12, price: 800, popular: false },
  ];

  const currentPkg = packageTypes.find((p) => p.id === packageOption) || packageTypes[0];
  const totalPrice = currentPkg.price * quantity;

  const handleAdd = () => {
    const item = {
      id: Date.now(),
      productType: `5cm × 5cm 正方形相片磁鐵 (${currentPkg.count}個/組)`,
      size: '50mm × 50mm (1:1正方形)',
      finish: '日系高清晰相片膜層',
      packageTitle: currentPkg.label,
      shareConsent,
      packagingType: packagingType === 'combined' ? '同一份包裝' : '分開包裝 (依備註欄為準)',
      cropPreference: cropPreference === 'auto-crop' ? '協助裁切至最佳位置' : '保留完整照片 (長方形留白)',
      quantity,
      unitPrice: currentPkg.price,
      totalPrice,
      imageCount: customImageDataUrls.length,
      imageDataUrls: customImageDataUrls,
    };
    onAddToCart(item);
  };

  return (
    <div id="features" className="bg-white rounded-3xl p-6 sm:p-8 shadow-craft-md border border-craft-border space-y-8">
      
      {/* 區塊標題 */}
      <div className="border-b border-craft-border/60 pb-4">
        <h3 className="text-xl font-bold font-serif text-craft-text flex items-center gap-2">
          <Tag className="w-5 h-5 text-craft-accent" />
          相片磁鐵套組與訂購選項
        </h3>
        <p className="text-xs text-craft-subtext mt-1">
          5cm × 5cm (50mm) 1:1 正方形相片磁鐵 • 高階 6 色相紙印製 • 實體強力軟/硬磁
        </p>
      </div>

      {/* 1. 套組選擇 (6個/9個/12個組) */}
      <div>
        <label className="block text-sm font-semibold text-craft-text mb-3">
          1. 選擇正方形磁鐵數量套組
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {packageTypes.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setPackageOption(pkg.id)}
              className={`relative p-4 rounded-2xl text-left border transition-all ${
                packageOption === pkg.id
                  ? 'bg-craft-text text-white border-craft-text shadow-craft-sm ring-2 ring-craft-text/20'
                  : 'bg-white text-craft-text border-craft-border hover:bg-craft-bg'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-craft-accent text-white text-[10px] font-bold rounded-full shadow-sm">
                  SunCloud 經典熱銷
                </span>
              )}
              <div className="text-base font-bold font-serif">{pkg.label}</div>
              <div className={`text-xs mt-1 ${packageOption === pkg.id ? 'text-white/80' : 'text-craft-subtext'}`}>
                可上傳最多 {pkg.count} 張相同或不同的相片
              </div>
              <div className={`text-lg font-bold mt-2 ${packageOption === pkg.id ? 'text-white' : 'text-craft-accent'}`}>
                NT$ {pkg.price}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. 比照 SunCloud 網站進階選項 */}
      <div className="space-y-4 pt-2 border-t border-craft-border/60">
        
        {/* 是否願意公開分享製作過程 */}
        <div>
          <label className="block text-xs font-semibold text-craft-subtext uppercase tracking-wider mb-2">
            2. 是否願意公開分享製作過程 (IG/粉專開箱宣傳)
          </label>
          <div className="flex gap-3">
            {['願意', '不願意'].map((val) => (
              <button
                key={val}
                onClick={() => setShareConsent(val)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  shareConsent === val
                    ? 'bg-craft-primary/30 border-craft-text text-craft-text ring-1 ring-craft-text'
                    : 'bg-white border-craft-border text-craft-subtext hover:bg-craft-bg'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* 相片裁切偏好 */}
        <div>
          <label className="block text-xs font-semibold text-craft-subtext uppercase tracking-wider mb-2">
            3. 長方形照片處理方式
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setCropPreference('auto-crop')}
              className={`p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                cropPreference === 'auto-crop'
                  ? 'bg-craft-bg border-craft-text ring-1 ring-craft-text'
                  : 'bg-white border-craft-border hover:bg-craft-bg'
              }`}
            >
              <div>
                <div className="font-bold text-craft-text">1:1 正方形滿版裁切 (幫您裁切至最佳位置)</div>
                <div className="text-[11px] text-craft-subtext mt-0.5">照片若為長方形，上下或左右會自動適當裁切</div>
              </div>
              {cropPreference === 'auto-crop' && <Check className="w-4 h-4 text-craft-accent shrink-0" />}
            </button>

            <button
              onClick={() => setCropPreference('white-border')}
              className={`p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                cropPreference === 'white-border'
                  ? 'bg-craft-bg border-craft-text ring-1 ring-craft-text'
                  : 'bg-white border-craft-border hover:bg-craft-bg'
              }`}
            >
              <div>
                <div className="font-bold text-craft-text">保留完整長方形照片 (周圍留白)</div>
                <div className="text-[11px] text-craft-subtext mt-0.5">照片完整不裁切，邊界會有留白邊框</div>
              </div>
              {cropPreference === 'white-border' && <Check className="w-4 h-4 text-craft-accent shrink-0" />}
            </button>
          </div>
        </div>

      </div>

      {/* 3. 注意事項與提醒 (比照 SunCloud 網站內容) */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-amber-950">
          <Info className="w-4 h-4 text-amber-700" />
          注意事項與印製說明 (付款後 2 個工作日內寄出)
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-amber-900/90">
          <li><strong>分開包裝需求</strong>：兩組以上若需分開包裝，請於結帳備註欄告知（若無告知皆包裝為同一份）。</li>
          <li><strong>無另外對稿</strong>：收到照片後會以最佳版面直接排單製作，不另外對稿。</li>
          <li><strong>6色印表機製作</strong>：非傳統印刷，使用 6 色相片印表機盡量減少螢幕色差，手工製作有些微磨擦痕跡屬正常範圍。</li>
          <li><strong>保養建議</strong>：相片磁鐵建議使用軟布擦拭，請勿長期曝露於強光太陽或水氣液體下，避免暈染退色。</li>
        </ul>
      </div>

      {/* 4. 數量與總計價格 */}
      <div className="p-5 rounded-2xl bg-craft-bg border border-craft-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-craft-subtext">
            已準備相片：<span className="font-bold text-craft-text">{customImageDataUrls.length} 張</span> / {currentPkg.count} 張
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
  );
}
