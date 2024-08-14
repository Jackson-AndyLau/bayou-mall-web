<template>
  <div>
    <el-tree
      :data="data"
      :props="defaultProps"
      :expand-on-click-node="false"
      show-checkbox
      node-key="catId"
      :default-expanded-keys="expandedKeys"
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
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="category">
        <el-form-item label="菜单名称">
          <el-input
            v-model="category.name"
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
      data: [],
      category: { catId: null, name: '', parentCid: 0, catLevel: 0, showStatus: 0, sort: 0 },
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
      // 对象赋值
      this.category.parentCid = data.catId
      this.category.catLevel = data.catLevel * 1 + 1
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
      // 显示弹窗
      this.dialogVisible = true
      // 对象赋值（回显）
      this.category.name = data.name
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
</style>
