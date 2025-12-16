<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import BpmnViewer from 'bpmn-js/lib/Viewer'

defineOptions({
  name: 'ProcessViewer',
})

// 定义 Props
const props = defineProps({
  xml: {
    type: String,
    required: true,
  },
  activeActivityIds: {
    type: Array,
    default: () => [],
  },
  finishedActivityIds: {
    type: Array,
    default: () => [],
  },
})

const canvasRef = ref(null)
let viewer = null

// 初始化查看器
const initViewer = () => {
  if (viewer) viewer.destroy()

  viewer = new BpmnViewer({
    container: canvasRef.value,
    height: 400, // 高度可自适应或固定
  })
}

// 渲染图表并高亮
const renderDiagram = async () => {
  if (!props.xml || !viewer) return

  try {
    await viewer.importXML(props.xml)

    // 获取 canvas 对象用于添加样式
    const canvas = viewer.get('canvas')

    // 1. 高亮已完成节点
    props.finishedActivityIds.forEach((id) => {
      try {
        canvas.addMarker(id, 'highlight-finished')
      } catch (e) {
        // 忽略找不到元素的错误（例如连线）
      }
    })

    // 2. 高亮当前进行中节点
    props.activeActivityIds.forEach((id) => {
      try {
        canvas.addMarker(id, 'highlight-active')
        // 可选：将视图中心移动到当前节点
        // const element = viewer.get('elementRegistry').get(id)
        // if(element) canvas.scrollToElement(element)
      } catch (e) {}
    })

    // 自适应缩放
    canvas.zoom('fit-viewport')
  } catch (err) {
    console.error('流程图渲染失败:', err)
  }
}

onMounted(() => {
  initViewer()
  if (props.xml) renderDiagram()
})

// 监听数据变化重新渲染
watch(
  () => props.xml,
  () => {
    renderDiagram()
  },
)

onBeforeUnmount(() => {
  if (viewer) viewer.destroy()
})
</script>

<template>
  <div class="process-viewer-container">
    <div ref="canvasRef" class="canvas"></div>
  </div>
</template>

<style lang="scss">
.process-viewer-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  background-color: #fff;

  .canvas {
    width: 100%;
    height: 100%;
  }
}

/* 定义高亮样式 - 需要是全局样式或不带scoped，因为bpmn-js是动态插入DOM的 */
/* 进行中：红色边框 + 浅红背景 */
.highlight-active > .djs-visual > :nth-child(1) {
  stroke: #e6a23c !important; /* 橙色 */
  stroke-width: 3px !important;
  fill: #fdf6ec !important;
}

/* 已完成：绿色边框 */
.highlight-finished > .djs-visual > :nth-child(1) {
  stroke: #67c23a !important;
  stroke-width: 2px !important;
  fill: #f0f9eb !important;
}
</style>
