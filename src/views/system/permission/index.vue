<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.name')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-select
        v-model="listQuery.type"
        :placeholder="$t('table.type')"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label+'('+item.key+')'" :value="item.key" />
      </el-select>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        {{ $t('table.reviewer') }}
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" > -->
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        type="index"
        :index="getTableIndex"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <!-- <template slot-scope="scope">
          <span> -->
        <!-- {{ index }} -->
        <!-- {{ scope.$index + (scope.pageNum -1) * scope.pageSize + 1 }} -->
        <!-- {{ scope.row.id }} -->
        <!-- {{ scope.$index+(pageNum - 1) * pageSize + 1}} -->
        <!-- </span> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        :label="$t('table.name')"
        sortable="custom"
        :class-name="getSortClass('name')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="code"
        :label="$t('table.code')"
        sortable="custom"
        :class-name="getSortClass('code')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.type')" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.state')" width="80">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.stateName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.deleted')" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.deletedName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        align="center"
        :label="$t('table.createTime')"
        sortable="custom"
        :class-name="getSortClass('create_time')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.createUserName')">
        <template slot-scope="scope">
          <span>{{ scope.row.createUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

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
            <el-form-item :label="$t('table.parentId')" prop="parentId">
              <el-select v-model="temp.parentId" class="filter-item" :placeholder="generateTitle('message.Please select')">
                <el-option v-for="item in stateOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.sort')" prop="sort">
              <el-input v-model="temp.sort" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item :label="$t('table.code')" prop="code">
              <el-input v-model="temp.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.name')" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
            <el-form-item :label="$t('table.icon')">
              <el-input v-model="temp.icon" type="input" :placeholder="generateTitle('message.Please input')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.config')">
              <el-input v-model="temp.config" type="input" :placeholder="generateTitle('message.Please input')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.description')">
              <el-input v-model="temp.description" type="input" :placeholder="generateTitle('message.Please input')" />
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
import { page, addPermission, updatePermission, deletePermission } from '@/api/user/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {
  name: 'PermissionList',
  components: { Pagination },
  directives: { waves },
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
      temp: {
        id: undefined,
        code: '',
        name: '',
        type: '',
        parentId: undefined,
        icon: '',
        sort: 1,
        config: '',
        description: '',
        state: '1',
        deleted: 0
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
  created () {
    this.getList()
  },
  methods: {
    generateTitle,
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

      if (prop === 'code') {
        this.sortByCode(order)
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

    sortByCode (order) {
      if (order === 'ascending') {
        this.listQuery.sortField = '+code'
      } else {
        this.listQuery.sortField = '-code'
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
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          addPermission(this.temp).then(response => {
            // console.log(response)
            // this.list.unshift(response.data)

            this.dialogFormVisible = false
            this.$notify({
              title: this.generateTitle('message.Success'),
              message: this.generateTitle('message.createSuccess'),
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate ({ $index, row }) {
      this.temp = Object.assign({}, row) // copy obj
      // 此处必须转类型不然导致选择框默认不选中  ，显示value值
      // this.dictInfoForm.type = String(this.dictInfoForm.type);    //转换为String类型
      // this.dictInfoForm.type = Number(this.dictInfoForm.type);  //转换为Number类型

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
          updatePermission(tempData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.generateTitle('message.Success'),
              message: this.generateTitle('message.updateSuccess'),
              type: 'success',
              duration: 2000
            })
            this.getList()

            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            // this.dialogFormVisible = false
            // this.$notify({
            //   title: '成功',
            //   message: '更新成功',
            //   type: 'success',
            //   duration: 2000
            // })
          })
        }
      })
    },
    handleDelete ({ $index, row }) {
      this.$confirm(this.generateTitle('message.Confirm to remove the data?'), this.generateTitle('message.Warning'), {
        confirmButtonText: this.generateTitle('table.confirm'),
        cancelButtonText: this.generateTitle('table.cancel'),
        type: 'warning'
      })
        .then(async () => {
          await deletePermission({ id: row.id })
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
</style>
