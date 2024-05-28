import { h, onMounted, reactive, ref } from "vue";
import editForm from "../form.vue";
import type { OptionsType } from "@/components/ReSegmented";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemCheckCfgProps, FormItemCheckCfgItemProps } from "./types";
import { addDialog } from "@/components/ReDialog";
import { pageCheckCfg } from "@/api/sys/checkCfg";
import * as checkCfgApi from "@/api/sys/checkCfg";
import { message } from "@/utils/message";
import { isFunction } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { addDrawer, closeDrawer } from "@/components/ReDrawer";
import { enabledOptions, usePublicHooks } from "@/utils/constants";

export function checkCfg() {
  const formRef = ref();
  const treeRef = ref();

  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();

  const permission = reactive({
    query: ["sys:role:list"],
    save: ["sys:role:add"],
    edit: ["sys:role:update"],
    delete: ["sys:role:delete"],
    assignPermission: ["sys:role:assignPermission"]
  });
  const searchData = reactive<{
    show: boolean;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: OptionsType[];
    };
    data: any;
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "input",
        label: "项目名称",
        options: {
          prop: "projectName",
          placeholder: "请输入项目名称",
          clearable: true
        }
      },
      {
        type: "select",
        label: "状态",
        options: {
          prop: "enabled",
          placeholder: "请选择状态",
          clearable: true,
          dataSourceKey: "enabledOptions",
          selectOptionKey: {
            label: "label",
            value: "value",
            prop: "value"
          }
        }
      }
    ],
    dataSource: {
      enabledOptions: enabledOptions
    }
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const tableData = reactive<{
    loading: boolean;
    dataList: Array<any>;
    columns: TableColumnList;
  }>({
    columns: [
      {
        label: "项目名称",
        prop: "projectName"
      },
      {
        label: "WT项目ID",
        prop: "worktileProjectId"
      },
      {
        label: "WT账户",
        prop: "worktileAccId"
      },
      {
        label: "WT账户密码",
        prop: "worktileAccPwd"
      },
      {
        label: "SVN账户",
        prop: "svnAccId"
      },
      {
        label: "SVN账户密码",
        prop: "svnAccPwd"
      },
      {
        label: "拥有者账号",
        prop: "ownPhone"
      },
      {
        label: "状态",
        cellRenderer: scope => (
          <el-switch
            size={scope.props.size === "small" ? "small" : "default"}
            loading={switchLoadMap.value[scope.index]?.loading}
            v-model={scope.row.enabled}
            active-value={true}
            inactive-value={false}
            active-text="已启用"
            inactive-text="已停用"
            inline-prompt
            style={switchStyle.value}
            onChange={() => onChange(scope as any)}
          />
        ),
        minWidth: 90
      },
      {
        label: "创建时间",
        prop: "created",
        minWidth: 120
      },
      {
        label: "操作",
        fixed: "right",
        width: 190,
        slot: "operation"
      }
    ],
    loading: false,
    dataList: []
  });

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        row.enabled = !row.enabled ? false : true;
        const { success } = await updateRole(row);
        if (success) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.enabled ? "启用" : "停用"}${row.name}`, {
            type: "success"
          });
          onSearch();
        }
      })
      .catch(() => {
        row.enabled = row.enabled ? false : true;
      });
  }

  function openDialog(title = "新增", data?: FormItemCheckCfgProps) {
    addDialog({
      title: `${title}配置`,
      props: {
        formInline: {
          id: data?.id ?? undefined,
          projectName:  data?.projectName ?? "",
          worktileProjectId:  data?.worktileProjectId ?? "",
          worktileAccId:  data?.worktileAccId ?? "",
          worktileAccPwd:  data?.worktileAccPwd ?? "",
          svnAccId:  data?.svnAccId ?? "",
          svnAccPwd:  data?.svnAccPwd ?? "",
          ownPhone:  data?.ownPhone ?? "",
          enabled: data?.enabled ?? true
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemCheckCfgProps;
        function chores() {
          message(`保存成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (curData.id) {
              await updateRole(curData);
              chores();
            } else {
              await addCheckCfg(curData);
              chores();
            }
          }
        });
      }
    });
  }

  function handleSetSearchForm(data?: any) {
    searchData.data = data;
  }
  function handleChangeCurrentPage(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handleChangePageSize(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize,
      sorts: "created desc"
    };
    const { success, data } = await pageCheckCfg(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }

  async function handleDeleteCheckCfg(row: any) {
    const { success } = await deleteCheckCfg(row.id);
    if (success) {
      message(`已删除${row.projectName}`, { type: "success" });
      onSearch();
    }
  }

  async function addCheckCfg(data: FormItemCheckCfgProps) {
    return checkCfgApi.saveCheckCfg(data);
  }
  async function updateRole(data: FormItemCheckCfgProps) {
    return checkCfgApi.updateCheckCfg(data);
  }
  async function deleteCheckCfg(id: string) {
    return checkCfgApi.delCheckCfg(id);
  }
  async function assignPermission(id: string, permissionIds?: string[]) {
    // return roleApi.assignPermission(id, permissionIds);
    return null;
  }

  async function openDrawer(title = "新增", row?: FormItemCheckCfgItemProps) { 
    addDrawer({
      props: {
        formInline: {
          id: row?.id || undefined,
          cfgId: row?.cfgId || "",
          svnPath: row?.svnPath || "",
          enabled: row?.enabled || true
        }
      },
      title: `${title}配置`,
      width: "50%",
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef })
    })
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchData,
    pagination,
    tableData,
    permission,
    openDialog,
    handleSetSearchForm,
    onSearch,
    handleChangeCurrentPage,
    handleChangePageSize,
    handleDeleteCheckCfg,
    openDrawer
  };
}
