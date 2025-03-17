import { NotFoundException as NestNotFoundException } from '@nestjs/common'

export class NotFoundException extends NestNotFoundException {
    constructor(message: string, description?: string) {
        if (!!description) super({ message, description })
        else super(message)
    }
}
