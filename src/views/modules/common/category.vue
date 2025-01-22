<template>
  <el-tree
    :data="data"
    :props="defaultProps"
    :expand-on-click-node="false"
    node-key="catId"
    :draggable="draggableValue"
    :allow-drop="allowDrop"
    ref="refTreeMenu"
    @node-click="nodeClick"
  >
  </el-tree>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data () {
    // 这里存放数据
    return {
      title: '提示',
      data: [],
      category: {
        catId: null,
        name: '',
        parentCid: 0,
        catLevel: 0,
        showStatus: 0,
        sort: 0,
        icon: '',
        productUnit: '',
        productCount: 0
      },
      // 显示展示level
      expandedKeys: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      }
    }
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 方法集合
  methods: {
    getMenus () {
      this.$http({
        url: this.$http.adornUrl('/product/category/tree'),
        method: 'get'
      }).then(({ data }) => {
        console.log('成功获取到菜单数据：' + data.treeList)
        this.data = data.treeList
      })
    },
    nodeClick (data, node, component) {
      console.log('当前节点被点击了：', data, node, component)
      // 向父级组件发送时间
      this.$emit('tree-node-click', data, node, component)
    }
  },
  // 生命周期 - 创建完成（可以访问当前 this 实例）
  created () {
    this.getMenus()
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted () {},
  // 生命周期 - 创建之前
  beforeCreate () {},
  // 生命周期 - 挂载之前
  beforeMount () {},
  // 生命周期 - 更新之前
  beforeUpdate () {},
  // 生命周期 - 更新之后
  updated () {},
  // 生命周期 - 销毁之前
  beforeDestroy () {},
  // 生命周期 - 销毁完成
  destroyed () {},
  // 如果页面有 keep-alive 缓存功能，这个函数会触发
  activated () {}
}
</script>
<style scoped></style>
