import { CUBE, DIRECTION } from './util/const'
const NOTIFICATION = require('./store/notification')
const ACTIONS = require('./store/actions')
const UI_ctrl = require('./util/Ui_ctrl')

cc.Class({
    // extends: cc.Component,
    extends: UI_ctrl,

    properties: {
    
    },

    ctor () {
        this.arr = null
        this.nextArr = null
        this.cubeComp = null
        this.nextCubeComp = null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //
       
        UI_ctrl.prototype.onLoad.call(this)
        window.GAME_VIEW = this.view
        // 初始化
        this.userStore = require('./store/userStore').getInstance()

        this.cubeComp = this.view['cube'].getComponent('cube')
        this.nextCubeComp = this.view['info/next/cube'].getComponent('cube')

        this.initFetch()
        this.initEventBind()
    },

    start () {
        this.initCube()
    },

    initFetch () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            wx.cloud.init({
                env: wx.cloud.DYNAMIC_CURRENT_ENV
            })
            // 从本地获取用户信息，本地为undefined，从服务器取
            let userInfo = this.userStore.userInfo
            console.log('initFetch userInfo', userInfo)
            if (userInfo && userInfo.openid) {
                this.handleUserData()
            } else {
                this.fetchUserData()
            }
        }
    },


    fetchUserData () {  
        console.log('fetchUserData')
        wx.cloud.callFunction({
            name: 'getUserInfo'
        }).then(({result}) => {
            console.log(result)
            if (result && +result.errorCode === 0) {
                this.handleUserData(result.data)
            }
        })
    },

    handleUserData (userInfo) {
        this.userStore.userInfo = userInfo
        // cc.find('Canvas/info/highscore/text').getComponent(cc.Label).string = userInfo.highScore
    },

    initEventBind () {
        this.view['option/btnDrit'].on(
            cc.Node.EventType.TOUCH_END,
            function() {          
                this.cubeComp.clockWise()
            }.bind(this)
        )

        this.view['option/left'].on(
            cc.Node.EventType.TOUCH_END,
            function() {          
                this.stopCountDown()
                this.cubeComp.move(DIRECTION.LEFT)
                this.countDown()
            }.bind(this)
        )

        this.view['option/right'].on(
            cc.Node.EventType.TOUCH_END,
            function() {        
                this.stopCountDown()
                this.cubeComp.move(DIRECTION.RIGHT)
                this.countDown()
            }.bind(this)
        )

        this.view['option/bottom'].on(
            cc.Node.EventType.TOUCH_END,
            function() {          
                this.cubeComp.move(DIRECTION.BOTTOM)
            }.bind(this)
        )

        this.view['option/reset'].on(
            cc.Node.EventType.TOUCH_END,
            function() {          
                this.initCube()
            }.bind(this)
        )

        this.view['over/layer'].on(
            cc.Node.EventType.TOUCH_END,
            function() {          
                e.stopPropagation()
            }.bind(this)
        )

        this.view['over/reset'].on(
            cc.Node.EventType.TOUCH_END,
            function() {          
                this.newStart()
            }.bind(this)
        )

        NOTIFICATION.on(ACTIONS.CHANGE_USER_INFO, function (userInfo) {
            console.log('监听userinfochange')
            cc.find('Canvas/info/highscore/text').getComponent(cc.Label).string = userInfo.highScore
        }, this)

        NOTIFICATION.on(ACTIONS.CHANGE_SCORE, function (score) {
            console.log('监听score change')
            cc.find('Canvas/info/score/text').getComponent(cc.Label).string = score
        }, this)
        
    },

    initCube () {
        let cube = this.view['cube']
        cube.x = -180
        cube.y = 540

        this.stopCountDown()
        this.arr = this.nextArr || CUBE[Math.floor(Math.random() * CUBE.length)]
        this.cubeComp.drawCube(this.arr)
        this.nextArr = CUBE[Math.floor(Math.random() * CUBE.length)]
        this.nextCubeComp.drawCube(this.nextArr)
        this.countDown()
    },

    stopCountDown ({cubePos = [], overFlag} = {}) {
        clearTimeout(this.timer)  
        if (overFlag) {
            this.gameOver()
        } else if (cubePos.length) {
            this.view['panel'].getComponent('panel').drawPanel({ cubePos })
            this.initCube()
        }
    },
 

    countDown () {
        this.timer = setTimeout(() => {
            this.countDown()
            this.cubeComp.move(DIRECTION.BOTTOM)
        }, 800);
    },

    gameOver () {
        this.stopCountDown()
        this.updateHighScore()
        this.view['over'].active = true
    },

    onDestroy () {
        this.updateHighScore()
    },

    updateHighScore () {
        let score = this.userStore.score
        let userInfo = this.userStore.userInfo
        let highScore = userInfo.highScore
        console.log('调用updateHighScore',userInfo,highScore, score)
        if (score > highScore) {
            console.log('调用updateHighScore', score)
            wx.cloud.callFunction({
              name: 'updateScore',
              data: {
                highScore: score
              }
            })
            this.userStore.userInfo = userInfo
        }
        this.userStore.score = 0
    },

    newStart() {
        this.view['over'].active = false
        this.view['panel'].getComponent('panel').clearPanel()
        this.initCube()
    }

    // update (dt) {},
});
