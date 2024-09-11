export interface DataFetchParams {
    endpoint: string;
    page?: number;
    pageSize?: number;
    selectedFilterValue?: Record<string, any>;

}