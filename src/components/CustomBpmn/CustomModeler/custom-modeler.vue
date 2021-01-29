<template>
  <div class="containers">
    <div class="canvas" ref="canvas" />
    <div id="js-properties-panel" class="panel"></div>
  </div>
</template>

<script>
// import BpmnModeler from 'bpmn-js/lib/Modeler'
import CustomModeler from './CustomModeler'
 
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import transactionBoundariesModule from 'bpmn-js-transaction-boundaries';

import { xmlStr } from '../../mock/xmlStr'
import customTranslate from './custom-translate/custom-translate'


var customTranslateModule = { translate: [ 'value', customTranslate ] };

export default {

  data(){
    return {    
      bpmnModeler: null,
      xmlStr: null
   }
  },
  async mounted() {
    const canvas = this.$refs.canvas;
    // 生成实例
    this.bpmnModeler = new CustomModeler({
      container: canvas,    
      additionalModules:[
　　　]
    });

    // this.bpmnModeler = new Modeler({
    //   container: this.$refs.canvas
    // })
    this.xmlStr = xmlStr
    
    try {
      const { warnings } = await this.bpmnModeler.importXML(xmlStr)
      // 调整在正中间
      this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')

      var transactionBoundaries = bpmnModeler.get('transactionBoundaries');
      transactionBoundaries.show();


      console.log('rendered')
    } catch (err) {
      console.log('error rendering', err)
    }
  }
}
</script>


<style scoped>


 /*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
  @import './css/app.less';
 
</style>