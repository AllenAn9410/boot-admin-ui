import type { FormRules } from "element-plus";
import { reactive } from "vue";

export const checkCfgFormRules = reactive(<FormRules>{
  projectName: [{ required: true, message: "项目名称", trigger: "blur" }],
  worktileProjectId: [{ required: true, message: "项目ID", trigger: "blur" }]
});
