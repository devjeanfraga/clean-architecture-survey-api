import {HttpRequest, HttpResponse} from './protocol-http'

export interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>
}