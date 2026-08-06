import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import BadgeEditor from './components/BadgeEditor.jsx';
import ProductConfigurator from './components/ProductConfigurator.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { Heart, Sparkles, ShieldCheck, Truck, Package, HelpCircle, Grid } from 'lucide-react';

export default function App() {
  const [selectedFinish, setSelectedFinish] = useState('glossy');
  const [customImageDataUrls, setCustomImageDataUrls] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // 預設 5*5cm 磁鐵示範訂單，方便測試商家後台圖檔下載
  const [orders, setOrders] = useState([
    {
      orderId: 'SC-982103',
      customerName: '陳小美',
      phone: '0912-345-678',
      address: '7-11 溫暖門市 (店號 991283)',
      note: '兩組磁鐵麻煩幫我用兩個可愛小袋分開包裝，謝謝小編！',
      totalAmount: 450,
      createdAt: '2026/08/06 13:45',
      items: [
        {
          id: 1,
          productType: '5cm × 5cm 正方形相片磁鐵 (6個/組)',
          size: '50mm × 50mm (1:1正方形)',
          finish: '日系高清晰相片膜層',
          packageTitle: '63.5mm / 50mm 正方形磁鐵 6 個組',
          shareConsent: '願意',
          packagingType: '分開包裝 (依備註欄為準)',
          cropPreference: '協助裁切至最佳位置',
          quantity: 1,
          unitPrice: 450,
          totalPrice: 450,
          imageCount: 6,
          imageDataUrls: [
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23E8DFD8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234A3E3D" font-size="20">相片 1 (50mm)</text></svg>',
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23D9C5B2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234A3E3D" font-size="20">相片 2 (50mm)</text></svg>',
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%239BB0A5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23FFFFFF" font-size="20">相片 3 (50mm)</text></svg>',
          ],
        }
      ]
    }
  ]);

  const editorRef = useRef(null);

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = (newItem) => {
    setCartItems((prev) => [...prev, newItem]);
    setIsCheckoutOpen(true);
  };

  const handleRemoveCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleNewOrderSubmitted = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-craft-bg text-craft-text font-sans antialiased">
      
      {/* 導覽列 Navbar */}
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCheckoutOpen(true)}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
        scrollToEditor={scrollToEditor}
      />

      {/* 後台或前台切換 */}
      {isAdminOpen ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPanel orders={orders} />
        </main>
      ) : (
        <main className="flex-1 space-y-12 pb-16">
          
          {/* Hero Banner 主視覺 */}
          <HeroSection onStartCustomizing={scrollToEditor} />

          {/* 5*5cm 核心編輯器與商品選項 */}
          <div ref={editorRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
            
            {/* 5cm × 5cm 1:1 正方形相片磁鐵 裁切編輯器 */}
            <BadgeEditor
              selectedFinish={selectedFinish}
              onCustomImagesReady={setCustomImageDataUrls}
            />

            {/* Sun Cloud 風格套組選項與條款說明 */}
            <ProductConfigurator
              selectedFinish={selectedFinish}
              setSelectedFinish={setSelectedFinish}
              customImageDataUrls={customImageDataUrls}
              onAddToCart={handleAddToCart}
            />

          </div>

          {/* SunCloud 風格製作解說 */}
          <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="bg-white rounded-3xl p-8 shadow-craft-md border border-craft-border">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h3 className="text-2xl font-bold font-serif text-craft-text">
                  5cm × 5cm 相片磁鐵 製作與品質堅持
                </h3>
                <p className="text-xs text-craft-subtext mt-1">
                  1:1 正方形微圓角 • 高階 6 色噴墨相紙印製 • 手工包邊與質檢
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-2xl bg-craft-bg border border-craft-border space-y-2">
                  <div className="w-10 h-10 rounded-full bg-craft-primary/30 text-craft-text flex items-center justify-center mx-auto">
                    <Grid className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-craft-text">1. 1:1 正方形自動裁切</h4>
                  <p className="text-xs text-craft-subtext">0.1cm 折線輔助提示，可選擇滿版裁切或完整照片周圍留白。</p>
                </div>

                <div className="p-4 rounded-2xl bg-craft-bg border border-craft-border space-y-2">
                  <div className="w-10 h-10 rounded-full bg-craft-primary/30 text-craft-text flex items-center justify-center mx-auto">
                    <Package className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-craft-text">2. 6 色相紙精細印製</h4>
                  <p className="text-xs text-craft-subtext">還原相片真實色彩與對比度，搭配保護膜抗水氣摩擦。</p>
                </div>

                <div className="p-4 rounded-2xl bg-craft-bg border border-craft-border space-y-2">
                  <div className="w-10 h-10 rounded-full bg-craft-primary/30 text-craft-text flex items-center justify-center mx-auto">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-craft-text">3. 快速出貨與貼心包裝</h4>
                  <p className="text-xs text-craft-subtext">付款後 2 個工作日內製作寄出，兩組以上可指定分開包裝。</p>
                </div>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* 結帳 Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onNewOrderSubmitted={handleNewOrderSubmitted}
      />

      {/* 頁尾 Footer */}
      <footer className="bg-white border-t border-craft-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p className="text-xs text-craft-subtext font-sans flex items-center justify-center gap-1">
            © 2026 兜笑了 AllSmiling • 5cm × 5cm (50mm) 正方形相片磁鐵客製館
          </p>
          <p className="text-[11px] text-craft-subtext/70">
            手繪｜手作｜文創｜圍兜｜平安符袋｜相片磁鐵
          </p>
        </div>
      </footer>

    </div>
  );
}
