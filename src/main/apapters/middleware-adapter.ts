import { Request, Response, NextFunction} from "express";
import { Middleware } from "../../presentation/protocols";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/protocol-http";

export const makeMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest:HttpRequest = {
      headers: req.headers
    };

    const httpResponse: HttpResponse = await middleware.handle(httpRequest);
    const { statusCode } = httpResponse;
    if( statusCode >= 200 && statusCode <= 299 ) { 
      Object.assign(req, httpResponse.body) //req.accountId = httpResponse.body.accountId
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