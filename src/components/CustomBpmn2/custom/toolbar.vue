<template>
  <div style="margin: 20px">
    <el-row>
      <el-col :span="1" />
      <el-col :span="23">
        <!-- <el-space :size="40"> -->
          <el-button-group>
            <el-button size="small" type="primary" @click="processZoomIn" icon="el-icon-folder-opened">
              <el-icon type="left" /><el-icon type="upload" />导入
            </el-button>
            <el-dropdown @command="saveBpmn">
              <el-button size="small" type="primary" icon="el-icon-download">
                <el-icon type="download" />下载
              </el-button>
              <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="svg">下载SVG</el-dropdown-item>
                    <el-dropdown-item command="bpmn">下载BPMN</el-dropdown-item>
                    <el-dropdown-item command="xml">下载XML</el-dropdown-item>
                  </el-menu>              
              </el-dropdown-menu>
              </el-dropdown>
            <el-button size="small" type="primary" @click="showModal" icon="el-icon-view">
              <el-icon type="code" />预览<el-icon type="right" />
            </el-button>
          </el-button-group>
          <el-button-group>
            <el-button size="small" type="primary" @click="processZoomIn" icon="el-icon-zoom-in">
              <el-icon type="left" /><el-icon type="zoom-in" />放大
            </el-button>
            <el-button size="small" type="primary" @click="processReZoom" icon="el-icon-refresh">
              <el-icon type="reload" />
            </el-button>
            <el-button size="small" type="primary" @click="processZoomOut" icon="el-icon-zoom-out">
              缩小<el-icon type="zoom-out" /><el-icon type="right" />
            </el-button>
          </el-button-group>
          <el-button-group>
            <el-button size="small" type="primary" @click="processZoomIn" icon="el-icon-edit-outline">
              <el-icon type="left" /> <el-icon type="save" />暂存
            </el-button>
            <el-button size="small" type="primary" @click="processReZoom" icon="el-icon-edit-outline">
              <el-icon type="deployment-unit" />部署
            </el-button>
            <el-button size="small" type="primary" @click="processZoomOut" icon="el-icon-document-copy">
              <el-icon type="sync" />同步
            </el-button>
            <el-button size="small" type="primary" @click="processZoomOut" icon="el-icon-back">
              <el-icon type="history" />回退
            </el-button>
            <el-button ghost size="small" type="primary" @click="processZoomOut" icon="el-icon-delete">
              <el-icon type="delete" />清空<el-icon type="right" />
            </el-button>
          </el-button-group>
        <!-- </el-space> -->
      </el-col>
    </el-row>

    <!--预览home-->    
    <!-- <el-modal
      v-model="visible"
      title="预览XML"
      keyboard
      centered
      width="80%"
    >
      <pre v-highlightjs="this.showXml"><code class="xml" /></pre>
      <template slot="footer">
        <el-button key="back" @click="handleCancel">关闭</el-button>
      </template>
    </el-modal> -->
    <!--预览end-->
  </div>
</template>

<script>
// import 'highlight.js/styles/gradient-light.css'
// import 'highlight.js/styles/dracula.css'
import 'highlight.js/styles/an-old-hope.css'

export default {
  name: 'Toolbar',
  components: {
  },
  props: {
    toolbarModeler: Object
  },
  data() {
    return {
      defaultZoom: 1,
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      showXml: ''
    }
  },
  methods: {
    /* 打开modal*/
    showModal() {
      this.visible = true
      this.previewProcessXML()
    },
    handleCancel() {
      this.visible = false
    },

    /* 放大视图*/
    processZoomIn() {
      this.defaultZoom = Math.floor(this.defaultZoom * 10 + 1) / 10
      this.toolbarModeler.get('canvas').zoom(this.defaultZoom)
    },
    /* 缩小视图*/
    processZoomOut() {
      this.defaultZoom = Math.floor(this.defaultZoom * 10 - 1) / 10
      this.toolbarModeler.get('canvas').zoom(this.defaultZoom)
    },
    /* 重置视图*/
    processReZoom() {
      this.defaultZoom = 1
      this.toolbarModeler.get('canvas').zoom('fit-viewport', 'auto')
    },
    /* 预览xml*/
    previewProcessXML() {
      this.toolbarModeler.saveXML({ format: true }).then(({ xml }) => {
        console.log(xml)
        this.showXml = xml
      })
    },
    /* 载为SVG*/
    saveSVG(done) {
      this.toolbarModeler.saveSVG(done)
    },
    /* 下载为bpmn*/
    async saveBpmn(type) {
      if (type === 'xml' || type === 'bpmn') {
        const { err, xml } = await this.toolbarModeler.saveXML()
        // 读取异常时抛出异常
        if (err) {
          return console.error(err)
        }
        const { href, filename } = this.setEncoded(type.toUpperCase(), xml)
        this.downloadFunc(href, filename)
      } else {
        const { err, svg } = await this.toolbarModeler.saveSVG()
        // 读取异常时抛出异常
        if (err) {
          return console.error(err)
        }
        const { href, filename } = this.setEncoded('SVG', svg)
        this.downloadFunc(href, filename)
      }
    },
    /* 根据所需类型进行转码并返回下载地址*/
    setEncoded(type, data) {
      const encodedData = encodeURIComponent(data)
      const businessObject = this.toolbarModeler.get('elementRegistry').find(el => el.type === 'bpmn:Process').businessObject
      console.log()
      return {
        filename: businessObject.id + `.${type}`,
        href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
        data: data
      }
    },
    /* 下载文件 */
    downloadFunc(href, filename) {
      if (href && filename) {
        const a = document.createElement('a')
        a.download = filename // 指定下载的文件名
        a.href = href //  URL对象
        a.click() // 模拟点击
        URL.revokeObjectURL(a.href) // 释放URL 对象
      }
    }
  }
}
</script>

<style scoped>

</style>
