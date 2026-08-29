import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { DomainError } from "../domain/domain.error";

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const exception = new BadRequestException(error.message);

    response.status(exception.getStatus()).json(exception.getResponse());
  }
}
