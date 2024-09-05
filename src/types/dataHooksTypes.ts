export interface DataFetchParams {
    endpoint: string;
    page?: number;
    pageSize?: number;
    filter?: Record<string, any>;

}