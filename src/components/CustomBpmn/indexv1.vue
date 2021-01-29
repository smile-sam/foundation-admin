<template>
  <div class="containers">
    <div class="canvas" ref="canvas" />
    <div id="js-properties-panel" class="panel"></div>


    <ul class="buttons">
      <li>
        <a href="javascript:" @click="$refs.refFile.click()">加载本地BPMN文件</a>
        <input type="file" id="files" ref="refFile" style="display: none" @change="loadXML" />
      </li>

      <li>
        <a href="javascript:" @click="saveXML" title="保存为bpmn">保存为BPMN文件</a>
      </li>

      <li>
        <a href="javascript:" @click="saveSVG" title="保存为svg">保存为SVG图片</a>
      </li>



      <li>
        <a href="javascript:" ref="saveXML" title="保存为bpmn">保存为BPMN文件</a>
      </li>
      <li>
        <a href="javascript:" ref="saveSvg" title="保存为svg">保存为SVG图片</a>
      </li>
    </ul>
  </div>
</template>

<script>
// import Modeler from 'bpmn-js/lib/Viewer'
import BpmnModeler from 'bpmn-js/lib/Modeler'


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
      container: null,
      canvas: null,
      xmlStr: xmlStr
   }
  },
  methods: {
   

    init() {
       const canvas = this.$refs.canvas;
        // 生成实例
        this.bpmnModeler = new BpmnModeler({
          container: canvas,
          //添加控制板
          propertiesPanel: {
            parent: '#js-properties-panel'
          },
          additionalModules:[
            propertiesPanelModule,
            propertiesProviderModule,
            transactionBoundariesModule,
    　　　　 customTranslateModule
    　　　],
          // needed if you'd like to maintain camunda:XXX properties in the properties panel
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          }
        });

        // this.bpmnModeler = new Modeler({
        //   container: this.$refs.canvas
        // })
        this.xmlStr = xmlStr
        this.createNewDiagram();
    },
    async createNewDiagram() {
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
    },
    success() {
      this.addEventBusListener();
    },
    addEventBusListener() {
      const that = this;
      const eventBus = this.bpmnModeler.get("eventBus");

      eventBus.on("element.click", function(e) {
        console.log("eventBusListener", e);
      });
    },
    elementClick(e) {
      if (e.element.businessObject.$type === "bpmn:UserTask") {
        console.log(
          "这是一个用户节点",
          e.element.businessObject.id,
          e.element.businessObject.$type,
          e.element.businessObject.name
        );
      }
    },
    async saveXML() {
      try {
        const result = await this.bpmnModeler.saveXML({ format: true });
        const { xml } = result;

        var xmlBlob = new Blob([xml], {
          type: "application/bpmn20-xml;charset=UTF-8,"
        });

        var downloadLink = document.createElement("a");
        downloadLink.download = "ops-coffee-bpmn.bpmn";
        downloadLink.innerHTML = "Get BPMN SVG";
        downloadLink.href = window.URL.createObjectURL(xmlBlob);
        downloadLink.onclick = function(event) {
          document.body.removeChild(event.target);
        };
        downloadLink.style.visibility = "hidden";
        document.body.appendChild(downloadLink);
        downloadLink.click();
      } catch (err) {
        console.log(err);
      }
    },
    async saveSVG() {
      try {
        const result = await this.bpmnModeler.saveSVG();
        const { svg } = result;

        var svgBlob = new Blob([svg], {
          type: "image/svg+xml"
        });

        var downloadLink = document.createElement("a");
        downloadLink.download = "ops-coffee-bpmn.svg";
        downloadLink.innerHTML = "Get BPMN SVG";
        downloadLink.href = window.URL.createObjectURL(svgBlob);
        downloadLink.onclick = function(event) {
          document.body.removeChild(event.target);
        };
        downloadLink.style.visibility = "hidden";
        document.body.appendChild(downloadLink);
        downloadLink.click();
      } catch (err) {
        console.log(err);
      }
    },


  },
  
  async mounted() {
    this.init();
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
  /* .containers{
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    .canvas{
      width: 100%;
      height: 100%;
    }
    .bjs-powered-by {
      display: none;
    }
  }
  .canves {
  width: 100%;
  height: 100vh;
} */

/* .containers {
  background: white;
  overflow: auto;
  background-image: linear-gradient(
      90deg,
      rgba(220, 220, 220, 0.5) 6%,
      transparent 0
    ),
    linear-gradient(rgba(192, 192, 192, 0.5) 6%, transparent 0);
  background-size: 12px 12px;
  width: 100%;
  height: calc(100vh - 82px);
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
} */
</style>