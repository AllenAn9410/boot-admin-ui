<script setup lang="ts">
import { ref } from "vue";
import { FormCheckCfgItemProps } from "./utils/types";
import ReCol from "@/components/ReCol";
import Segmented from "@/components/ReSegmented";
import { enabledOptions } from "@/utils/constants";

const prop = withDefaults(defineProps<FormCheckCfgItemProps>(), {
  formInline: () => ({
    id: undefined,
    cfgId: "",
    svnPath: "",
    enabled: true,
    cfg: undefined
  })
});

const ruleFormRef = ref();
const newFormInline = ref(prop.formInline);
function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="82px">
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="SVN路径" prop="dict">
          <el-input
            v-model="newFormInline.svnPath"
            clearable
            placeholder="请输入SVN路径"
            disabled
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="是否启用" prop="enabled">
          <Segmented
            v-model="newFormInline.enabled"
            :options="enabledOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.enabled = value;
              }
            "
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
