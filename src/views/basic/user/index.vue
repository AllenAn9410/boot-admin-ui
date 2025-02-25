<script setup lang="ts">
import { deviceDetection } from "@pureadmin/utils";
import { useUser } from "./utils/hook";
import OrgTree from "./tree.vue";
import { SearchForm } from "@/components/ReSearchForm";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const {
  permission,
  treeOrgData,
  searchData,
  tableData,
  pagination,
  handleCurrentOrg,
  handleSetSearchForm,
  onSearch,
  openDrawer,
  handleChangeCurrentPage,
  handleChangePageSize,
  handleRestPwd,
  deleteUser
} = useUser();

const tableRef = ref();

defineOptions({
  name: "basUserManager"
});
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <OrgTree
      ref="treeRef"
      :class="['mr-2', deviceDetection() ? 'w-full' : 'min-w-[200px]']"
      :tree-data="treeOrgData"
      @tree-select="handleCurrentOrg"
    />
    <div
      :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%-200px)]']"
    >
      <SearchForm
        :show="searchData.show"
        :form-items="searchData.formItems"
        :data-source="searchData.dataSource"
        :permission="permission.query"
        @search-form="handleSetSearchForm"
        @search="onSearch"
      />
      <PureTableBar
        :columns="tableData.columns"
        :table-ref="tableRef?.getTableRef()"
        @refresh="onSearch"
      >
        <template #title>
          <el-button
            v-auth="permission.add"
            type="primary"
            :icon="useRenderIcon('ri:add-fill')"
            @click="openDrawer()"
          >
            新增用户
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            row-key="id"
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
                  v-auth="permission.edit"
                  class="reset-margin"
                  type="primary"
                  :size="size"
                  :underline="false"
                  :disabled="row.system"
                  @click="openDrawer('修改', row)"
                >
                  修改
                </el-link>
                <el-popconfirm
                  :title="`是否删除用户: ${row.username}`"
                  :disabled="row.system"
                  @confirm="deleteUser(row.id)"
                >
                  <template #reference>
                    <el-link
                      v-auth="permission.delete"
                      class="reset-margin"
                      type="danger"
                      :size="size"
                      :underline="false"
                      :disabled="row.system"
                    >
                      <el-divider direction="vertical" />
                      删除
                    </el-link>
                  </template>
                </el-popconfirm>
                <el-dropdown trigger="click">
                  <el-link
                    class="reset-margin"
                    type="primary"
                    :size="size"
                    :underline="false"
                  >
                    <el-divider direction="vertical" />
                    更多
                    <component
                      :is="useRenderIcon('ep:arrow-down-bold')"
                      size="14"
                    />
                  </el-link>
                  <template #dropdown>
                    <el-dropdown-item>
                      <el-link
                        v-auth="permission.resetPwd"
                        :underline="false"
                        :size="size"
                        :disabled="row.system"
                        @click="handleRestPwd(row)"
                      >
                        重置密码
                      </el-link>
                    </el-dropdown-item>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}
</style>
