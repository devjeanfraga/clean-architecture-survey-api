import { Request, Response, NextFunction} from "express";
import { Controller } from "../../presentation/protocols/protocol-controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/protocol-http";

export const makeMiddlewareAdapter = (controller: Controller) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest:HttpRequest = {
      headers: req.headers
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);
    const { statusCode } = httpResponse;
    if( statusCode >= 200 && statusCode <= 299 ) {
      { httpResponse.body, httpRequest.headers }
      next();
    }
    else {
      res
        .status(httpResponse.statusCode)
        .json({ 
          error: httpResponse.body.stack
        });
    }
  };
};