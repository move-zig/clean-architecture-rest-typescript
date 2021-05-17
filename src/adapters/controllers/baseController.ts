import { Request, Response } from 'express';

export abstract class BaseController {

  // the only way we interact with these is through the public execute
  // method and the protected methods it calls, so we can be sure that
  // req and res are defined

  protected req!: Request;
  protected res!: Response;

  /** main entry point */
  public async execute(req: Request, res: Response): Promise<void> {
    this.req = req;
    this.res = res;

    await this.executeImpl();
  }

  // Success responses

  protected ok<T>(value: T): void {
    this.res.send(value);
  }

  protected created<T>(value: T): void {
    this.res.status(201).send(value);
  }

  protected noContent(): void {
    this.res.status(204).end();
  }

  // Client error responses

  protected badRequest(message?: string): void {
    this.res.status(400).send(message ?? 'Bad Request');
  }

  protected unauthorized(message?: string): void {
    this.res.status(401).send(message ?? 'Unauthorized');
  }

  protected forbidden(message?: string): void {
    this.res.status(403).send(message ?? 'Forbidden');
  }

  protected notFound(message?: string): void {
    this.res.status(404).send(message ?? 'Not Found');
  }

  // Server error responses

  protected internalServerError(message?: string): void {
    this.res.status(500).send(message ?? 'Internal Server Error');
  }

  /** controller-specific functionality */
  protected abstract executeImpl(): Promise<void>;
}
