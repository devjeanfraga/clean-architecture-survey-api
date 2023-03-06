import { SuperTest , Test} from 'supertest';
import { HttpResponse, HttpRequest } from './src/presentation/protocols/protocol-http';

declare global {
  var testRequest: SuperTest<Test>
  var fakeRequest: HttpRequest
  var fakeResponse: HttpResponse
  //var testRequest: import('supertest').SuperTest<import('supertest').Test>
}
export {};
