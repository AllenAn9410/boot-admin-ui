import type { FormCheckCfgItemProps, FormCheckCfgProps, FormItemCheckCfgProps, FormItemCheckCfgItemProps } from "./types";
import { enabledMap, enabledOptions, usePublicHooks } from "@/utils/constants";
import { h, onMounted, reactive, ref } from "vue";
import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import type { OptionsType } from "@/components/ReSegmented";
import type { PaginationProps } from "@pureadmin/table";
import * as checkCfgApi from "@/api/sys/checkCfg";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import editForm from "../itemForm.vue";
import * as dictApi from "@/api/sys/dict";

export function checkCfgItem(checkCfgItem?: FormItemCheckCfgProps) { 
  const { tagEnabledStyle } = usePublicHooks();
  const formRef = ref();
  const cfgItem = ref(checkCfgItem);
  const permissions = reactive({
    query: ["sys:dict:item:query"],
    add: ["sys:dict:item:save"],
    edit: ["sys:dict:item:update"],
    delete: ["sys:dict:item:delete"]
  });
  const cfgItemSearchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: OptionsType[];
    };
  }>({
    show: false,
    data: {},
    formItems: [
      {
        label: "SVN路径",
        type: "input",
        options: {
          prop: "svnPath",
          placeholder: "请输入SVN路径"
        }
      },
      {
        label: "状态",
        type: "select",
        options: {
          prop: "enabled",
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
  const cfgItemTableData = reactive<{
    loading: boolean;
    dataList: Array<any>;
    columns: TableColumnList;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        label: "SVN路径",
        prop: "svnPath",
        align: "center"
      },
      {
        label: "状态",
        prop: "enabled",
        align: "center",
        cellRenderer: ({ row, props }) => (
          <el-tag
            size={props.size}
            style={tagEnabledStyle.value(row.enabled)}
            effect="plain"
          >
            {enabledMap[row.enabled]}
          </el-tag>
        )
      },
      {
        label: "创建时间",
        prop: "created",
        align: "center"
      },
      {
        label: "操作",
        align: "center",
        fixed: "right",
        slot: "operation"
      }
    ]
  });

  async function handleAdd(cfg: FormItemCheckCfgProps) {
    if (!cfg) {
      message("请先保存字典", { type: "warning" });
      return;
    }
    if (!cfg.id) {
      message("请先保存字典", { type: "warning" });
      return;
    }
    openDialog("新增", { cfg: checkCfg });
  }

  function handleSetSearchForm(data?: any) {
    cfgItemSearchData.data = data;
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
    cfgItemTableData.loading = true;
    const params = {
      ...cfgItemSearchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize,
      sorts: "sort"
    };
    const { success, data } = await checkCfgApi.pageCheckCfg(params).finally(() => {
      cfgItemTableData.loading = false;
    });
    if (success) {
      cfgItemTableData.dataList = data?.records || [];
      pagination.total = data?.total || 0;
    }
  }
async function openDialog(title = "新增", data?: FormItemCheckCfgItemProps) {
    addDialog({
      title: `${title}字典项`,
      props: {
        formInline: {
          id: data.id ?? undefined,
          cfg: data.cfg ?? cfgItem.value,
          svnPath: data.svnPath ?? "",
          enabled: data.enabled ?? true
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemCheckCfgItemProps;
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
              const { success } = await dictApi.updateDictItem(curData);
              if (success) {
                chores();
              }
            } else {
              const { success } = await dictApi.saveDictItem(curData);
              if (success) {
                chores();
              }
            }
          }
        });
      }
    });
  }

  return {
    cfgItemSearchData,
    cfgItemTableData,
    permissions,
    pagination,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    onSearch
  };

}