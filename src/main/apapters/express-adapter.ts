import { Request, Response } from "express";
import { Controller } from "../../presentation/protocols/protocol-controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/protocol-http";

export const makeRouteAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest:HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);
    const { statusCode } = httpResponse;
    if( statusCode >= 200 && statusCode <= 299 ) res.status(httpResponse.statusCode).json(httpResponse.body);
    else {
      res
        .status(httpResponse.statusCode)
        .json({ 
          error: httpResponse.body.stack
        });
    }
  };
};