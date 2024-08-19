<template>
  <div id="external">
    <div id="top">
      <el-switch
        v-model="draggableValue"
        active-text="开启拖拽"
        inactive-text="关闭拖拽"
      >
      </el-switch>
      <el-button
        class="draggableButton"
        type="primary"
        plain
        :disabled="draggableValue ? false : true"
        @click="batchUpdate"
      >确认拖拽</el-button>
      <el-button
        class="draggableButton"
        type="warning"
        plain
        @click="batchDelete"
      >批量删除</el-button>
      <el-button
        class="draggableButton"
        type="warning"
        plain
        @click="resetChecked"
      >删除重选</el-button>
    </div>
    <div>
      <el-tree
        :data="data"
        :props="defaultProps"
        :expand-on-click-node="false"
        show-checkbox
        node-key="catId"
        :default-expanded-keys="expandedKeys"
        :draggable="draggableValue"
        @node-drop="handleDrop"
        :allow-drop="allowDrop"
        ref="refTreeMenu"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
        >
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)"
              v-if="node.level <= 2"
            >
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="update(data)"
            >
              Update
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
              v-if="node.childNodes.length == 0"
            >
              Delete
            </el-button>
          </span>
        </span>

      </el-tree>
      <el-dialog
        v-bind:title="title"
        :visible.sync="dialogVisible"
        width="30%"
        v-bind:close-on-click-modal="false"
      >
        <el-form :model="category">
          <el-form-item label="菜单名称">
            <el-input
              v-model="category.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标地址">
            <el-input
              v-model="category.icon"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="计量单位">
            <el-input
              v-model="category.productUnit"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input
              v-model="category.productCount"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitCategory"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
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
      // 批量删除的节点
      checkedNodes: [],
      // 修改使用的全局pCid
      parentCid: [],
      // 是否开启拖拽
      draggableValue: false,
      // 拖拽更新的节点
      updateNodes: [],
      // 最大层级
      maxLevel: 0,
      // 标题
      title: '提示',
      data: [],
      category: { catId: null, name: '', parentCid: 0, catLevel: 0, showStatus: 0, sort: 0, icon: '', productUnit: '', productCount: 0 },
      // update/add
      dialogType: '',
      // 是否显示弹窗
      dialogVisible: false,
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

    // 弹窗-新增
    append (data) {
      console.log('append:', data)
      this.dialogType = 'add'
      this.dialogVisible = true
      this.title = '新增菜单'
      // 对象赋值
      this.category.parentCid = data.catId
      this.category.catLevel = data.catLevel * 1 + 1
      // 清空缓存
      this.category.catId = ''
      this.category.name = ''
      this.category.icon = ''
      this.category.productUnit = ''
      this.category.productCount = ''
      this.category.showStatus = 0
      this.category.sort = 0
    },

    // 新增菜单
    addCategory () {
      console.log('新增菜单数据：', this.category)
      this.$http({
        url: this.$http.adornUrl('/product/category/save'),
        method: 'post',
        data: this.$http.adornData(this.category, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
          // 关闭对话框
          this.dialogVisible = false
          // 刷新菜单列表
          this.getMenus()
          // 设置默认展开的菜单
          this.expandedKeys = [this.category.parentCid]
        } else {
          this.message.error(data.msg)
        }
      })
    },
    // 删除菜单
    remove (node, data) {
      console.log('remove:', node, data)
      var ids = [data.catId]
      this.$confirm(`此操作将删除【${data.name}】分类，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/product/category/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新页面
            this.getMenus()
            // 设置展开节点
            this.expandedKeys = [node.parent.data.catId]
          } else {
            this.message.error(data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 提交请求类型
    submitCategory () {
      if (this.dialogType === 'add') {
        this.addCategory()
      }
      if (this.dialogType === 'update') {
        this.updateCategory()
      }
    },
    // 修改-弹窗
    update (data) {
      console.log('要修改的数据：', data)
      this.dialogType = 'update'
      this.title = '修改菜单'
      // 显示弹窗
      this.dialogVisible = true
      // 获取回显数据
      this.$http({
        url: this.$http.adornUrl(`/product/category/info/${data.catId}`),
        method: 'get'
      }).then(({ data }) => {
        // 对象赋值（回显）
        console.log('要回显的数据：', data)
        this.category.catId = data.category.catId
        this.category.name = data.category.name
        this.category.icon = data.category.icon
        this.category.productUnit = data.category.productUnit
        this.category.productCount = data.category.productCount
        this.category.parentCid = data.category.parentCid
      })
    },
    updateCategory () {
      console.log('正在更新的菜单数据：', this.category)
      // 解构数据
      var { catId, name, icon, productUnit, productCount } = this.category
      this.$http({
        url: this.$http.adornUrl('/product/category/update'),
        method: 'post',
        data: this.$http.adornData({ catId, name, icon, productUnit, productCount }, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
          // 关闭对话框
          this.dialogVisible = false
          // 刷新菜单列表
          this.getMenus()
          // 设置默认展开的菜单
          this.expandedKeys = [this.category.parentCid]
        } else {
          this.message.error(data.msg)
        }
      })
    },
    // 移动事件，type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
    allowDrop (draggingNode, dropNode, type) {
      console.log('移动事件参数：', draggingNode, dropNode, type)
      // 获取当前拖动节点的最大层级
      this.countNodeLevel(draggingNode)
      // 当前拖动节点层级-父节点层级<=3，可移动，否则禁止移动
      let deep = Math.abs(this.maxLevel - draggingNode.level) + 1
      // 拖动后的深度
      console.log('节点拖动后的深度：', deep)
      // 校验是否可拖动
      if (type === 'inner') {
        console.log('插入至目标节点 inner: ', deep + dropNode.level)
        return (deep + dropNode.level) <= 3
      } else if (type === 'prev') {
        console.log('放置在目标节点前 prev: ', dropNode.parent.level)
        return (deep + dropNode.parent.level) <= 3
      } else if (type === 'next') {
        console.log('放置在目标节点后 next: ', dropNode.parent.level)
        return (deep + dropNode.parent.level) <= 3
      }
    },
    // 计算当前移动节点的层级
    countNodeLevel (node) {
      // 找出当前移动节点的，层级最大深度
      if (node.childNodes !== null && node.childNodes.length > 0) {
        // 递归遍历当前的最大层级
        for (let i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].level > this.maxLevel) {
            this.maxLevel = node.childNodes[i].level
          }
          this.countNodeLevel(node.childNodes[i])
        }
      } else {
        this.maxLevel = node.level
      }
    },
    // 拖拽成功完成时触发的事件，共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('拖拽成功完成时 handleDrop: ', draggingNode.label, dropNode.label, dropType)
      // 1、同级节点，获取同级兄弟节点的父级节点
      let parentCid = 0
      let reSortNodes = null
      if (dropType === 'before' || dropType === 'after') {
        // 取兄弟节点父级ID
        parentCid = dropNode.parent.data.catId
        // 兄弟父级的所有子节点
        reSortNodes = dropNode.parent.childNodes
      } else {
        // 移入的节点ID作为父级ID
        parentCid = dropNode.data.catId
        // 拖拽进入节点的子节点
        reSortNodes = dropNode.childNodes
      }
      // 2、重新排序，当前拖拽节点所有相关联节点的最新顺序
      for (let i = 0; i < reSortNodes.length; i++) {
        // 移动自己
        if (reSortNodes[i].data.catId === draggingNode.data.catId) {
          let catLevel = draggingNode.level
          if (reSortNodes[i].level !== draggingNode.level) {
            catLevel = reSortNodes[i].level
            // 3、更新节点层级，当前拖拽节点所有相关联节点是层级更新
            this.updateChildNodeLevel(reSortNodes)
          }
          this.updateNodes.push({ catId: reSortNodes[i].data.catId, sort: i, parentCid: parentCid, catLevel: catLevel })
        } else {
          this.updateNodes.push({ catId: reSortNodes[i].data.catId, sort: i })
        }
      }
      this.parentCid.push(parentCid)
    },
    // 修改子节点层级
    updateChildNodeLevel (childNodes) {
      if (childNodes.length > 0) {
        for (let i = 0; i < childNodes.length; i++) {
          var childNode = childNodes[i].data
          this.updateNodes.push({ catId: childNode.catId, catLevel: childNodes[i].level })
          // 递归调用修改
          this.updateChildNodeLevel(childNodes[i])
        }
      }
    },
    updateSortNodes () {
      console.log('拖拽节点重排序 updateNodes: ', this.updateNodes)
      this.$http({
        url: this.$http.adornUrl('/product/category/reSort'),
        method: 'post',
        data: this.$http.adornData(this.updateNodes, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
          // 刷新菜单列表
          this.getMenus()
          // 设置默认展开的菜单
          this.expandedKeys = this.parentCid

          // 更新缓存
          this.updateNodes = []
          this.maxLevel = 0
          // this.parentCid = 0
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 批量修改
    batchUpdate () {
      console.log('批量修改 batchUpdate：', this.updateNodes)
      this.updateSortNodes()
    },
    // 获取所有选中的节点
    getCheckedNodes () {
      let checkedNodes = this.$refs.refTreeMenu.getCheckedNodes()
      this.checkedNodes = checkedNodes

      console.log('选中的节点 getCheckedNodes：', this.checkedNodes)
    },
    // 批量删除
    batchDelete () {
      this.getCheckedNodes()
      // 节点选中判断
      if (this.checkedNodes.length === 0) {
        this.$message({
          type: 'info',
          message: '请选中需要操作的节点!'
        })
        return
      }
      // 执行批量删除
      let catIds = []
      let nodeNames = []
      for (let i = 0; i < this.checkedNodes.length; i++) {
        nodeNames.push(this.checkedNodes[i].name)
        catIds.push(this.checkedNodes[i].catId)
        this.parentCid.push(this.checkedNodes[i].parentCid)
      }
      this.$confirm(`此操作将删除【${nodeNames}】元素，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/product/category/delete'),
          method: 'post',
          data: this.$http.adornData(catIds, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 清空已删除的选中节点
            this.checkedNodes = []
            // 刷新页面
            this.getMenus()
            // 设置展开节点
            this.expandedKeys = this.parentCid
          } else {
            this.message.error(data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        // 清空已删除的选中节点
        this.checkedNodes = []
      })
    },
    resetChecked () {
      this.$refs.refTreeMenu.setCheckedKeys([])
    }
  },
  // 生命周期 - 创建完成（可以访问当前 this 实例）
  created () {
    this.getMenus()
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted () {

  },
  // 生命周期 - 创建之前
  beforeCreate () { },
  // 生命周期 - 挂载之前
  beforeMount () { },
  // 生命周期 - 更新之前
  beforeUpdate () { },
  // 生命周期 - 更新之后
  updated () { },
  // 生命周期 - 销毁之前
  beforeDestroy () { },
  // 生命周期 - 销毁完成
  destroyed () { },
  // 如果页面有 keep-alive 缓存功能，这个函数会触发
  activated () { }
}
</script>
<style scoped>
#top {
    margin-bottom: 20px;
}
#external {
    margin-left: 30px;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
.draggableButton {
    margin-left: 30px;
}
</style>
