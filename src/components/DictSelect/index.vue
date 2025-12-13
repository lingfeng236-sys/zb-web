<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDictStore } from '@/stores/dict'
import { DictShowType } from '@/enums/DictEnum'

defineOptions({
  name: 'DictSelect',
})

const props = defineProps({
  modelValue: {
    // 后端 code 是 Integer，前端可能是 Number 或 String，这里兼容一下
    type: [String, Number, Array, Boolean],
    default: '',
  },
  dictType: {
    type: String,
    required: true,
  },
  // 显示类型: 'select' | 'radio' | 'button'
  type: {
    type: String,
    default: DictShowType.SELECT,
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
  // === 优化点：默认值改为后端统一的 code 和 desc ===
  propMap: {
    type: Object,
    default: () => ({ label: 'desc', value: 'code' }),
  },
})

const emit = defineEmits(['update:modelValue', 'change'])
const dictStore = useDictStore()
const options = ref([])
const loading = ref(false)

// 双向绑定代理
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// 初始化数据
const initData = async () => {
  if (!props.dictType) return
  loading.value = true
  // Store 获取的数据结构应该是 [{ code: 1, desc: '男' }, ...]
  options.value = await dictStore.getDict(props.dictType)
  loading.value = false
}

onMounted(() => {
  initData()
})

watch(
  () => props.dictType,
  () => initData(),
)
</script>
“

<template>
  <div class="dict-select-container">
    <el-radio-group v-if="type === DictShowType.BUTTON" v-model="innerValue">
      <el-radio-button
        v-for="item in options"
        :key="item[propMap.value]"
        :value="item[propMap.value]"
      >
        {{ item[propMap.label] }}
      </el-radio-button>
    </el-radio-group>

    <el-radio-group
      v-else-if="type === DictShowType.RADIO"
      v-model="innerValue"
      class="dict-radio-group"
    >
      <el-radio
        v-for="item in options"
        :key="item[propMap.value]"
        :value="item[propMap.value]"
        border
      >
        {{ item[propMap.label] }}
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
        :key="item[propMap.value]"
        :label="item[propMap.label]"
        :value="item[propMap.value]"
      >
        <template v-if="$slots.default">
          <slot :item="item"></slot>
        </template>
      </el-option>
    </el-select>
  </div>
</template>

<style scoped>
.dict-select-container {
  display: inline-block;
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
