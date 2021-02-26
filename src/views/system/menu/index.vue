<template>
  <div class="app-container custom-tree-node">
    <div class="block">
      <el-input
        v-model="filterText"
        placeholder="Filter keyword"
        style="margin-bottom:30px;"
      />
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
        ref="menu"
        v-loading="isLoadingMenus"
        class="filter-tree"
        :data="rootData"
        :props="defaultProps"
        :load="loadNode"
        lazy
        node-key="id"
        show-checkbox
        highlight-current
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

    <el-dialog
      :title="generateTitle(textMap[dialogStatus])"
      :visible.sync="dialogFormVisible"
    >
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

            <!-- <el-form-item :label="$t('table.parentMenu')"
                          prop="parentMenu">
              <el-select v-model="temp.parentId"
                         class="filter-item"
                         :placeholder="generateTitle('message.Please select')">
                <el-option v-for="item in stateOptions"
                           :key="item.key"
                           :label="item.label"
                           :value="item.key" />
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.code')"
              prop="code"
            >
              <el-input v-model="temp.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.name')"
              prop="name"
            >
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.type')"
              prop="type"
            >
              <el-select
                v-model="temp.type"
                class="filter-item"
                :placeholder="generateTitle('message.Please select')"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.state')"
              prop="state"
            >
              <el-select
                v-model="temp.state"
                class="filter-item"
                :placeholder="generateTitle('message.Please select')"
              >
                <el-option
                  v-for="item in stateOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.path')"
              prop="path"
            >
              <el-input v-model="temp.path" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.icon')"
              prop="icon"
            >
              <el-input v-model="temp.icon" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.classContent')"
              prop="classContent"
            >
              <el-input v-model="temp.classContent" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.sort')"
              prop="sort"
            >
              <el-input v-model="temp.sort" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('table.config')"
              prop="config"
            >
              <el-input v-model="temp.config" />
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
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPvVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pv"
          label="Pv"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import { queryMenuTree, list, addMenu, updateMenu, deleteMenu } from '@/api/user/menu'
import { parseTime } from '@/utils'

// import MenuSelect from '@/components/MenuSelect'

export default {
  name: 'MenuList',
  // components: { MenuSelect },
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
      // 当前选择的节点参数
      selectNode: {},
      isLoadingMenus: true,
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
        isLeaf: (data) => {
          return !!data.leaf
        }
      },
      nodeKey: 'id',
      defaultCheckedKeys: [],
      filterText: '',

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
        parentId: undefined,
        sortField: '-createTime'
      },
      typeOptions: [{ label: '正常', key: '1' }, { label: '禁用', key: '0' }],
      stateOptions: [{ label: '正常', key: '1' }, { label: '禁用', key: '0' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      tempParentNode: {},
      temp: {
        id: undefined,
        name: '',
        code: '',
        type: '',
        path: '',
        icon: '',
        classContent: '',
        sort: undefined,
        config: '',
        parentId: 0,
        parentName: '',
        description: '',
        state: '',
        importance: 1

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
      this.$refs.menu.filter(val)
    }
  },
  created () {
    // this.queryMenuTree()
  },
  methods: {
    generateTitle,
    // 加载树结点
    loadNode (node, resolve) {
      // 如果是顶级的父节点
      if (node.level === 0) {
        const param = this.listQuery
        param.parentId = 0
        // 查找顶级对象
        list(param).then(res => {
          if (res.data) {
            this.isLoadingMenus = false
            return resolve(res.data)
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.isLoadingMenus = false
          const data = []
          return resolve(data)
        })
      } else {
        // 根据父节点id找寻下一级的所有节点
        const param = this.listQuery
        param.parentId = node.data.id

        list(param).then(res => {
          if (res.data) {
            this.isLoadingMenus = false
            this.expandedKeys.push(res.data.id)
            return resolve(res.data)
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.isLoadingMenus = false
          const data = []
          return resolve(data)
        })
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
          addMenu(this.temp).then(response => {
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
      this.temp.type = String(this.temp.type)
      this.temp.state = String(this.temp.state)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // this.handleCreate()
      // console.log(data)
      // const newChild = { id: id++, label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMenu(tempData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.generateTitle('message.Success'),
              message: this.generateTitle('message.updateSuccess'),
              type: 'success',
              duration: 2000
            })
            this.refreshNodeBy(this.temp.parentId)
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
          await deleteMenu({ id: data.id })
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
    queryMenuTree () {
      this.listLoading = true
      queryMenuTree(this.listQuery).then(response => {
        this.rootData = response.data.list
        // this.expandedKeys.push(this.rootData[0].id)

        this.listLoading = false

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList () {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.rootData = response.data.list
        // this.expandedKeys.push(this.rootData[0].id)

        this.listLoading = false

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter () {
      // this.listQuery.page = 1
      // this.listQuery.pageNum = 1
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
        parentId: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    refreshNode (id) {
      const node = this.$refs.menu.getNode(id) // 通过节点id找到对应树节点对象
      node.loaded = false
      node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
    // id是节点的data参数，不是node参数
    refreshNodeBy (id) {
      const node = this.$refs.menu.getNode(id) // 通过节点id找到对应树节点对象
      node.loaded = false
      node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },

    handleDelete ({ $index, row }) {
      this.$confirm(this.generateTitle('message.Confirm to remove the data?'), this.generateTitle('message.Warning'), {
        confirmButtonText: this.generateTitle('table.confirm'),
        cancelButtonText: this.generateTitle('table.cancel'),
        type: 'warning'
      })
        .then(async () => {
          await deleteMenu({ id: row.id })
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
