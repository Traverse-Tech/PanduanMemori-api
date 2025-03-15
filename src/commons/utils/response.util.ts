import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ResponseInterface } from '../interfaces/utils.interface'

@Injectable()
export class ResponseUtil {
    response(
        { responseCode, responseMessage, responseStatus }: ResponseInterface,
        data?: any
    ) {
        const responseBody = {
            responseCode: responseCode ?? HttpStatus.OK,
            responseMessage: responseMessage ?? 'Data retrieved successfully',
            responseStatus: responseStatus ?? 'SUCCESS',
            ...data,
        }

        Logger.log(responseBody, 'Response Body')

        return responseBody
    }
}
