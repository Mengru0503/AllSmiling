import React, { useState } from 'react';
import { ShieldCheck, Download, Lock, KeyRound, Search, Calendar, User, Phone, CheckCircle, Package, Grid } from 'lucide-react';

export default function AdminPanel({ orders = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'admin') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('密碼錯誤！預設管理密碼為：admin123');
    }
  };

  // 批量下載該項目所有 5*5cm 高解析印製原檔
  const handleBatchDownloadImages = (urls, orderId, itemIdx) => {
    if (!urls || urls.length === 0) return;
    urls.forEach((url, photoIdx) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `50mm正方形磁鐵印製圖檔_${orderId}_項目${itemIdx + 1}_相片${photoIdx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, photoIdx * 300);
    });
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-craft-md border border-craft-border max-w-6xl mx-auto my-8">
      
      {/* 標題 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-craft-border">
        <div>
          <h3 className="text-xl font-bold font-serif text-craft-text flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-craft-accent" />
            商家管理後台 (5cm × 5cm 相片磁鐵專用)
          </h3>
          <p className="text-xs text-craft-subtext mt-1">
            檢視顧客 50mm 正方形磁鐵訂單，並可一鍵打包下載顧客線上裁切好的 300DPI 印刷用 PNG 原檔。
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

      {!isAuthenticated ? (
        /* 登入卡片 */
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
        /* 訂單清單 */
        <div className="space-y-6 pt-6">
          
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

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-craft-bg rounded-2xl border border-dashed border-craft-border text-craft-subtext text-xs">
              目前尚無任何訂單紀錄。請先於前台測試上傳圖片下單。
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="p-5 rounded-2xl bg-craft-bg border border-craft-border space-y-4">
                  
                  {/* 標題與金額 */}
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
                      應收總金額：NT$ {order.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* 收件者資料 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-craft-text">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-craft-subtext" />
                      <span>訂購人：<strong>{order.customerName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-craft-subtext" />
                      <span>電話：<strong>{order.phone}</strong></span>
                    </div>
                    <div className="sm:col-span-3 text-craft-subtext">
                      寄送地址/門市：{order.address} {order.note && <span className="text-amber-800 font-bold ml-2">(備註: {order.note})</span>}
                    </div>
                  </div>

                  {/* 項目與相片清單 */}
                  <div className="space-y-3 pt-2 border-t border-craft-border/40">
                    <div className="text-xs font-semibold text-craft-text flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> 客製正方形磁鐵明細與印刷原檔：
                    </div>
                    
                    {order.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-4 bg-white rounded-2xl border border-craft-border space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2 text-xs">
                          <div>
                            <span className="font-bold text-craft-text text-sm">{item.productType}</span>
                            <div className="text-craft-subtext mt-0.5">
                              分享意願: <strong>{item.shareConsent}</strong> • 包裝: {item.packagingType} • {item.cropPreference}
                            </div>
                          </div>

                          {/* 下載該項目所有 5*5cm 相片圖檔 */}
                          {item.imageDataUrls && item.imageDataUrls.length > 0 && (
                            <button
                              onClick={() => handleBatchDownloadImages(item.imageDataUrls, order.orderId, itemIdx)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              一鍵下載全部 {item.imageDataUrls.length} 張 50mm 印刷檔 (PNG)
                            </button>
                          )}
                        </div>

                        {/* 縮圖網格 */}
                        {item.imageDataUrls && item.imageDataUrls.length > 0 ? (
                          <div className="grid grid-cols-6 gap-2">
                            {item.imageDataUrls.map((url, photoIdx) => (
                              <div key={photoIdx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                                <img src={url} alt={`照片 ${photoIdx + 1}`} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 inset-x-0 bg-stone-900/70 text-white text-[9px] text-center py-0.5">
                                  #{photoIdx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-stone-400">示範項目：無上傳圖片</div>
                        )}
                      </div>
                    ))}
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
