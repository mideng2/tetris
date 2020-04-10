// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return new Promise((resolve, reject) => {
    db.collection('users').where({
      _openid: wxContext.OPENID
    }).get().then(res => {
      console.log('getUinfo res', res)
      if (res.data && res.data.length) {
        resolve({
          errorCode: 0,
          data: res.data[0]
        })
      } else {
        initUserInfo().then((result) => {
          resolve({
            errorCode: 0,
            data: result
          })
        })
      }
    })
  })
}


function initUserInfo () {
  const wxContext = cloud.getWXContext()

  let data = {
    _openid: wxContext.OPENID,
    highScore: 0
  }
  console.log('initUser data', data)
  return new Promise((resolve, reject) => {
    db.collection('users').add({
      data
    }).then((res) => {
      console.log('users add 返回值', res)
      resolve(data)
    })
  })
}
