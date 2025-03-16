import { BadRequestException as NestBadRequestException } from '@nestjs/common';

export class BadRequestException extends NestBadRequestException {
    constructor(message: string, description?: string) {
        if (!!description) 
            super({ message, description })
        else
            super(message)
    }
}
