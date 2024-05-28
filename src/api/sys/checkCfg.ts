import * as http from "../base";

/**
 * 分页查询
 * @param query .
 * @returns .
 */
export function pageCheckCfg(query?: any) {
  return http.get<any, any>(`/sys/checkCfg`, query);
}


/**
 * 保存
 * @param data .
 * @returns .
 */
export function saveCheckCfg(data: any) {
  return http.post<any, any>(`/sys/checkCfg`, data);
}

/**
 * 字典更新
 * @param data .
 * @returns .
 */
export function updateCheckCfg(data: any) {
  return http.put<any, any, string>(`/sys/checkCfg`, {}, data);
}

/**
 * 删除
 * @param id .
 * @returns .
 */
export function delCheckCfg(id: string) {
  return http.del<any, any, string>(`/sys/checkCfg`, { id });
}

