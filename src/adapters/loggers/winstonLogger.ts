import winston from 'winston';

import { ILogger } from '.';

export class WinstonLogger implements ILogger {

  public constructor(private readonly winstonLogger: winston.Logger) { /* empty */ }

  public error(message: string, ...meta: unknown[]): void {
    this.winstonLogger.error(message, meta);
  }

  public warn(message: string, ...meta: unknown[]): void {
    this.winstonLogger.warn(message, meta);
  }

  public info(message: string, ...meta: unknown[]): void {
    this.winstonLogger.info(message, meta);
  }
}
