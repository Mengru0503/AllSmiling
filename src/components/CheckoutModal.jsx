import React, { useState } from 'react';
import { X, Trash2, CheckCircle2, CreditCard, Truck, User, Phone, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal({ isOpen, onClose, cartItems, onRemoveItem, onClearCart, onNewOrderSubmitted }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const newId = 'CC-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(newId);

    const orderData = {
      orderId: newId,
      customerName,
      phone,
      address,
      note,
      items: cartItems,
      totalAmount,
      createdAt: new Date().toLocaleString('zh-TW'),
    };

    if (onNewOrderSubmitted) {
      onNewOrderSubmitted(orderData);
    }

    setIsSuccess(true);

    // 觸發彩帶動畫
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-craft-border overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* 頂部 Header */}
        <div className="bg-craft-bg px-6 py-4 border-b border-craft-border flex items-center justify-between">
          <h3 className="text-lg font-bold font-serif text-craft-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-craft-accent" />
            {isSuccess ? '訂單提交成功！' : '購物車與訂購資料填寫'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-craft-secondary/50 text-craft-subtext hover:text-craft-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 內容區 */}
        <div className="p-6 space-y-6">
          {isSuccess ? (
            /* 送出成功畫面 */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold font-serif text-craft-text">感謝您的訂購！</h4>
              <p className="text-sm text-craft-subtext">
                您的訂單編號為：<span className="font-mono font-bold text-craft-accent text-base">{orderId}</span>
              </p>

              <div className="max-w-md mx-auto bg-craft-bg p-4 rounded-2xl border border-craft-border text-left text-xs text-craft-text space-y-2">
                <div className="font-bold border-b border-craft-border pb-1">轉帳匯款資訊：</div>
                <div>銀行代碼：822 中國信託</div>
                <div>帳號：1234-5678-9012</div>
                <div>戶名：兜笑了 AllSmiling</div>
                <div className="text-craft-accent font-medium">請於 24 小時內完成匯款，後台即可開始印製排單實體壓模。</div>
              </div>

              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-craft-text text-white font-medium rounded-xl hover:bg-craft-text/90 shadow-md"
              >
                完成並返回首頁
              </button>
            </div>
          ) : (
            /* 購物車與表單 */
            <>
              {/* 1. 購物車項目清單 */}
              <div>
                <h4 className="text-sm font-semibold text-craft-text mb-3">訂購項目清單</h4>
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-xs text-craft-subtext bg-craft-bg rounded-2xl border border-dashed border-craft-border">
                    購物車目前是空的，請先上傳圖片並點擊「加入購物車」。
                  </div>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-craft-bg border border-craft-border text-xs">
                        <div className="flex items-center gap-3">
                          {item.imageDataUrl ? (
                            <img src={item.imageDataUrl} alt="客製圖" className="w-12 h-12 rounded-full object-cover border border-white shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-craft-primary/30 flex items-center justify-center text-craft-text">圓形</div>
                          )}
                          <div>
                            <div className="font-bold text-craft-text">{item.productType} ({item.size})</div>
                            <div className="text-craft-subtext">{item.finish} • 數量: {item.quantity} 個</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-craft-accent">NT$ {item.totalPrice.toLocaleString()}</div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. 訂購人收件資料表單 */}
              {cartItems.length > 0 && (
                <form onSubmit={handleSubmitOrder} className="space-y-4 pt-4 border-t border-craft-border">
                  <h4 className="text-sm font-semibold text-craft-text">收件人資料</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-craft-subtext mb-1">姓名</label>
                      <input
                        type="text"
                        required
                        placeholder="請輸入訂購人姓名"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-craft-border bg-craft-bg text-xs focus:ring-2 focus:ring-craft-accent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-craft-subtext mb-1">聯絡電話</label>
                      <input
                        type="tel"
                        required
                        placeholder="0912-345-678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-craft-border bg-craft-bg text-xs focus:ring-2 focus:ring-craft-accent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-craft-subtext mb-1">收件地址 / 超商門市名稱</label>
                    <input
                      type="text"
                      required
                      placeholder="請輸入宅配地址或 7-11/全家 門市店名與店號"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-craft-border bg-craft-bg text-xs focus:ring-2 focus:ring-craft-accent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-craft-subtext mb-1">備註說明 (選填)</label>
                    <textarea
                      rows={2}
                      placeholder="特殊交期或包裝注意事項"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-craft-border bg-craft-bg text-xs focus:ring-2 focus:ring-craft-accent outline-none"
                    />
                  </div>

                  {/* 結帳總計與送出 */}
                  <div className="pt-3 border-t border-craft-border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-craft-subtext">應付總金額：</span>
                      <span className="text-xl font-bold text-craft-accent font-serif ml-1">
                        NT$ {totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-craft-text text-white text-xs font-bold rounded-xl shadow-md hover:bg-craft-text/90 transition-all"
                    >
                      確認提交訂單
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
