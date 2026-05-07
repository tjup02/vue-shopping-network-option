import emitter from './emitter.js'

// ToastMessage訊息判斷
export default function (res, title = '更新') {
  if (res.data.success) {
    // 如果成功，toast元件內容:
    emitter.emit('push-message', {
      style: 'primary',
      title: `${title}成功`,
    })
  } else {
    const message = typeof res.data.message === 'string' ? [res.data.message] : res.data.message

    // 如果執行失敗，toast元件內容:
    emitter.emit('push-message', {
      style: 'danger',
      title: `${title}失敗`,
      content: message.join('、'),
      // { "success": false, "message": "您所查看的API不存在 >_<" }
    })
  }
}
