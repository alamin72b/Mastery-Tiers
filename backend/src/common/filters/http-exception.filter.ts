import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 1. Get the raw response from NestJS
    const exceptionResponse = exception.getResponse();

    // 2. Define the exact shape instead of using 'any'
    // NestJS errors usually contain an optional message and error string.
    const parsedResponse = exceptionResponse as {
      message?: string | string[];
      error?: string;
    };

    response.status(status).json({
      success: false,
      statusCode: status,
      message: parsedResponse.message || exception.message,
      error: parsedResponse.error
        ? [parsedResponse.error]
        : [exception.message],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
