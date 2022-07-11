import type { APIGatewayProxyResultV2 } from "aws-lambda";
import { StatusCodes } from "http-status-codes";

export class Response {
  static json = <T>(statusCode: number, body?: T): APIGatewayProxyResultV2 => {
    const response: APIGatewayProxyResultV2 = { statusCode };

    if (body !== undefined) {
      response.body = JSON.stringify(body);
      response.headers = {
        "Content-Type": "application/json",
      };
    }

    return response;
  };

  static ok = <T>(body: T): APIGatewayProxyResultV2 => {
    return this.json<T>(StatusCodes.OK, body);
  };

  static created = <T>(body: T): APIGatewayProxyResultV2 => {
    return this.json<T>(StatusCodes.CREATED, body);
  };

  static noContent = (): APIGatewayProxyResultV2 => {
    return this.json(StatusCodes.NO_CONTENT);
  };

  static notFound = (): APIGatewayProxyResultV2 => {
    return this.json(StatusCodes.NOT_FOUND);
  };

  static forbidden = (): APIGatewayProxyResultV2 => {
    return this.json(StatusCodes.FORBIDDEN);
  };

  static unprocessableEntity = (): APIGatewayProxyResultV2 => {
    return this.json(StatusCodes.UNPROCESSABLE_ENTITY);
  };

  static internalServerError = (code: string, reason: string): APIGatewayProxyResultV2 => {
    return this.json(StatusCodes.INTERNAL_SERVER_ERROR, { code, reason });
  };

  static badGateway = (code: string, reason: string): APIGatewayProxyResultV2 => {
    return this.json(StatusCodes.BAD_GATEWAY, { code, reason });
  };
}
