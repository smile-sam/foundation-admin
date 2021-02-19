<template>
  <div class="app-container custom-tree-node">
    <div class="block">
      <el-input
        v-model="filterText"
        placeholder="Filter keyword"
        style="margin-bottom:30px;"
      />
      <el-button type="primary" @click="onExpand">{{ expandAll ? '收缩' : '展开' }}所有节点</el-button>
      <!-- <p>使用 scoped slot</p> -->
      <!-- <el-tree :data="rootData"
               :render-content="renderContent"
               show-checkbox
               node-key="id"
               :default-expanded-keys="expandedKeys"
               :default-checked-keys="[5]"
               :props="defaultProps">
      </el-tree> -->

      <el-tree
        ref="organization"
        v-loading="isLoadingOrganizations"
        class="filter-tree"
        :data="rootData"
        :props="defaultProps"
        :load="loadNode"
        lazy
        show-checkbox
        highlight-current
        node-key="id"
        :default-expanded-keys="expandedKeys"
        :filter-node-method="filterNode"
      >
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node"
        >
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => handleCreate(data)"
            >
              {{ $t('table.create') }}
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => handleUpdate(node, data)"
            >
              {{ $t('table.edit') }}
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >

              {{ $t('table.delete') }}
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>

    <el-dialog :title="generateTitle(textMap[dialogStatus])" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        class="form-container"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.parentMenu')"
              prop="parentId"
            >
              <!-- <MenuSelect :data="menus"
                          :defaultProps="defaultProps"
                          :nodeKey="nodeKey"
                          :checkedKeys="defaultCheckedKeys"
                          @popoverHide="popoverHide"></MenuSelect> -->

              <el-input
                v-model="temp.parentName"
                readonly="readonly"
              />
              <el-input
                v-show="false"
                v-model="temp.parentId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.code')" prop="code">
              <el-input v-model="temp.code" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.name')" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.type')" prop="type">
              <el-select v-model="temp.type" class="filter-item" :placeholder="generateTitle('message.Please select')">
                <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.state')" prop="state">
              <el-select v-model="temp.state" class="filter-item" :placeholder="generateTitle('message.Please select')">
                <el-option v-for="item in stateOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.description')">
              <el-input
                v-model="temp.description"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                :placeholder="generateTitle('message.Please input')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import { list, page, queryOrgTree, addOrganization, updateOrganization, deleteOrganization } from '@/api/user/organization'

import { parseTime } from '@/utils'

