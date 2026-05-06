// 千分號
export function currency(num) {
  // 將傳進來的參數num轉成數字型別
  const n = Number(num)
  // 如果n是NaN，回傳空字串
  if (Number.isNaN(n)) return ''
  // ✔ toLocaleString() 預設會幫你做數字格式化
  // ✔ - 依指定地區格式化數字（通常會加千分位分隔符號）
  // ✔ - 這裡指定使用 'en-US'，確保分隔符號為逗號
  return n.toLocaleString('en-US')
}

// 轉換時間格式
export function date(time) {
  // new Date(time * 1000)
  // - new Date()  產生一個日期物件
  // - 後端常給：秒（Unix timestamp），但JS Date 要：毫秒
  const localDate = new Date(time * 1000)
  // toLocaleDateString()
  // - 轉成「當地格式日期」
  return localDate.toLocaleDateString()
}
