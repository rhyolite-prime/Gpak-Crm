import type { ActivityLog, DashboardSummaryStats, BaseApiResponse, BasePaginationModel,} from "~/models";


export async function getActivityLogs(query: object) {

  const response = await httpClient<BaseApiResponse<BasePaginationModel<ActivityLog[]>>>('dashboard/getactivitylogs', { query });
  return response.result;
}


export async function getSummaryStats(query: object) {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<DashboardSummaryStats[]>>>('dashboard/getsummarystats', { query });
  return response.result;
}