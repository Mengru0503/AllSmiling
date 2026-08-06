import React, { useState } from 'react';
import { X, Trash2, CheckCircle2, CreditCard, Truck, User, Phone, MapPin, Sparkles, Grid } from 'lucide-react';
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

    const newId = 'SC-' + Math.floor(100000 + Math.random() * 900000);
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

    confetti({
      particleCount: 90,
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
            {isSuccess ? '訂單提交成功！' : '相片磁鐵購物車與結帳'}
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
                <div className="font-bold border-b border-craft-border pb-1">匯款資訊 (付款後 2 工作日內寄出)：</div>
                <div>銀行代碼：822 中國信託</div>
                <div>帳號：1234-5678-9012</div>
                <div>戶名：兜笑了 AllSmiling (SunCloud風格磁鐵)</div>
                <div className="text-craft-accent font-medium">完成匯款後，店家後台將直接依據您裁切好之 5*5cm 圖檔開始排單印製。</div>
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
                    購物車目前是空的，請上傳照片並選擇套組點擊「加入購物車」。
                  </div>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-3.5 rounded-2xl bg-craft-bg border border-craft-border text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-craft-text text-sm">{item.productType}</div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-craft-accent text-sm">NT$ {item.totalPrice.toLocaleString()}</span>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* 客製照片預覽圖 */}
                        {item.imageDataUrls && item.imageDataUrls.length > 0 && (
                          <div className="flex items-center gap-2 overflow-x-auto py-1">
                            {item.imageDataUrls.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`相片 ${idx + 1}`}
                                className="w-10 h-10 aspect-square rounded-lg object-cover border border-white shadow-sm shrink-0"
                              />
                            ))}
                          </div>
                        )}

                        <div className="text-[11px] text-craft-subtext space-y-0.5 pt-1 border-t border-craft-border/50">
                          <div>• 公開分享意願：{item.shareConsent}</div>
                          <div>• 版面處理：{item.cropPreference}</div>
                          <div>• 包裝方式：{item.packagingType}</div>
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
                      <label className="block text-xs font-medium text-craft-subtext mb-1">訂購人姓名 *</label>
                      <input
                        type="text"
                        required
                        placeholder="請輸入收件者姓名"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-craft-border bg-craft-bg text-xs focus:ring-2 focus:ring-craft-accent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-craft-subtext mb-1">聯絡電話 *</label>
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
                    <label className="block text-xs font-medium text-craft-subtext mb-1">收件地址 / 超商門市店號 *</label>
                    <input
                      type="text"
                      required
                      placeholder="請填寫完整寄送地址或 7-11/全家 店名門市"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-craft-border bg-craft-bg text-xs focus:ring-2 focus:ring-craft-accent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-craft-subtext mb-1">
                      備註欄 (若需分開包裝或特殊交期請填寫於此)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="例：兩組請幫我分開裝入獨立小袋..."
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
