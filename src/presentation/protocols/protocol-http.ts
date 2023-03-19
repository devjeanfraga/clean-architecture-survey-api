export interface HttpRequest {
  headers?: any;
  body?: any; 
  params?: any; 
  accountId?: string;
}

export interface HttpResponse {
  statusCode: number;
  body?: any; 
}