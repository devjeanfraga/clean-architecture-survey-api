import {HttpRequest, HttpResponse} from './protocol-http'

export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>
}