export default {
  name: 'OrganizationList',
  components: { },
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      // 树根
      rootData: [],
      // 自己定义的用于接收tree树id的数组
      expandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
        isLeaf: (data) => {
          return !!data.leaf
        }
      },
      filterText: '',
      // 当前选择的节点参数
      selectNode: {},
      headNode: {},
      headResolve: undefined,
      isLoadingOrganizations: true,
      expandAll: false,
      tableKey: 0,
      list: null,
      pageNum: 1,
      pageSize: 15,
      total: 0,
      pages: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        importance: undefined,
        name: undefined,
        type: undefined,
        sortField: '-createTime'
      },
      importanceOptions: [1, 2, 3],
      typeOptions: [{ label: '正常', key: '1' }, { label: '禁用', key: '0' }],
      stateOptions: [{ label: '正常', key: '1' }, { label: '禁用', key: '0' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      tempParentNode: {},
      tempCurrentNode: {},
      temp: {
        id: undefined,
        name: '',
        code: '',
        description: '',
        parentId: 0,
        state: '1'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'table.edit',
        create: 'table.create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        code: [{ required: true, message: this.generateTitle('message.code is required'), trigger: 'change' }],
        type: [{ required: true, message: this.generateTitle('message.type is required'), trigger: 'change' }],
        name: [{ required: true, message: this.generateTitle('message.name is required'), trigger: 'change' }],
        state: [{ required: true, message: this.generateTitle('message.state is required'), trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: this.generateTitle('message.timestamp is required'), trigger: 'change' }],
        title: [{ required: true, message: this.generateTitle('message.title is required'), trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  watch: {
    filterText (val) {
      this.$refs.organization.filter(val)
    },
    rootData: {
      handler () {
        // 我这里默认展开一级, 指定几级就往里遍历几层取到 id 就可以了
        console.log('=====')
        console.log(this.rootData)
        this.rootData.forEach(item => {
          this.expandedKeys.push(item.id)
        })
      },
      deep: true
    }
  },
  created () {
    this.queryOrgTree()
  },
  methods: {
    generateTitle,
    // 加载树结点
    loadNode (node, resolve) {
      // 如果是顶级的父节点
      if (node.level === 0) {
        this.headNode = node
        this.headResolve = resolve
        const param = this.listQuery
        param.parentId = 0
        // 查找顶级对象
        list(param).then(res => {
          if (res.data) {
            this.isLoadingOrganizations = false
            return resolve(res.data)
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.isLoadingOrganizations = false
          const data = []
          return resolve(data)
        })
      } else if (node.level > 0 && node.level < 4) {
        // 根据父节点id找寻下一级的所有节点
        const param = this.listQuery
        param.parentId = node.data.id
        list(param).then(res => {
          if (res.data) {
            this.isLoadingOrganizations = false
            this.expandedKeys.push(res.data.id)
            return resolve(res.data)
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.isLoadingOrganizations = false
          const data = []
          return resolve(data)
        })
      } else {	// 懒加载方法
        console.log('懒加载方法')
        setTimeout(() => {
          resolve([{
            name: `懒加载第${node.level + 1}级` + +new Date(),
            id: `${+new Date()}`
          }])
        }, 500)
      }
    },
    handleCreate (data) {
      console.log(data)
      this.resetTemp()
      this.temp = Object.assign({}) // copy obj
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.tempParentNode = data
      this.temp.parentId = data.id
      this.temp.parentName = data.name

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          addOrganization(this.temp).then(response => {
            // console.log(response)
            // this.list.unshift(response.data)

            this.dialogFormVisible = false
            this.$notify({
              title: this.generateTitle('message.Success'),
              message: this.generateTitle('message.createSuccess'),
              type: 'success',
              duration: 2000
            })
            this.refreshNodeBy(this.temp.parentId)
          })
        }
      })
    },
    handleUpdate (node, data) {
      console.log(node)
      this.temp = Object.assign({}, data) // copy obj
      // 此处必须转类型不然导致选择框默认不选中  ，显示value值
      if (node.level === 0) {
        this.temp.parentId = 0
        this.temp.parentName = ''
      } else {
        this.temp.parentId = node.parent.data.id
        this.temp.parentName = node.parent.data.name
      }

      this.tempCurrentNode = node
      this.temp.type = String(this.temp.type)
      this.temp.state = String(this.temp.state)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateOrganization(tempData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.generateTitle('message.Success'),
              message: this.generateTitle('message.updateSuccess'),
              type: 'success',
              duration: 2000
            })
            if (typeof (tempData.parentId) === 'undefined' || tempData.parentId === 0) {
              // this.refreshNodeBy(tempData.id)
              this.headNode.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
              this.loadNode(this.headNode, this.headResolve)// 再次执行懒加载的方法
              this.headNode.expand
            } else {
              this.refreshNodeBy(tempData.parentId)
            }
          })
        }
      })
    },
    remove (node, data) {
      this.$confirm(this.generateTitle('message.Confirm to remove the data?'), this.generateTitle('message.Warning'), {
        confirmButtonText: this.generateTitle('table.confirm'),
        cancelButtonText: this.generateTitle('table.cancel'),
        type: 'warning'
      })
        .then(async () => {
          await deleteOrganization({ id: data.id })
          this.$message({
            type: 'success',
            message: this.generateTitle('message.Delete succed!')
          })
          this.refreshNodeBy(data.parentId)
        })
        .catch(err => { console.error(err) })
    },
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick (data) {
      console.log(data)
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-button size='mini' type='text' on-click={() => this.append(data)}>Append</el-button>
            <el-button size='mini' type='text' on-click={() => this.remove(node, data)}>Delete</el-button>
          </span>
        </span>)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    popoverHide (checkedIds, checkedData) {
      console.log(checkedIds)
      console.log(checkedData)
    },
    // id是节点的data参数，不是node参数
    refreshNodeBy (id) {
      const node = this.$refs.organization.getNode(id) // 通过节点id找到对应树节点对象

      node.loaded = false
      node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
    // 节点展开
    async onExpand () {
      try {
        await this.$confirm('确认要展开所有节点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.expandAll = !this.expandAll
        // 改变每个节点的状态
        this.changeTreeNodeStatus(this.$refs.organization.store.root)
      } catch (e) {
        this.$message({
          type: 'info',
          message: e === 'cancel' ? '取消操作' : '操作失败'
        })
      }
    },
    // 改变节点的状态
    changeTreeNodeStatus (node) {
      node.expanded = this.expandAll
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.expandAll
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i])
        }
      }
    },
    queryOrgTree () {
      this.listLoading = true
      queryOrgTree(this.listQuery).then(response => {
        this.rootData = response.data
        this.listLoading = false

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    getList () {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.listLoading = false

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
      if (prop === 'name') {
        this.sortByName(order)
      }

      if (prop === 'account') {
        this.sortByAccount(order)
      }

      if (prop === 'create_time') {
        this.sortByCreateTime(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sortField = '+id'
      } else {
        this.listQuery.sortField = '-id'
      }
      this.handleFilter()
    },
    sortByName (order) {
      if (order === 'ascending') {
        this.listQuery.sortField = '+name'
      } else {
        this.listQuery.sortField = '-name'
      }
      this.handleFilter()
    },

    sortByAccount (order) {
      if (order === 'ascending') {
        this.listQuery.sortField = '+account'
      } else {
        this.listQuery.sortField = '-account'
      }
      this.handleFilter()
    },
    sortByCreateTime (order) {
      if (order === 'ascending') {
        this.listQuery.sortField = '+create_time'
      } else {
        this.listQuery.sortField = '-create_time'
      }
      this.handleFilter()
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleDelete ({ $index, row }) {
      this.$confirm(this.generateTitle('message.Confirm to remove the data?'), this.generateTitle('message.Warning'), {
        confirmButtonText: this.generateTitle('table.confirm'),
        cancelButtonText: this.generateTitle('table.cancel'),
        type: 'warning'
      })
        .then(async () => {
          await deleteOrganization({ id: row.id })
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: this.generateTitle('message.Delete succed!')
          })
        })
        .catch(err => { console.error(err) })
    },
    handleDownload () {
      this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    formatJson (filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function (key) {
      const sortField = this.listQuery.sortField
      return sortField === `+${key}` ? 'ascending' : 'descending'
    },
    getTableIndex (index) {
      // return index + 1;
      // return (this.dataForm.pageNum - 1) * this.dataForm.pageSize + index + 1;
      return (this.pageNum - 1) * this.pageSize + index + 1
    }
  }
}
</script>

<style scoped>
/* .edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
} */

.form-container {
  /*上外边距是 10px 右外边距是 5px下外边距是 15px左外边距是 20px*/
  margin: 0 50px 0 50px;
}

.el-form-item {
  margin: 0 22px 22px 0;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.custom-tree-node span {
  margin: 0 20px 0 0;
  width: 300px;
}
</style>
