import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP API REQUEST');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, baseUrl } = req;
    this.logger.log(`${ip}:${method} ${baseUrl}`);
    next();
  }
}
