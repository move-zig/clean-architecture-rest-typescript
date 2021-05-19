import { logger } from '../../frameworks/winston';
import { WinstonLogger } from './winstonLogger';

export interface ILogger {
  error: (message: string, ...meta: unknown[]) => void;
  warn: (message: string, ...meta: unknown[]) => void;
  info: (message: string, ...meta: unknown[]) => void;
}

export const winstonLogger = new WinstonLogger(logger);
