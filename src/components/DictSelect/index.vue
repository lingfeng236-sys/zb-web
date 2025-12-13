<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDictStore } from '@/stores/dict'
import { Male, Female } from '@element-plus/icons-vue' // 引入图标（可选，如果需要特定图标）

defineOptions({
  name: 'DictSelect',
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: '',
  },
  dictCode: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  // 新增：强制使用 Select 模式（即使只有2个选项也显示下拉框）
  forceSelect: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])
const dictStore = useDictStore()
const options = ref([])
const loading = ref(false)

// 双向绑定处理
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// 计算是否显示为 Radio 模式
// 条件：非多选 + 选项数量小于等于2 + 未强制开启Select模式 + 数据加载完成
const showAsRadio = computed(() => {
  if (props.multiple) return false
  if (props.forceSelect) return false
  if (loading.value) return false // 加载中还是显示 Select 或 Loading 比较好
  return options.value.length > 0 && options.value.length <= 2
})

// 初始化数据
const initData = async () => {
  if (!props.dictCode) return
  loading.value = true
  options.value = await dictStore.getDict(props.dictCode)
  loading.value = false
}

onMounted(() => {
  initData()
})

watch(
  () => props.dictCode,
  () => {
    initData()
  },
)
</script>

<template>
  <div class="dict-select-container">
    <el-radio-group v-if="showAsRadio" v-model="innerValue" class="dict-radio-group">
      <el-radio v-for="item in options" :key="item.value" :value="item.value" border>
        <div class="radio-content">
          <el-icon v-if="item.label.includes('男')"><Male /></el-icon>
          <el-icon v-if="item.label.includes('女')"><Female /></el-icon>
          <span>{{ item.label }}</span>
        </div>
      </el-radio>
    </el-radio-group>

    <el-select
      v-else
      v-model="innerValue"
      :placeholder="placeholder"
      :clearable="clearable"
      :multiple="multiple"
      :loading="loading"
      style="width: 100%"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<style scoped>
.dict-select-container {
  width: 100%;
}

.dict-radio-group {
  display: flex;
  width: 100%;
  justify-content: space-between; /* 两端对齐 */
}

/* 深度选择器：强制让 el-radio 占满一半宽度，看起来整齐 */
:deep(.el-radio) {
  flex: 1; /* 平分宽度 */
  margin-right: 10px;
  display: flex;
  justify-content: center;
}

:deep(.el-radio:last-child) {
  margin-right: 0;
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
