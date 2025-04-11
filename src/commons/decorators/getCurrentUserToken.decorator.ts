import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetCurrentUserToken = createParamDecorator(
    (_: undefined, context: ExecutionContext): number => {
        const req = context.switchToHttp().getRequest()
        return req.token
    }
)
