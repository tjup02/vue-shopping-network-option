// 為了讓所有檔案都可以用到同一個mitt，我們在這裡新增檔案emitter.js

import mitt from 'mitt'

const emitter = mitt()

export default emitter
