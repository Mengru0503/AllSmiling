import React, { useState } from 'react';
import { ShieldCheck, Download, Lock, KeyRound, Search, Calendar, User, Phone, CheckCircle, Package } from 'lucide-react';

export default function AdminPanel({ orders = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 登入驗證
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'admin') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('密碼錯誤！請使用預設管理密碼：admin123');
    }
  };

  // 下載顧客裁切好的高解析圖片檔
  const handleDownloadImage = (dataUrl, orderId, index) => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `實體壓模圖檔_${orderId}_項目${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-craft-md border border-craft-border max-w-6xl mx-auto my-8">
      
      {/* 標題與登入狀態 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-craft-border">
        <div>
          <h3 className="text-xl font-bold font-serif text-craft-text flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-craft-accent" />
            甲方商家管理後台 (Admin Panel)
          </h3>
          <p className="text-xs text-craft-subtext mt-1">
            供店家檢視訂單資訊，並下載顧客線上裁切好的 300DPI 高解析圖檔進行實體壓模製作。
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-xl border border-craft-border text-xs text-craft-subtext hover:bg-craft-bg"
          >
            登出後台
          </button>
        )}
      </div>

      {/* 未登入登入卡片 */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto py-12 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-craft-primary/20 text-craft-text flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-craft-text">請輸入商家管理密碼</h4>
            <p className="text-xs text-craft-subtext mt-1">預設密碼為：<code className="bg-craft-bg px-2 py-0.5 rounded font-mono font-bold text-craft-accent">admin123</code></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-craft-subtext absolute left-3 top-3" />
              <input
                type="password"
                placeholder="請輸入密碼"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-craft-border bg-craft-bg text-sm focus:ring-2 focus:ring-craft-accent outline-none"
              />
            </div>

            {errorMsg && <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">{errorMsg}</div>}

            <button
              type="submit"
              className="w-full py-2.5 bg-craft-text text-white font-medium text-xs rounded-xl shadow-md hover:bg-craft-text/90"
            >
              進入管理後台
            </button>
          </form>
        </div>
      ) : (
        /* 已登入訂單列表管理區 */
        <div className="space-y-6 pt-6">
          
          {/* 搜尋與統計欄 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-xs">
              <Search className="w-4 h-4 text-craft-subtext absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜尋訂單編號、姓名或電話..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-craft-border bg-craft-bg text-xs focus:ring-2 focus:ring-craft-accent outline-none"
              />
            </div>
            <div className="text-xs text-craft-subtext font-medium">
              總訂單數：<span className="font-bold text-craft-text">{orders.length}</span> 筆
            </div>
          </div>

          {/* 訂單卡片清單 */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-craft-bg rounded-2xl border border-dashed border-craft-border text-craft-subtext text-xs">
              目前尚無任何訂單紀錄。請先於前台進行測試下單。
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="p-5 rounded-2xl bg-craft-bg border border-craft-border space-y-4">
                  
                  {/* 訂單頭資訊 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-craft-border/60 pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-craft-accent text-white text-xs font-mono font-bold rounded-lg">
                        {order.orderId}
                      </span>
                      <span className="text-xs text-craft-subtext flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {order.createdAt}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-craft-accent font-serif">
                      訂單總額：NT$ {order.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* 顧客與寄送資訊 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-craft-text">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-craft-subtext" />
                      <span>收件人：<strong>{order.customerName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-craft-subtext" />
                      <span>電話：<strong>{order.phone}</strong></span>
                    </div>
                    <div className="sm:col-span-3 text-craft-subtext">
                      收件地址：{order.address} {order.note && `(備註: ${order.note})`}
                    </div>
                  </div>

                  {/* 訂購項目與高解析圖檔下載 */}
                  <div className="space-y-2 pt-2 border-t border-craft-border/40">
                    <div className="text-xs font-semibold text-craft-text flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> 包含之客製產品與實體印刷圖檔：
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-craft-border flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {item.imageDataUrl ? (
                              <img
                                src={item.imageDataUrl}
                                alt="裁切原圖"
                                className="w-14 h-14 rounded-full object-cover border border-craft-border shadow-sm shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-xs text-stone-400 shrink-0">
                                無圖
                              </div>
                            )}
                            <div className="text-xs">
                              <div className="font-bold text-craft-text">{item.productType}</div>
                              <div className="text-craft-subtext">規格: {item.size} • {item.finish}</div>
                              <div className="text-craft-subtext">數量: <strong>{item.quantity}</strong> 個</div>
                            </div>
                          </div>

                          {/* 下載原圖按鈕 */}
                          {item.imageDataUrl && (
                            <button
                              onClick={() => handleDownloadImage(item.imageDataUrl, order.orderId, idx)}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl shadow-sm transition-all flex items-center gap-1 shrink-0"
                              title="下載高解析度原檔以進行實體切圓壓模"
                            >
                              <Download className="w-3.5 h-3.5" />
                              下載印製圖檔
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
