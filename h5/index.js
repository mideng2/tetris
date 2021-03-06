/**
 * Created by llan on 2017/1/11.
 */
'use strict';
/**
 * 方块
 * @param params
 */
class Block {
    constructor(params) {
        //方块矩阵
        this.arr = params.arr;
        //当前方块左,上偏移量
        this.curLeft = params.curLeft;
        this.curTop = params.curTop;
        //下一个落下方块矩阵
        this.nextArr = params.nextArr;
        //方块大小
        this.BLOCK_SIZE = params.BLOCK_SIZE;
        //当前画布大小
        this.siteSize = params.siteSize;
        //历史最高得分
        this.highestScore = params.highestScore;
        //方块下落速度
        this.delay = params.delay;
    }

    /**
     * 画当前方块
     * @param i
     * @param j
     * @param className 创建方块的className
     * @param el 容纳方块的element
     */
    draw(i, j, className, el) {
        let left = className === 'nextModel' ? (j + 1) * this.BLOCK_SIZE - (this.siteSize.left + this.siteSize.width / 2 - this.BLOCK_SIZE) : j * this.BLOCK_SIZE;
        let top = className === 'nextModel' ? (i + 1) * this.BLOCK_SIZE - this.siteSize.top : i * this.BLOCK_SIZE;
        let model = document.createElement('div');
        model.className = className;
        model.style.left = `${left}px`;
        model.style.top = `${top}px`;
        el.appendChild(model);
    };

    /**
     * 顺时针旋转矩阵
     * @param arr 需要旋转的矩阵
     * @returns {{newArr: Array, lefts: Array, tops: Array}}
     */
    clockwise(arr) {
        let newArr = [];
        for (let i = 0; i < arr[0].length; i++) {
            let temArr = [];
            for (let j = arr.length - 1; j >= 0; j--) {
                temArr.push(arr[j][i]);
            }
            newArr.push(temArr);
        }
        let lefts = [],
            tops = [];
        this.checkArrWith1(newArr, function (i, j) {
            lefts.push(j * this.BLOCK_SIZE);
            tops.push(i * this.BLOCK_SIZE);
        });
        return {
            newArr: newArr,
            lefts: lefts,
            tops: tops
        };
    };

    /**
     * 判断数组中值为1的下标
     * @param arr 需要判断的数组
     * @param callback 需要执行的回调函数
     * @param className 作为draw回调函数的参数
     * @param el 作为draw回调函数的参数
     */
    checkArrWith1(arr, callback, className, el) {
        for (let i = 0; i <= arr.length - 1; i++) {
            for (let j = 0; j <= arr[0].length - 1; j++) {
                if (arr[i][j] === 1) {
                    callback.call(this, i + this.curTop, j + this.curLeft, className, el);
                }
            }
        }
    };

    /**
     * 获取当前方块能到达的边界
     * @param curLeft 当前方块left
     * @param curTop 当前方块top
     * @returns {*} 返回左右下边界
     */
    getInterval(curLeft, curTop) {
        let inactiveModel = document.querySelectorAll('.inactiveModel');
        if (inactiveModel.length === 0) {
            return {
                highest: this.siteSize.top + this.siteSize.height,
                leftmost: this.siteSize.left - this.BLOCK_SIZE,
                rightmost: this.siteSize.left + this.siteSize.width
            };
        } else {
            let tops = [],
                lefts = [],
                rights = [],
                highest = null,
                leftmost = null,
                rightmost = null;
            for (let v of inactiveModel) {
                let left = v.style.left;
                let top = v.style.top;
                if (left === curLeft) {
                    tops.push(top);
                }
                if (top === curTop) {
                    if (left < curLeft) {
                        lefts.push(left);
                    } else if (left > curLeft) {
                        rights.push(left);
                    }
                }
            }
            if (tops.length === 0) {
                highest = this.siteSize.top + this.siteSize.height;
            } else {
                tops = Array.from(tops, top => parseInt(top));
                highest = Math.min(...tops);
            }
            if (lefts.length === 0) {
                leftmost = this.siteSize.left - this.BLOCK_SIZE;
            } else {
                lefts = Array.from(lefts, left => parseInt(left));
                leftmost = Math.max(...lefts);
            }
            if (rights.length === 0) {
                rightmost = this.siteSize.left + this.siteSize.width
            } else {
                rights = Array.from(rights, right => parseInt(right));
                rightmost = Math.min(...rights);
            }
            return {
                highest: highest,
                leftmost: leftmost,
                rightmost: rightmost
            };
        }
    };

