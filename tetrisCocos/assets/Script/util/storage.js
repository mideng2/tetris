export default {
  set: function (key, data) {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.setStorage({
        key,
        data,
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },

  get: function (key) {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      let data = wx.getStorageSync(key)
      return data
    } 
  }
}