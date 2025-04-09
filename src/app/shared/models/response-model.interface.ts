export interface IResponseModel<T>{
    status: StatusResponse;
    data: T;
    createdAt: Date;
}

interface StatusResponse {
    message: string;
    isError: boolean;
    status: number;
    statusString: string;
}