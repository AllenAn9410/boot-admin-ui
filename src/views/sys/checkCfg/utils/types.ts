interface FormItemCheckCfgProps {
  id?: string;
  projectName: string;
  worktileProjectId: string;
  worktileAccId: string;
  worktileAccPwd: string;
  svnAccId: string;
  svnAccPwd: string;
  ownPhone: string;
  enabled: boolean;
}

interface FormItemCheckCfgItemProps {
  id?: string;
  cfgId?: string;
  svnPath?: string;
  enabled?: boolean;
  sysCheckCfg?: FormItemCheckCfgProps; 
}

interface FormCheckCfgProps { 
  formInline: FormItemCheckCfgProps
}

interface FormCheckCfgItemProps { 
  formInline: FormItemCheckCfgItemProps
}


export type {
  FormItemCheckCfgProps,
  FormItemCheckCfgItemProps,
  FormCheckCfgProps,
  FormCheckCfgItemProps
};
