<script setup lang="ts">
import { ref } from "vue";
import ReSegmented from "@/components/ReSegmented";
import { checkCfgFormRules } from "./utils/rules";
import { enabledOptions } from "@/utils/constants";
import { checkCfgItem } from "./utils/itemHook";
import type {
  FormItemCheckCfgItemProps,
  FormItemCheckCfgProps,
  FormCheckCfgItemProps,
  FormCheckCfgProps
} from "./utils/types";

const props = withDefaults(defineProps<FormCheckCfgProps>(), {
  formInline: () => ({
    id: "",
    projectName: "",
    worktileProjectId: "",
    worktileAccId: "",
    worktileAccPwd: "",
    svnAccId: "",
    svnAccPwd: "",
    ownPhone: "",
    enabled: true
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const refreshInfo = (data: FormItemCheckCfgProps) => {
  newFormInline.value = data;
};

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });

const {} = checkCfgItem(newFormInline.value);
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="checkCfgFormRules"
    label-width="82px"
  >
    <el-form-item label="项目名称" prop="projectName">
      <el-input
        v-model="newFormInline.projectName"
        clearable
        placeholder="请输入项目名称"
        :disabled="!!newFormInline.id"
      />
    </el-form-item>

    <el-form-item label="WT ID" prop="worktileProjectId">
      <el-input
        v-model="newFormInline.worktileProjectId"
        clearable
        placeholder="请输入worktile ID"
      />
    </el-form-item>

    <el-form-item label="WT账号" prop="worktileAccId">
      <el-input
        v-model="newFormInline.worktileAccId"
        clearable
        placeholder="请输入worktile账号"
      />
    </el-form-item>

    <el-form-item label="WT密码" prop="worktileAccPwd">
      <el-input
        v-model="newFormInline.worktileAccPwd"
        clearable
        placeholder="请输入worktile密码"
      />
    </el-form-item>

    <el-form-item label="SVN账号" prop="svnAccId">
      <el-input
        v-model="newFormInline.svnAccId"
        clearable
        placeholder="请输入SVN账号"
      />
    </el-form-item>

    <el-form-item label="SVN密码" prop="svnAccPwd">
      <el-input
        v-model="newFormInline.svnAccPwd"
        clearable
        placeholder="请输入SVN密码"
      />
    </el-form-item>
    <el-form-item label="拥有者" prop="ownPhone">
      <el-input
        v-model="newFormInline.ownPhone"
        clearable
        placeholder="请输入拥有者"
      />
    </el-form-item>
  </el-form>
</template>
