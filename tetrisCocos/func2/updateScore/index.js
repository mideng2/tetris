// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

console.log('========================wo gai le===========================')
// 云函数入口函数
// exports.main = async (data = {}) => {
//   console.log('data', data)
//   const db = cloud.database()

//   db.collection('scores').add({
//     // data 字段表示需新增的 JSON 数据
//     data,
//     success: function(res) {
//       // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
//       console.log(res)
//       return {
//         errorCode: 0,
//         data: res
//       }
//     }
//   })
// }

exports.main = async (highScore = 0) => {
  console.log('update score highscore', highScore)
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  // db.collection('scores').add({
  //   // data 字段表示需新增的 JSON 数据
  //   data,
  //   success: function(res) {
  //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
  //     console.log(res)
  //     return {
  //       errorCode: 0,
  //       data: res
  //     }
  //   }
  // })


  db.collection('users').where({
    _openid: wxContext.OPENID
  }).update({
    // data 传入需要局部更新的数据
    data: {
      // 表示将 done 字段置为 true
      highScore: highScore
    }
  })
  .then((res) => {
    console.log('res', res)
  })
  .catch((res) => {
    console.log('err', res)
  })
}