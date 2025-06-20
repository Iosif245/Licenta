export default interface IReportResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  priority: string;
  targetId: string;
  targetType: string;
  reporterId: string;
  assignedToId?: string;
  attachments?: string[];
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReportSummaryResponse {
  id: string;
  title: string;
  category: string;
  type: string;
  status: string;
  priority: string;
  targetType: string;
  reporterId: string;
  createdAt: string;
}

export interface IReportsListResponse {
  reports: IReportSummaryResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
}