    /**
     * 判断当前方块是否能移动||变形
     * @param arr 将要判断的方块
     * @param deform 是否需要变形
     * @param displacement 位移
     * @param move
     * @returns
     */
    canMove(arr, displacement = 1, deform = false, move = {
        canMoveRight: true,
        canMoveDown: true,
        canMoveLeft: true,
        moveDownDivide: []
    }) {
        this.checkArrWith1(arr, function (i, j) {
            let {highest, leftmost, rightmost} = this.getInterval(`${j * this.BLOCK_SIZE}px`, `${i * this.BLOCK_SIZE}px`);
            if (deform) {
                if (this.BLOCK_SIZE * (j + 1) > rightmost) {
                    move.canMoveRight = false;
                }
                if (this.BLOCK_SIZE * (i + displacement) > highest) {
                    move.canMoveDown = false;
                    move.moveDownDivide.push(highest - this.BLOCK_SIZE * (i + 1));
                }
                if (this.BLOCK_SIZE * (j - 1) < leftmost) {
                    move.canMoveLeft = false;
                }
            } else {
                if (this.BLOCK_SIZE * (j + 1) >= rightmost) {
                    move.canMoveRight = false;
                }
                if (this.BLOCK_SIZE * (i + displacement) >= highest) {
                    move.canMoveDown = false;
                    move.moveDownDivide.push(highest - this.BLOCK_SIZE * (i + 1));
                }
                if (this.BLOCK_SIZE * (j - 1) <= leftmost) {
                    move.canMoveLeft = false;
                }
            }
        });
        return move;
    };

    /**
     * 消除砖块
     * @returns {Array} 返回每一行的元素数组,个数,高度
     */
    eliminate() {
        let res = [],
            inactiveModels = [...document.querySelectorAll('.inactiveModel')];
        inactiveModels.sort(function (a, b) {
            return parseInt(a.style.top) - parseInt(b.style.top);
        });
        for (let i = 0; i < inactiveModels.length;) {
            let count = 0,
                models = [];
            for (let j = 0; j < inactiveModels.length; j++) {
                if (inactiveModels[i].style.top === inactiveModels[j].style.top) {
                    count++;
                    models.push(inactiveModels[j]);
                }
            }
            res.push({
                models: models,
                count: count,
                top: parseInt(inactiveModels[i].style.top)
            });
            i += count;
        }
        return res;
    };

    /**
     * 当灰色砖块高于画布高偏移量,游戏结束
     * @returns {boolean}
     */
    gameOver() {
        const inactiveModels = document.querySelectorAll('.inactiveModel');
        let tops = [];
        for (let v of inactiveModels) {
            tops.push(parseInt(v.style.top));
        }
        return Math.min(...tops) <= this.siteSize.top;
    };

    /**
     * gameOver填充动画
     * @param curTop
     * @param curLeft
     */
    static fill(curTop, curLeft) {
        let model = document.createElement('div');
        model.className = 'inactiveModel';
        model.style.left = `${curLeft}px`;
        model.style.top = `${curTop}px`;
        document.body.appendChild(model);
    };

