import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import BadgeEditor from './components/BadgeEditor.jsx';
import ProductConfigurator from './components/ProductConfigurator.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { Heart, Sparkles, ShieldCheck, Truck, Package, HelpCircle } from 'lucide-react';

export default function App() {
  const [selectedSize, setSelectedSize] = useState('58mm');
  const [selectedFinish, setSelectedFinish] = useState('glossy');
  const [customImageDataUrl, setCustomImageDataUrl] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // 預設示範訂單，方便測試商家後台圖檔下載
  const [orders, setOrders] = useState([
    {
      orderId: 'CC-883921',
      customerName: '陳小美',
      phone: '0912-345-678',
      address: '台北市大安區新生南路三段 88 號',
      note: '麻煩幫我注意出血線不要裁切到右下角簽名，謝謝！',
      totalAmount: 1400,
      createdAt: '2026/08/05 14:30',
      items: [
        {
          id: 1,
          productType: '圓形金屬胸章',
          size: '58mm',
          finish: '日系微砂霧面',
          quantity: 50,
          unitPrice: 28,
          totalPrice: 1400,
          imageDataUrl: null, // 可後續補充
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

      {/* 判斷顯示商家後台或前台主頁 */}
      {isAdminOpen ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPanel orders={orders} />
        </main>
      ) : (
        <main className="flex-1 space-y-12 pb-16">
          
          {/* Hero Banner 主視覺 */}
          <HeroSection onStartCustomizing={scrollToEditor} />

          {/* 核心編輯器與規格組件區 */}
          <div ref={editorRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
            
            {/* 圓形預覽與裁切編輯器 */}
            <BadgeEditor
              selectedSize={selectedSize}
              selectedFinish={selectedFinish}
              onCustomImageReady={setCustomImageDataUrl}
            />

            {/* 規格選單與價格試算 */}
            <ProductConfigurator
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedFinish={selectedFinish}
              setSelectedFinish={setSelectedFinish}
              customImageDataUrl={customImageDataUrl}
              onAddToCart={handleAddToCart}
            />

          </div>

          {/* 品牌優勢與壓模流程解說 */}
          <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="bg-white rounded-3xl p-8 shadow-craft-md border border-craft-border">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h3 className="text-2xl font-bold font-serif text-craft-text">
                  專業台式手動壓模 • 品質保證
                </h3>
                <p className="text-xs text-craft-subtext mt-1">
                  從線上裁切、專業色彩校正輸出，到手工金屬壓模與多重品質檢驗
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-2xl bg-craft-bg border border-craft-border space-y-2">
                  <div className="w-10 h-10 rounded-full bg-craft-primary/30 text-craft-text flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-craft-text">1. 線上圖像自動裁切</h4>
                  <p className="text-xs text-craft-subtext">專利雙輔助線提示，100% 避免切圖留白與邊角被折入。</p>
                </div>

                <div className="p-4 rounded-2xl bg-craft-bg border border-craft-border space-y-2">
                  <div className="w-10 h-10 rounded-full bg-craft-primary/30 text-craft-text flex items-center justify-center mx-auto">
                    <Package className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-craft-text">2. 高細節色彩相紙輸出</h4>
                  <p className="text-xs text-craft-subtext">採用高階色彩噴墨相紙與多樣工藝膜層（亮面/霧面/雷射）。</p>
                </div>

                <div className="p-4 rounded-2xl bg-craft-bg border border-craft-border space-y-2">
                  <div className="w-10 h-10 rounded-full bg-craft-primary/30 text-craft-text flex items-center justify-center mx-auto">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-craft-text">3. 實體台式壓模快速出貨</h4>
                  <p className="text-xs text-craft-subtext">台灣在地手作工作室，少量下單 3-5 個工作天快速寄出。</p>
                </div>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* 結帳與購物車 Modal */}
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
            © 2026 兜笑了 AllSmiling • 手繪｜手作｜文創｜圍兜｜平安符袋｜手帕
          </p>
          <p className="text-[11px] text-craft-subtext/70">
            日系手作質感系統 • 本站全面支援極簡全繁體中文介面
          </p>
        </div>
      </footer>

    </div>
  );
}
