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
   
   
    // db.collection('users').where({
    //   _openid: wxContext.OPENID
    // }).get().then(res => {
    //   if (res.data && res.data.length) {
    //     resolve({
    //       errorCode: 0,
    //       data: res.data[0]
    //     })
    //   } else {
    //     reject()
    //   }
    // }).catch((err) => {
    //   // 无数据
    //   return initUserInfo()

    // })
  })

  // return {
  //   errorCode: 0,
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
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

// // 云函数入口函数
// exports.main = async ({ openid }) => {
//   console.log('openid', openid)
//   const db = cloud.database()

//   return new Promise((resolve, reject) => {
//     db.collection('scores').where({
//       openid: openid // 填入当前用户 openid
//     }).get().then(res => {
//       let result = null
//       if (res.data && res.data.length) {
//         result = {
//           errorCode: 0,
//           data: res.data[0]
//         }
//       } else {
//         result = {
//           errorCode: 1
//         }
//       }
//       resolve(result)
//     })
//   })
  
// }