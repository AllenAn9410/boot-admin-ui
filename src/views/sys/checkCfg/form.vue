<script setup lang="ts">
import { ref } from "vue";
import ReSegmented from "@/components/ReSegmented";
import { checkCfgFormRules } from "./utils/rules";
import { enabledOptions } from "@/utils/constants";
import { checkCfgItem } from "./utils/itemHook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

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

const {
  cfgItemSearchData,
  cfgItemTableData,
  permissions
} = checkCfgItem(newFormInline.value);
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
  <PureTableBar :columns="cfgItemTableData.columns">
      <template #title>
        <div>
          <el-button
            v-auth="permissions.add"
            type="primary"
            :icon="useRenderIcon('ri:add-fill')"
            @click="handleAdd(newFormInline)"
            >新增字典项</el-button
          >
          <el-button type="primary" :icon="useRenderIcon('ri:import-fill')"
            >导入</el-button
          >
          <el-button type="primary" :icon="useRenderIcon('ri:export-fill')"
            >导出</el-button
          >
          <el-link
            type="primary"
            :icon="useRenderIcon('ri:download-fill')"
            :underline="false"
            class="ml-2"
            >模板下载</el-link
          >
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <PureTable
          ref="tableRef"
          row-key="id"
          border
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          align-whole="center"
          table-layout="auto"
          :loading="tableData.loading"
          :size="size"
          :data="tableData.dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-current-change="handleChangeCurrentPage"
          @page-size-change="handleChangePageSize"
        >
          <template #operation="{ row }">
            <div class="flex justify-center items-center">
              <el-link
                v-auth="permissions.edit"
                class="reset-margin"
                type="primary"
                :underline="false"
                @click="handleEdit(row, newFormInline)"
              >
                修改 <el-divider direction="vertical" />
              </el-link>
              <el-popconfirm title="确认删除吗？" @confirm="handleDelete(row)">
                <template #reference>
                  <el-link
                    v-auth="permissions.delete"
                    class="reset-margin"
                    type="danger"
                    :underline="false"
                  >
                    删除
                  </el-link>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </PureTable>
      </template>
    </PureTableBar>
</template>

