import { Request, Response } from "express";
import { Controller } from "../../presentation/protocols/protocol-controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/protocol-http";

export const makeRouteAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest:HttpRequest = {
      body: req.body
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);
    
    if( httpResponse.statusCode == 200 ) res.status(httpResponse.statusCode).json(httpResponse.body);
    else {
      res
        .status(httpResponse.statusCode)
        .json({ 
          error: httpResponse.body.stack
        });
    }
  };
};