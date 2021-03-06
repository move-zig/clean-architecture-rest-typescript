import type { Request, Response } from 'express';

export abstract class BaseController<RequestDTO> {

  protected req: Request;
  protected res: Response;

  public constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  /** Outside entry point */
  public async execute(): Promise<void> {
    const dto = await this.validate();
    if (dto !== false) {
      await this.executeImpl(dto);
    }
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

  /** Validates the input and returns a DTO if successful, false otherwise */
  protected abstract validate(): Promise<RequestDTO | false>;

  /** Calls the interactor and handles the response */
  protected abstract executeImpl(requestDTO: RequestDTO): Promise<void>;
}
