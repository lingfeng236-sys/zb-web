<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDictStore } from '@/stores/dict'

defineOptions({
  name: 'DictSelect',
})

// 接收父组件传来的参数
const props = defineProps({
  // 绑定值 (v-model)
  modelValue: {
    type: [String, Number, Array],
    default: '',
  },
  // 字典编码 (必填，例如 'packaging_version')
  dictCode: {
    type: String,
    required: true,
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请选择',
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 是否可清空
  clearable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])
const dictStore = useDictStore()
const options = ref([])
const loading = ref(false)

// 计算属性实现 v-model 的双向绑定
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val) // 触发 change 事件，方便父组件监听
  },
})

// 初始化获取数据
const initData = async () => {
  if (!props.dictCode) return
  loading.value = true
  // 调用 Store 的方法，如果有缓存直接拿，没有缓存去请求
  options.value = await dictStore.getDict(props.dictCode)
  loading.value = false
}

// 挂载时加载数据
onMounted(() => {
  initData()
})

// 监听 dictCode 变化（防止父组件动态修改了 code）
watch(
  () => props.dictCode,
  () => {
    initData()
  },
)
</script>

<template>
  <el-select
    v-model="innerValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :loading="loading"
    style="width: 100%"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
