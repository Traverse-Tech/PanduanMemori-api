import { UnauthorizedException as NestUnauthorizedException } from '@nestjs/common'

export class UnauthorizedException extends NestUnauthorizedException {
    constructor(message: string, description?: string) {
        if (!!description) super({ message: message, description: description })
        else super(message)
    }
}
