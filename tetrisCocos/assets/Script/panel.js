
import { BLOCK_SIZE, DIRECTION, BORDER, LEN } from './util/const'
cc.Class({
  extends: cc.Component,

  properties: {
    Item: {
      type: cc.Prefab,
      default: null
    }
  },

  ctor () {
    this.arr = Array.from({length:LEN.ROW_LEN}, () => Array.from({length:LEN.COL_LEN}, () => 0))
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.userStore = require('./store/userStore').getInstance()
  },

  // 更新数组 9 * 21 
  // cubePos存放cube元素是第几个，横着数
  // reset 清空画布，根据数组重新绘制

  drawPanel ({cubePos = [], reset = false}) {
    let rowLen = LEN.ROW_LEN // 21
    let colLen = LEN.COL_LEN // 9
    if (reset) {
      this.node.removeAllChildren()
    }
    let arr = this.arr
    let delArr = [] // 要删除的行
    for (let i = 0; i < rowLen; i++) {
      for (let j = 0; j < colLen; j++) {
         // reset 清空画布，根据数组重新绘制
        if (reset && arr[i][j]) {  
          let item = this.drawItem(j, i)
          this.node.addChild(item)
        // } else if (arr[i][j] === 0 && cubePos.includes(i * colLen + (j + 1))) {
        } else if (arr[i][j] === 0 && cubePos.includes(`${i}_${j}`)) {
          // 根据cubePos 更新绘制 原来是0 并且新cube包含
          let item = this.drawItem(j, i)
          this.node.addChild(item)
          arr[i][j] = 1
        }
      }
      // 第i行全都是方块
      if (!arr[i].includes(0)) {
        delArr.push(i)
      }
    }    
    this.arr = arr
    // 如果有满行的删除整行
    delArr.length && this.deleteLine(delArr)
  },

  drawItem (i, j) {
    let _x = i * BLOCK_SIZE
    let _y = -j * BLOCK_SIZE
    let item = cc.instantiate(this.Item)
    item.x = _x
    item.y = _y
    return item
  },

  // 删除 满行，更新panelArr
  deleteLine (delArr = []) {
    for(let i = 0; i < delArr.length; i++) {
      this.arr.splice(delArr[i], 1)
      this.arr.unshift(Array.from({length:LEN.COL_LEN}, () => 0))
    }
    this.drawPanel({ reset: true })
    this.userStore.score = this.userStore.score + delArr.length
    // cc.find('Canvas/info/score/text').getComponent(cc.Label).string = score
  },

  clearPanel () {
    this.node.removeAllChildren()
    this.arr = Array.from({length:LEN.ROW_LEN}, () => Array.from({length:LEN.COL_LEN}, () => 0))
  },


  start () {

  },

  // update (dt) {},
});
