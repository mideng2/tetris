export default {
  set: function (key, data) {
    wx.setStorage({
      key,
      data,
      fail: function (err) {
        console.log(err)
      }
    })
  },

  get: function (key) {
    wx.setStorage({
      key,
      fail: function (err) {
        console.log(err)
      }
    })
  }
  
}