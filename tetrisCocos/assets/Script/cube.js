
import { BLOCK_SIZE, DIRECTION, BORDER, LEN } from './util/const'
import storage from './util/storage'
cc.Class({
  extends: cc.Component,

  properties: {
     Item: {
       type: cc.Prefab,
       default: null
     }
  },

  ctor () {
    this.arr = null
    this.panelComp = null
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.panelComp = cc.find('Canvas/panel').getComponent('panel')
  },



  drawCube (arr) {
     // 根据方块类型 绘制方块
     this.node.removeAllChildren()
     this.arr = arr
     for (let i = 0; i <= arr.length - 1; i++) {
       for (let j = 0; j <= arr[0].length - 1; j++) {
           if (arr[i][j] === 1) {
              let item = this.drawItem(i, j)
              this.node.addChild(item)
           }
       }
     }
  },

  drawItem (i, j) {
    let _x = i * BLOCK_SIZE
    let _y = -j * BLOCK_SIZE
    let item = cc.instantiate(this.Item)
    item.x = _x
    item.y = _y
    return item
  },

  /**
   * 顺时针旋转矩阵
   * @param arr 需要旋转的矩阵
   * @returns {{newArr: Array, lefts: Array, tops: Array}}
   */
  clockWise () {
    // 边界判断
    let _x = this.node.x
    let _y = this.node.y
    // let _width = this.node.width
    // let _height = this.node.height
    // if (_height + _x > BORDER.RIGHT || _y - _width < BORDER.BOTTOM) {
    //   return
    // }

    let newArr = []
    let cubePos = []
    let arr = this.arr
    for (let i = 0; i < arr[0].length; i++) {
      let item = []
      for (let j = arr.length - 1; j >= 0; j--) {
        item.push(arr[j][i])
        if (arr[j][i]) {
          let col = (_x - BORDER.LEFT) / BLOCK_SIZE + i
          let row = (BORDER.TOP - _y) / BLOCK_SIZE + j
          cubePos.push(`${row}_${col}`)
        }
      }
      newArr.push(item)
    }

    if (!this.checkBorder(cubePos)) {
      return
    }
    // 同步给主流程
    cc.find('Canvas').getComponent('game').arr = newArr
    this.drawCube(newArr)
  },

  /** 判断边界
   * 类型 旋转 旋转之后的数组是否有重叠，是否溢出
   * clockwise move init 的时候都得判断,
   * 参数 cubePos计算出相应动作后cube的位置，cubePos = ['i_j']
   * */ 
  checkBorder (cubePos = []) {
    let panelArr = this.panelComp.arr
    let canMove = true
    for (let n = 0; n < cubePos.length; n++) {
      let i = cubePos[n].split('_')[0]
      let j = cubePos[n].split('_')[1]
      if (i > LEN.ROW_LEN - 1 || j > LEN.COL_LEN - 1 || j < 0 || panelArr[i][j]) {
        canMove = false
        break
      }
    }
    return canMove
  },

  // 移动
  move (direction) {
    // 判断边界
    let _x = this.node.x
    let _y = this.node.y
    // let _width = this.node.width
    // let _height = this.node.height
    switch (direction) {
      case DIRECTION.LEFT:
        // if (_x <= BORDER.LEFT) {
        //   return
        // }
        _x -= BLOCK_SIZE
        break
      case DIRECTION.RIGHT:
        // if (_x + _width >= BORDER.RIGHT) {
        //   return
        // }
        _x += BLOCK_SIZE
        break
      case DIRECTION.BOTTOM:
        // if (_y - _height <= BORDER.BOTTOM) {
        //   this.moveToBottom()
        //   return
        // }
        _y -= BLOCK_SIZE
        break
      default:
        _y -= BLOCK_SIZE
    }

    let cubePos = []
    for (let i = 0; i <= this.arr.length - 1; i++) {
      for (let j = 0; j <= this.arr[0].length - 1; j++) {
          if (this.arr[i][j] === 1) {
            let col = (_x - BORDER.LEFT) / BLOCK_SIZE + i
            let row = (BORDER.TOP - _y) / BLOCK_SIZE + j
            cubePos.push(`${row}_${col}`)
          }
      }
    }
    // 不能移动      
    if (!this.checkBorder(cubePos)) {
      // 如果方向是往下，生成新的
      if (direction === DIRECTION.BOTTOM) {
        this.moveToBottom()
      }
      return
    }
   
    this.node.x = _x
    this.node.y = _y
  },

  // 结束到底部
  moveToBottom () {
    let _x = this.node.x
    let _y = this.node.y

    let cubePos = []
    let overFlag = false
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr[i].length; j++) {
        if (this.arr[i][j]) {
          let col = (_x - BORDER.LEFT) / BLOCK_SIZE + i
          let row = (BORDER.TOP - _y) / BLOCK_SIZE + j
          if (row === 0) {
            overFlag = true
          }
          cubePos.push(`${row}_${col}`)
        }
      } 
    }
    cc.find('Canvas').getComponent('game').stopCountDown({ cubePos, overFlag})
    return cubePos
  },

  start () {

  },

  // update (dt) {},
});
