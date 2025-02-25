<script setup lang="ts">
import { useRole } from "./utils/hook";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { SearchForm } from "@/components/ReSearchForm";
const {
  searchData,
  pagination,
  tableData,
  permission,
  openDialog,
  handleSetSearchForm,
  onSearch,
  handleChangeCurrentPage,
  handleChangePageSize,
  handleDeleteRole,
  openPermission
} = useRole();

const tableRef = ref();

defineOptions({
  name: "RoleManager"
});
</script>

<template>
  <div class="main">
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
      @refresh="onSearch()"
    >
      <template #title>
        <el-button
          v-auth="permission.save"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="() => openDialog()"
        >
          新增菜单
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="tableData.loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="tableData.dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :pagination="pagination"
          @page-current-change="handleChangeCurrentPage"
          @page-size-change="handleChangePageSize"
        >
          <template #operation="{ row }">
            <el-link
              v-auth="permission.edit"
              type="primary"
              :underline="false"
              :size="size"
              @click="openDialog('修改', row)"
            >
              修改 <el-divider direction="vertical" />
            </el-link>

            <el-link
              v-auth="permission.assignPermission"
              type="primary"
              :underline="false"
              :size="size"
              @click="openPermission(row)"
            >
              权限 <el-divider direction="vertical" />
            </el-link>

            <el-popconfirm
              :title="`是否确认删除角色名称为${row.name}的这条数据`"
              @confirm="handleDeleteRole(row)"
            >
              <template #reference>
                <el-link
                  v-auth="permission.delete"
                  type="primary"
                  :underline="false"
                  :size="size"
                >
                  删除
                </el-link>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
