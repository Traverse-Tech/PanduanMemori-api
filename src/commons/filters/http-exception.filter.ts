import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { Prisma } from '@prisma/client'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response = context.getResponse<Response>()
        const request = context.getRequest<Request>()

        const isPrismaError =
            exception instanceof Prisma.PrismaClientKnownRequestError ||
            exception instanceof Prisma.PrismaClientUnknownRequestError ||
            exception instanceof Prisma.PrismaClientRustPanicError ||
            exception instanceof Prisma.PrismaClientInitializationError ||
            exception instanceof Prisma.PrismaClientValidationError

        const handlePrismaQueryError =
            process.env.NODE_ENV.toLowerCase() === 'production' && isPrismaError

        const responseCode = handlePrismaQueryError
            ? HttpStatus.BAD_REQUEST
            : exception instanceof HttpException
              ? exception.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR

        const responseDetails =
            exception instanceof HttpException ? exception.getResponse() : null;

        const responseMessage = handlePrismaQueryError
            ? 'Invalid query'
            : typeof responseDetails === 'object' && !!responseDetails && 'message' in responseDetails
                ? responseDetails.message
                : exception.message;
        
        const errorDescription =
            typeof responseDetails === "object" && !!responseDetails && "description" in responseDetails
                ? responseDetails.description
                : undefined;

        const exceptionMessage =
            exception.response?.statusCode === 400
                ? `
            Validation Error: ${exception.response?.message}
      
            Stack Trace: ${exception.stack}
            `
                : exception.stack

        Logger.error(
            exceptionMessage,
            `Exception ${request.method} ${request.url}`
        )

        const responseData = {
            responseMessage,
            responseCode,
            responseStatus: 'FAILED',
            errorDescription
        }

        return response.status(responseCode).json(responseData)
    }
}
