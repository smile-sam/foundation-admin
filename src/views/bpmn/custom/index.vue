<template>
  <div class="containers">
    <div class="canvas" ref="canvas" />   
  </div>
</template>

<script>
// import Modeler from 'bpmn-js/lib/Viewer'
import Modeler from 'bpmn-js/lib/Modeler'
import { xmlStr } from '../../../mock/xmlStr'


export default {

  data(){
    return {    
      bpmnModeler: null,
      xmlStr: null
   }
  },
  async mounted() {
    this.bpmnModeler = new Modeler({
      container: this.$refs.canvas
    })
    this.xmlStr = xmlStr
    
    try {
      const { warnings } = await this.bpmnModeler.importXML(xmlStr)
      // 调整在正中间
      this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
      console.log('rendered')
    } catch (err) {
      console.log('error rendering', err)
    }
  }
}
</script>


<style scoped>
.canves {
  width: 100%;
  height: 100vh;
}
</style>