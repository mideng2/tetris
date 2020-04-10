// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


exports.main = async (event) => {
 
  return new Promise((resolve, reject) => {
    console.log('update score event', event)
    const wxContext = cloud.getWXContext()
    const db = cloud.database()
    console.log('wxContext.OPENID', wxContext.OPENID)
    db.collection('users').where({
      _openid: wxContext.OPENID
    }).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        highScore: event.highScore
      },
      success: function (res) {
        console.log('succ', res)
        resolve(res)
      },
      fail: function (err) {
        console.log('fail', err)
        resolve(err)
      }
    })
  })
  
}