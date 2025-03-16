import { ConflictException as NestConflictException } from '@nestjs/common'

export class ConflictException extends NestConflictException {
    constructor(message: string, description?: string) {
        if (!!description) super({ message: message, description: description })
        else super(message)
    }
}
