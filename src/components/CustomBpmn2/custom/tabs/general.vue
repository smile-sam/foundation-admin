<template>
  <div>
    <el-collapse v-model="activeKey" @change="changeActivekey">
      <template #expandIcon="props">
        <el-icon type="minus" :rotate="props.isActive ? 90 : 0" />
      </template>
      <el-collapse-item title="常规信息" header="常规信息" name="常规信息">

        <label v-if="elementType === 'bpmn:StartEvent'">开始</label>
        <label v-else-if="elementType === 'bpmn:Process'">流程</label>
        <label v-else-if="elementType === 'bpmn:SequenceFlow'">连线</label>
        <label v-else-if="elementType === 'bpmn:Task'">任务</label>
        <label v-else-if="elementType === 'bpmn:ExclusiveGateway'">网关</label>
        <label v-else-if="elementType === 'bpmn:EndEvent'">结束</label>标识：
        <el-input
          v-model="activeElementBusiness.id"
          size="small"
          disabled
          @change="updateBaseInfo('id', activeElementBusiness.id)"
        />
        <br><br>
        <label v-if="elementType === 'bpmn:StartEvent'">开始</label>
        <label v-else-if="elementType === 'bpmn:Process'">流程</label>
        <label v-else-if="elementType === 'bpmn:SequenceFlow'">连线</label>
        <label v-else-if="elementType === 'bpmn:Task'">任务</label>
        <label v-else-if="elementType === 'bpmn:ExclusiveGateway'">网关</label>
        <label v-else-if="elementType === 'bpmn:EndEvent'">结束</label>名称：
        <el-input
          v-model="activeElementBusiness.name"
          size="small"

          @change="updateBaseInfo('name', activeElementBusiness.name)"
        />
        <br><br>
        <label v-if="elementType === 'bpmn:Process'">
          流程标签：
          <el-input
            v-model="activeElementBusiness.versionTag"
            size="small"

            @change="updateBaseInfo('versionTag', activeElementBusiness.versionTag)"
          />
          <br><br>
          流程类型：
          <el-input
            v-model="activeElementBusiness.type"
            size="small"

            @change="updateBaseInfo('type', activeElementBusiness.type)"
          />
          <br><br>
          可执行：
          <el-radio-group
            v-model="activeElementBusiness.isExecutable"
                        @change="updateBaseInfo('isExecutable', activeElementBusiness.isExecutable)"
          >            
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </label>
      </el-collapse-item>
      <el-collapse-item
        title="任务配置" 
        v-if="elementType === 'bpmn:Process'"
        header="任务配置"
      >
        任务优先级：
        <el-input
          v-model="activeElementBusiness.taskPriority"
          size="small"

          @change="updateBaseInfo('taskPriority', activeElementBusiness.taskPriority)"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType === 'bpmn:Process'"
        title="工作配置" 
        header="工作配置"
      >
        工作优先级：
        <el-input
          v-model="activeElementBusiness.jobPriority"
          size="small"

          @change="updateBaseInfo('jobPriority', activeElementBusiness.jobPriority)"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType === 'bpmn:Process'"
        header="启动配置"
        title="启动配置" 
      >
        候选组：
        <el-input
          v-model="activeElementBusiness.candidateStarterGroups"
          size="small"

          @change="updateBaseInfo('candidateStarterGroups', activeElementBusiness.candidateStarterGroups)"
        />
        <br><br>
        候选人：
        <el-input
          v-model="activeElementBusiness.candidateStarterUsers"
          size="small"

          @change="updateBaseInfo('candidateStarterUsers', activeElementBusiness.candidateStarterUsers)"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType === 'bpmn:Process'"
        header="历史配置"
        title="历史配置" 
      >
        历史生存时间：
        <el-input
          v-model="activeElementBusiness.historyTimeToLive"
          size="small"

          @change="updateBaseInfo('historyTimeToLive', activeElementBusiness.historyTimeToLive)"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType === 'bpmn:Process'"
        header="Task配置"
        title="Task配置" 
      >
        任务列表启动：
        <el-input
          v-model="activeElementBusiness.isStartableInTasklist"
          size="small"

          @change="updateBaseInfo('isStartableInTasklist', activeElementBusiness.isStartableInTasklist)"
        />
      </el-collapse-item>
      <el-collapse-item
        header="备注"
        title="备注" 
      >
        备注信息：
        <el-input
          v-model="documentation"
          size="small"
          @change="updateDocumentation"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'General',
  props: {
    generalModeler: Object,
    elementId: String
  },
  data() {
    return {
      activeElementBusiness: {},
      elementType: '',
      activeName: '',
      activeKey: ['常规信息'],
      documentation: ''
    }
  },
  computed: {

  },
  watch: {
    elementId(newVal, oldVar) {
      this.elementRegistry = this.generalModeler.get('elementRegistry')
      this.modeling = this.generalModeler.get('modeling')
      this.bpmnFactory = this.generalModeler.get('bpmnFactory')
      const element = this.elementRegistry.get(newVal)
      this.elementType = element.type
      this.activeElementBusiness = Object.assign({}, element.businessObject)
      // 备注
      const shapeDoc = element.businessObject.documentation
      // 设置备注
      // this.documentation = shapeDoc && shapeDoc.length ? shapeDoc[0]?.text : ''
      this.documentation = shapeDoc && shapeDoc.length ? shapeDoc[0] && shapeDoc[0].text : ''
    }
  },
  methods: {
    changeActivekey(key) {
      console.log(key)
    },
    // 更新常规信息
    updateBaseInfo(key, value) {
      const shape = this.elementRegistry.get(this.elementId)
      const attrObj = {}
      attrObj[key] = value
      this.modeling.updateProperties(shape, attrObj)
    },
    // 更新元素文档
    updateDocumentation() {
      const element = this.elementRegistry.get(this.elementId)
      const documentation = this.bpmnFactory.create('bpmn:Documentation', { text: this.documentation })
      this.modeling.updateProperties(element, {
        documentation: [documentation]
      })
    }
  }
}
</script>

<style scoped>

</style>
