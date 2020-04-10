// 默认获取节点下所有组件元素,放入view中
cc.Class({
  extends: cc.Component,
  properties: {},
  load_objects(root, path) {
    for (let i = 0; i < root.childrenCount; i++) {
      this.view[path + root.children[i].name] = root.children[i]
      this.load_objects(root.children[i], path + root.children[i].name + '/')
    }
  },
  onLoad() {
    this.view = {}
    this.load_objects(this.node, '')
  }
})
