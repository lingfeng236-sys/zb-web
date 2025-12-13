// 这就像 Java 里的 public class DictTypeEnum { ... }

// 使用 const 定义对象
export const DictShowType = {
  SELECT: 'select', // 下拉框
  RADIO: 'radio', // 单选框
  BUTTON: 'button', // 按钮式单选
}

// 可选：冻结对象，防止后续代码不小心修改了它（类似 Java 的 final）
Object.freeze(DictShowType)
