import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ResponseInterface } from '../interfaces/utils.interface'

@Injectable()
export class ResponseUtil {
    /**
     * Format the response message to ensure consistency across all API responses. Please use this function every time an API returns a response.
     * @param {ResponseInterface} responseObj
     * @param {any} [data]
     * @return {object}
     */
    response(
        { responseCode, responseMessage, responseStatus }: ResponseInterface,
        data?: any
    ): object {
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
