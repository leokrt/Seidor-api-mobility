export class HttpException extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestException extends HttpException {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(404, message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    super(500, message);
  }
}
