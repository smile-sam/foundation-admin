<template>
  <div
    v-if="show"
    class="panelWrapper"
  >
    <div class="panelHeader">{{ form.id }}</div>
    <el-form
      class="panelForm"
      :model="form"
      label-position="top"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="普通"
          name="general"
        >
          <el-form-item label="Id">
            <el-input
              v-model="form.id"
              size="mini"
              @change="v=>updateAttr('id',v)"
            />
          </el-form-item>
          <el-form-item label="名称">
            <el-input
              v-model="form.name"
              size="mini"
              @change="v=>updateAttr('name',v)"
            />
          </el-form-item>
          <template v-if="['bpmn:StartEvent'].includes(businessObject.$type)">
            <template v-if="startEventType=='bpmn:TimerEventDefinition'">
              <el-form-item label="Timer Definition Type">
                <el-select
                  v-model="timeDefinitionType"
                  size="mini"
                  style="width:100%"
                  placeholder="请选择"
                  @change="updateTime"
                >
                  <el-option
                    v-for="item in timeDefinitionTypeList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <template v-if="timeDefinitionType">
                <el-form-item
                  label="Timer Definition"
                  required
                >
                  <el-date-picker
                    v-if="timeDefinitionType=='Date'"
                    v-model="FormalExpression.body"
                    size="mini"
                    style="width:100%"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="请选择"
                    @change="updateProperties"
                  />
                  <el-input
                    v-else
                    v-model="FormalExpression.body"
                    size="mini"
                    @change="updateProperties"
                  />
                </el-form-item>
                <el-form-item
                  v-if="timeDefinitionType=='Cycle'"
                  label="endDate"
                >
                  <el-date-picker
                    v-model="FormalExpression.endDate"
                    style="width:100%"
                    size="mini"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="请选择"
                    @change="updateProperties"
                  />
                </el-form-item>
              </template>
            </template>
            <el-form-item label="初始化用户变量">
              <el-input
                v-model="form.initiator"
                size="mini"
                @change="v=>updateAttr('initiator',v)"
              />
            </el-form-item>
          </template>
          <template v-if="['bpmn:UserTask'].includes(businessObject.$type)">
            <el-form-item label="候选群">
              <el-input
                v-model="form.candidateGroups"
                size="mini"
                @change="v=>updateAttr('candidateGroups',v)"
              />
            </el-form-item>
            <el-form-item label="候选人">
              <el-input
                v-model="form.candidateUser"
                size="mini"
                @change="v=>updateAttr('candidateUser',v)"
              />
            </el-form-item>
            <el-form-item label="优先级别">
              <el-input
                v-model="form.priority"
                size="mini"
                type="number"
                min="1"
                max="100"
                @change="v=>updateAttr('priority',v)"
              />
            </el-form-item>
          </template>
          <template v-if="['bpmn:SequenceFlow'].includes(businessObject.$type)">
            <el-form-item label="Condition Type">
              {{ conditionType }}
              <el-select
                v-model="conditionType"
                size="mini"
                style="width:100%"
                placeholder="请选择"
                @change="updateConditionType"
              >
                <el-option
                  v-for="item in conditionTypeList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="conditionType=='Expression'"
              label="Expression"
            >
              <el-input
                v-model="form.conditionExpression.body"
                size="mini"
                @change="v=>updateAttr('conditionExpression',form.conditionExpression)"
              />
            </el-form-item>
          </template>
          <el-form-item
            v-if="form.documentation&&form.documentation[0]"
            label="描述"
          >
            <el-input
              v-model="form.documentation[0].text"
              type="textarea"
              size="mini"
              @change="v=>updateAttr('documentation',form.documentation)"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane
          v-if="formType.includes(businessObject.$type)"
          label="表单"
          name="form"
        >
          <el-form-item label="表单Id">
            <el-input
              v-model="form.formKey"
              size="mini"
              @change="v=>updateAttr('formKey',v)"
            />
          </el-form-item>
          <el-form-item label="表单字段">
            <el-button
              :disabled="!currentRow"
              class="tableBtn"
              type="text"
              @click="delFP"
            ><i class="el-icon-remove" />
            </el-button>
            <el-button
              class="tableBtn"
              type="text"
              @click="addFP"
            ><i class="el-icon-circle-plus" /></el-button>
            <el-table
              class="fpTable"
              border
              :show-header="false"
              :data="formProperty"
              style="width: 100%"
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column prop="id" />
            </el-table>
          </el-form-item>
          <template v-if="currentRow">
            <div class="title">字段属性</div>
            <el-form-item label="id">
              <el-input
                v-model="currentRow.id"
                size="mini"
                @change="updateProperties"
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-select
                v-model="currentRow.type"
                size="mini"
                style="width:100%"
                placeholder="请选择"
                @change="updateProperties"
              >
                <el-option
                  v-for="item in formPropertyTypeList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="名称">
              <el-input
                v-model="currentRow.name"
                size="mini"
                @change="updateProperties"
              />
            </el-form-item>
            <el-form-item label="默认值">
              <el-input
                v-model="currentRow.default"
                size="mini"
                @change="updateProperties"
              />
            </el-form-item>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    element: {},
    businessObject: {
      default: function () {
        return {}
      }
    },
    modeling: {},
    moddle: {}
  },
  data () {
    return {
      show: false,
      activeName: 'general',
      form: {
        documentation: [{}]
      },
      formProperty: [],
      currentRow: '',
      extensionElements: '',
      formPropertyTypeList: ['long', 'string', 'boolean', 'date', 'enum', 'custom type'],
      formType: ['bpmn:StartEvent', 'bpmn:UserTask'],
      eventTypeHandle: {
        'bpmn:UserTask': {
          handle: 'userTaskHandle'
        },
        'bpmn:StartEvent': {
          handle: 'startEventHandle'
        },
        'bpmn:TimerEventDefinition': {
          handle: 'timerEventHandle'
        },
        'bpmn:MessageEventDefinition': {
          handle: 'ms'
        }
      },
      timeDefinitionTypeList: [
        'Date', 'Duration', 'Cycle'
      ],
      timeDefinitionType: '',
      startEventType: '',
      FormalExpression: '',
      conditionTypeList: ['Expression', ''],
      conditionType: ''
    }
  },
  methods: {
    // 初始化
    init () {
      this.show = true
      this.activeName = 'general'
      if (this.formType.includes(this.businessObject.$type)) {
        this.nomalHandle()
        this.handle(this.businessObject.$type)
        if (this.businessObject.eventDefinitions && this.businessObject.eventDefinitions[0]) {
          this.satrtEventDefinitionHandle()
        } else {
          this.startEventType = 'startEventType'
        }
      }
      this.defaultHandle()
      this.currentRow = ''
      this.form = this.businessObject
    },
    // 默认处理
    defaultHandle () {
      const documentation = this.businessObject.documentation && this.businessObject.documentation.length ? this.businessObject.documentation : [this.moddle.create('bpmn:Documentation', { text: '' })]
      const obj = { documentation }
      if (this.formType.includes(this.businessObject.$type)) {
        obj.extensionElements = this.extensionElements
      }
      this.modeling.updateProperties(this.element, obj)
      if (this.formType.includes(this.businessObject.$type)) {
        this.formProperty = this.extensionElements.values
      }
      if (['bpmn:SequenceFlow'].includes(this.businessObject.$type)) {
        this.conditionType = this.businessObject.conditionExpression ? 'Expression' : ''
      }
    },
    // 开始、用户事件通用处理
    nomalHandle () {
      this.extensionElements = this.businessObject.extensionElements || this.moddle.create('bpmn:ExtensionElements', { values: [] })
      this.modeling.updateProperties(this.element, {
        extensionElements: this.extensionElements
      })
    },
    // 开始事件处理
    startEventHandle (type) {
      console.log(type)
    },
    // 用户事件处理
    userTaskHandle (type) {
      this.businessObject.exclusive = true
      console.log(type)
    },
    // 含有事件的开始事件处理
    satrtEventDefinitionHandle () {
      // bpmn:MessageEventDefinition
      // bpmn:TimerEventDefinition
      // bpmn:SignalEventDefinition
      // bpmn:ConditionalEventDefinition
      this.startEventType = this.businessObject.eventDefinitions[0].$type
      this.handle(this.startEventType)
    },
    // 时间类型事件处理
    timerEventHandle (type) {
      if (this.businessObject.eventDefinitions[0].timeDate) {
        this.timeDefinitionType = 'Date'
      } else if (this.businessObject.eventDefinitions[0].timeDuration) {
        this.timeDefinitionType = 'Duration'
      } else if (this.businessObject.eventDefinitions[0].timeCycle) {
        this.timeDefinitionType = 'Cycle'
      }
      if (this.timeDefinitionType) {
        this.FormalExpression = this.businessObject.eventDefinitions[0][`time${this.timeDefinitionType}`]
      }
    },
    handle (type) {
      try {
        this[this.eventTypeHandle[type].handle](type)
      } catch (e) {
        console.log('暂无此类型的事件处理')
      }
    },
    // 箭头类型修改
    updateConditionType (v) {
      if (!v) {
        this.businessObject.conditionExpression && delete this.businessObject.conditionExpression
      } else if (v === 'Expression') {
        this.businessObject.conditionExpression = this.moddle.create('bpmn:FormalExpression', { body: '' })
      }
      this.updateProperties()
    },
    // 时间事件定义类型修改
    updateTime (v) {
      this.businessObject.eventDefinitions[0] = this.moddle.create('bpmn:TimerEventDefinition')
      const name = `time${v}`
      this.FormalExpression = this.moddle.create('bpmn:FormalExpression', { body: '' })
      // var d = new Date();
      // console.log(d.toISOString())
      if (name === 'timeCycle') {
        this.$set(this.FormalExpression, 'endDate', '')
      }
      this.businessObject.eventDefinitions[0][name] = this.FormalExpression
      this.updateProperties()
    },
    // 修改表单
    updateAttr (type, v) {
      this.businessObject[type] = v
      this.updateProperties()
    },
    // 删除表单字段
    delFP () {
      const i = this.formProperty.findIndex(e => e.id === this.currentRow.id)
      this.formProperty.splice(i, 1)
      this.updateProperties()
    },
    // 新增表单字段
    addFP () {
      // activiti:FormProperty里的FormProperty要与activiti.json保持
      const formProperty = this.moddle.create('activiti:FormProperty', { id: 'FormProperty_' + this.random(100000, 999999) })
      this.extensionElements.get('values').push(formProperty)
      this.updateProperties()
      console.log(this.formProperty, this.extensionElements)
    },
    // 修改businessObject
    updateProperties () {
      const obj = {}
      if (this.formType.includes(this.businessObject.$type)) {
        obj.extensionElements = this.extensionElements
      }
      if (['bpmn:TimerEventDefinition'].includes(this.businessObject.$type)) {
        obj.eventDefinitions = this.businessObject.eventDefinitions
      }
      if (['bpmn:SequenceFlow'].includes(this.businessObject.$type)) {
        obj.conditionExpression = this.businessObject.conditionExpression
      } else {
        obj.documentation = this.businessObject.documentation
      }
      this.modeling.updateProperties(this.element, obj)
      console.log(this.businessObject)
    },
    // 获取随机数
    random (lower, upper) {
      return Math.floor(Math.random() * (upper - lower)) + lower
    },
    // 选中表单字段行
    handleCurrentChange (row) {
      this.currentRow = row
    }
  }
}
</script>

<style lang="less" scoped>
.panelWrapper{
  position: fixed;
  right:0;
  top:0;
  border-left:1px solid #ccc;
  height:100%;
  background-color: #f8f8f8;
  width:260px;
  .panelHeader{
    padding: 15px;
    padding-bottom: 5px;
    font-size: 120%;
    font-weight: bolder;
  }
  .panelForm{
    padding:15px;
  }
}
.tableBtn{
  padding:0;
  font-size: 18px;
}
.title {
  line-height: 32px;
  font-size: 16px;
}
</style>
<style lang="less">
.panelForm{
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__label{
    line-height: 20px;
    padding-bottom:0;
  }
}
.fpTable{
  height:150px;
  overflow-y:auto;
  td, th{
    padding:0;
    cursor: pointer;
  }
}
</style>
