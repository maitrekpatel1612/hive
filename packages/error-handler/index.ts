export class AppError extends Error {
  // Public readonly for the properties so that they can be accessed but not modified
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message:string, statusCode:number, isOperational = true, details? : any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  } 
}
