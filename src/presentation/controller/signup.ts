import {Controller} from '../protocols/protocol-controller';

export class SignUpController implements Controller {
  handle(httpResquest: any): any {
    if (!httpResquest.name)
    return {
      statusCode: 400,
      body: new Error("Missing param: name")
    };
    if (!httpResquest.email)
    return {
      statusCode: 400,
      body: new Error("Missing param: email")
    };
  }
}