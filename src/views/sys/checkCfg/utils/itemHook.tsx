import type { FormCheckCfgItemProps, FormCheckCfgProps, FormItemCheckCfgProps, FormItemCheckCfgItemProps } from "./types";
import { enabledMap, enabledOptions, usePublicHooks } from "@/utils/constants";
import { h, onMounted, reactive, ref } from "vue";
import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import type { OptionsType } from "@/components/ReSegmented";
import type { PaginationProps } from "@pureadmin/table";
import * as checkCfgApi from "@/api/sys/checkCfg";

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

}