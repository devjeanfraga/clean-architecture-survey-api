import { SuperTest , Test} from 'supertest';

declare global {
  var testRequest: SuperTest<Test>
  //var testRequest: import('supertest').SuperTest<import('supertest').Test>
}
export {};
