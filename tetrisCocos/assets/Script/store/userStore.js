//  游戏配置 相关的数据存储

const NOTIFICATION = require('./notification')
const ACTIONS = require('./actions')
import storage from '../util/storage'


class userStore {
  constructor() {
    this._userInfo = null
    this._score = 0
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new userStore()
    }
    return this.instance
  }

  set userInfo (val) {
    this._userInfo = val
    storage.set('userInfo', val)
    NOTIFICATION.emit(ACTIONS.CHANGE_USER_INFO, val)
  }

  get userInfo() {
    return this._userInfo
  }

  set score (val) {
    this._score = val
    NOTIFICATION.emit(ACTIONS.CHANGE_SCORE, val)
  }

  get score () {
    return this._score
  }
}

module.exports = userStore