    /**
     * 当前掉落方块初始化
     */
    init() {
        //清除下一个方块
        let next = document.querySelector('#next');
        next.innerHTML = null;
        //画出当前方块
        this.checkArrWith1(this.arr, this.draw, 'activityModel', document.body);
        //画出下一个方块
        this.checkArrWith1(this.nextArr, this.draw, 'nextModel', next);
        //记录当前方块
        let activityModels = document.querySelectorAll('.activityModel');
        /**
         * 方块自由下落
         * @type {number}
         */
        const fallDown = setTimeout(function loop() {
            let moveDown = this.canMove(this.arr).canMoveDown;
            if (moveDown) {
                for (let v of activityModels) {
                    v.style.top = `${parseInt(v.style.top) + this.BLOCK_SIZE}px`;
                }
                this.curTop++;
                setTimeout(loop.bind(this), this.delay / window.__level__);
            } else {
                for (let i = 0; i < activityModels.length; i++) {
                    activityModels[i].className = 'inactiveModel'
                }
                let res = this.eliminate();
                for (let i = 0; i < res.length; i++) {
                    let {count, models, top} = res[i];
                    if (count === parseInt(this.siteSize.width / this.BLOCK_SIZE)) {
                        for (let j = 0; j < models.length; j++) {
                            document.body.removeChild(models[j]);
                        }
                        let inactiveModels = document.querySelectorAll('.inactiveModel');
                        for (let v of inactiveModels) {
                            if (parseInt(v.style.top) < top) {
                                v.style.top = `${parseInt(v.style.top) + this.BLOCK_SIZE}px`;
                            }
                        }
                        window.__score__ += window.__level__ * 100;
                        let score = document.querySelector('#score');
                        score.innerText = window.__score__;
                        //level最高为4
                        //升级规则为当前消除数大于等于level*10
                        if (window.__score__ - (window.__level__ - 1) * (window.__level__ - 1) * 1000 >= window.__level__ * window.__level__ * 1000 && window.__level__ <= 4) {
                            window.__level__++;
                            let level = document.querySelector('#level');
                            level.innerText = window.__level__;
                        }
                    }
                }
                if (!this.gameOver()) {
                    init(this.nextArr);
                } else {
                    console.log('Game over~');
                    next.innerHTML = null;
                    let curTop = this.siteSize.height + this.siteSize.top - this.BLOCK_SIZE,
                        curLeft = this.siteSize.width + this.siteSize.left - this.BLOCK_SIZE;
                    let fillId = setInterval(function () {
                        Block.fill(curTop, curLeft);
                        curLeft -= this.BLOCK_SIZE;
                        if (curLeft < this.siteSize.left) {
                            curLeft = this.siteSize.width + this.siteSize.left - this.BLOCK_SIZE;
                            curTop -= this.BLOCK_SIZE;
                        }
                        if (curTop < this.siteSize.top) {
                            clearInterval(fillId);
                            let restart = document.querySelector('.start-restart');
                            restart.style.display = 'block';
                            restart.onclick = (e)=> {
                                e.preventDefault();
                                restart.style.display = 'none';
                                let inactiveModels = [...document.querySelectorAll('.inactiveModel')];
                                if (inactiveModels.length > 0) {
                                    for (let v of inactiveModels) {
                                        document.body.removeChild(v);
                                    }
                                }
                                if (this.highestScore < window.__score__) {
                                    localStorage.setItem('highestScore', window.__score__);
                                    let highestScoreDiv = document.querySelector('#highest-score');
                                    highestScoreDiv.innerText = window.__score__;
                                }
                                window.__score__ = 0;
                                let score = document.querySelector('#score');
                                score.innerText = window.__score__;
                                window.__level__ = 1;
                                let level = document.querySelector('#level');
                                level.innerText = window.__level__;
                                this.init();
                            }
                        }
                    }.bind(this), 30);
                }
                clearTimeout(fallDown);
            }
        }.bind(this), this.delay / window.__level__);
        /**
         * 键盘事件
         * @param e
         */
        document.onkeydown = (e)=> {
            const key = e.keyCode;
            let move,
                canMoveLeft,
                canMoveRight,
                canMoveDown,
                moveDownDivide;
            switch (key) {
                //space
                case 32:
                    let displacement = 2;
                    move = this.canMove(this.arr, displacement);
                    canMoveDown = move.canMoveDown;
                    if (canMoveDown) {
                        for (let v of activityModels) {
                            v.style.top = `${parseInt(v.style.top) + displacement * this.BLOCK_SIZE}px`;
                        }
                        this.curTop += displacement;
                    } else {
                        moveDownDivide = Math.min(...move.moveDownDivide);
                        if (moveDownDivide >= this.BLOCK_SIZE) {
                            for (let v of activityModels) {
                                v.style.top = `${parseInt(v.style.top) + this.BLOCK_SIZE}px`;
                            }
                            this.curTop++;
                        }
                    }
                    break;
                //left
                case 37:
                    canMoveLeft = this.canMove(this.arr).canMoveLeft;
                    if (canMoveLeft) {
                        for (let v of activityModels) {
                            v.style.left = `${parseInt(v.style.left) - this.BLOCK_SIZE}px`;
                        }
                        this.curLeft--;
                    }
                    break;
                //top
                case 38:
                    let {newArr, lefts, tops} = this.clockwise(this.arr);
                    move = this.canMove(newArr, 1, true);
                    canMoveDown = move.canMoveDown;
                    canMoveRight = move.canMoveRight;
                    if (canMoveRight && canMoveDown) {
                        //记录转变后的矩阵
                        this.arr = newArr;
                        for (let i in lefts) {
                            activityModels[i].style.left = `${lefts[i]}px`;
                            activityModels[i].style.top = `${tops[i]}px`;
                        }
                    }
                    break;
                //right
                case 39:
                    canMoveRight = this.canMove(this.arr).canMoveRight;
                    if (canMoveRight) {
                        for (let v of activityModels) {
                            v.style.left = `${parseInt(v.style.left) + this.BLOCK_SIZE}px`;
                        }
                        this.curLeft++;
                    }
                    break;
                default:
                    break;
            }
        };
    }
}
/**
 * 初始化数据
 */
