export const ITEM_TYPE = {
    NORMAL: 'normal',
    ACTIVE: 'active'
}

export const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
    BOTTOM: 'bottom'
}

export const BORDER = {
    TOP: 540,
    LEFT: -300,
    RIGHT: 60,
    BOTTOM: -300
}

export const BLOCK_SIZE = 40

export const LEN = {
    COL_LEN: (BORDER.RIGHT - BORDER.LEFT) / BLOCK_SIZE,
    ROW_LEN: (BORDER.TOP - BORDER.BOTTOM) / BLOCK_SIZE
}

export const CUBE = [
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
]