const init = (nextArr)=> {
    const BLOCK_SIZE = 20,
        curLeft = parseInt((__siteSize__.left + __siteSize__.width / 2 - BLOCK_SIZE) / BLOCK_SIZE),
        curTop = parseInt(__siteSize__.top / BLOCK_SIZE),
        random = Math.floor(Math.random() * __arrs__.length),
        nextRanDom = Math.floor(Math.random() * __arrs__.length),
        delay = 600,
        arr = nextArr ? nextArr : __arrs__[random],
        params = {
            arr: arr,
            nextArr: __arrs__[nextRanDom],
            curLeft: curLeft,
            curTop: curTop,
            BLOCK_SIZE: BLOCK_SIZE,
            siteSize: __siteSize__,
            highestScore: __highestScore__,
            delay: delay
        };
    let block = new Block(params);
    block.init();
};
/**
 * 浏览器加载初始化
 */
window.onload = ()=> {
    const site = document.querySelector('.site');
    let {width, height, top, left} = window.getComputedStyle(site);
    let siteSize = {};
    siteSize.width = parseInt(width);
    siteSize.height = parseInt(height);
    siteSize.top = parseInt(top);
    siteSize.left = parseInt(left);
    //显示历史最高分
    const highestScore = localStorage.getItem('highestScore') || 0;
    let highestScoreDiv = document.querySelector('#highest-score');
    highestScoreDiv.innerText = highestScore;
    //等级
    window.__level__ = 1;
    //得分
    window.__score__ = 0;
    //显示等级
    let level = document.querySelector('#level');
    level.innerText = window.__level__;
    //历史最高分
    window.__highestScore__ = highestScore;
    //画布大小
    window.__siteSize__ = siteSize;
    //形状数组
    window.__arrs__ = [
        //L
        [[1, 0], [1, 0], [1, 1]],
        [[1, 1, 1], [1, 0, 0]],
        [[1, 1], [0, 1], [0, 1]],
        [[0, 0, 1], [1, 1, 1]],
        //』
        [[0, 1], [0, 1], [1, 1]],
        [[1, 0, 0], [1, 1, 1]],
        [[1, 1], [1, 0], [1, 0]],
        [[1, 1, 1], [0, 0, 1]],
        //I
        [[1], [1], [1], [1]],
        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]],
        [[1, 1, 1, 1]],
        //田
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]],
        //T
        [[1, 1, 1], [0, 1, 0]],
        [[0, 1], [1, 1], [0, 1]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 0], [1, 1], [1, 0]],
        //Z
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1], [1, 1], [1, 0]],
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1], [1, 1], [1, 0]],
        //倒Z
        [[0, 1, 1], [1, 1, 0]],
        [[1, 0], [1, 1], [0, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[1, 0], [1, 1], [0, 1]]
    ];
    let start = document.querySelector('.start-restart');
    start.onclick = (e)=> {
        e.preventDefault();
        start.innerText = 'restart';
        start.style.display = 'none';
        init();
    };
};