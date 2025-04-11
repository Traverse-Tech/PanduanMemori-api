import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { RepositoriesService } from 'src/repositories/repositories.service'
import { AuthenticatedRequestInterface } from './auth.interface'
import { UnauthorizedException } from 'src/commons/exceptions/unauthorized.exception'
import { IS_PUBLIC_ACCESSIBLE } from 'src/commons/decorators/decorator.constant'
import { User } from '@prisma/client'
import {
    ROLE_PERMISSION,
    USER_BLOCKED_ERROR_DESCRIPTION,
    USER_BLOCKED_ERROR_MESSAGE,
} from './auth.constant'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        private readonly repository: RepositoriesService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const INVALID_TOKEN_ERROR_MESSAGE = 'Token tidak valid'
        const UNAUTHORIZED_ERROR_DESCRIPTION = 'Silahkan masuk kembali'

        const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequestInterface>()

        Logger.log(
            request.body,
            `Req ${request.method} ${request.url} from ${request.ips}`
        )

        if (this.getMetadataStatus(context, IS_PUBLIC_ACCESSIBLE)) return true

        const rawToken = this.extractTokenFromHeader(request)
        if (rawToken) {
            try {
                const { userId } = await this.jwtService.verifyAsync(rawToken, {
                    secret: process.env.APP_ACCESS_SECRET,
                })

                const tokenObj =
                    await this.repository.userToken.findToken(rawToken)
                if (!!tokenObj && tokenObj.status === 'ACTIVE') {
                    const user = await this.repository.user.findById(userId)
                    if (await this.checkUserBlockStatus(user.id))
                        throw new UnauthorizedException(
                            USER_BLOCKED_ERROR_MESSAGE,
                            USER_BLOCKED_ERROR_DESCRIPTION
                        )

                    request.user = user
                    request.token = rawToken

                    return this.getPermissionStatus(context, user)
                }

                throw new UnauthorizedException(
                    INVALID_TOKEN_ERROR_MESSAGE,
                    UNAUTHORIZED_ERROR_DESCRIPTION
                )
            } catch (error) {
                let errorMessage = ''
                let errorDescription = UNAUTHORIZED_ERROR_DESCRIPTION
                if (error.name === 'TokenExpiredError')
                    errorMessage = 'Token kedaluwarsa'
                else if (
                    'response' in error &&
                    !!error.response &&
                    'message' in error.response
                )
                    errorMessage = error.response.message
                else errorMessage = INVALID_TOKEN_ERROR_MESSAGE

                if (
                    'response' in error &&
                    !!error.response &&
                    'description' in error.response
                )
                    errorDescription = error.response.description

                throw new UnauthorizedException(errorMessage, errorDescription)
            }
        }

        return false
    }

    private getMetadataStatus(context: ExecutionContext, metadata: string) {
        return this.reflector.getAllAndOverride<boolean>(metadata, [
            context.getHandler(),
            context.getClass(),
        ])
    }

    private extractTokenFromHeader(req: AuthenticatedRequestInterface) {
        const [type, token] = req.headers.authorization?.split(' ') ?? []
        return type === process.env.APP_ACCESS_TOKEN_PREFIX ? token : undefined
    }

    private getPermissionStatus(context: ExecutionContext, user: User) {
        const { role } = user

        for (const index in ROLE_PERMISSION) {
            if (this.getMetadataStatus(context, ROLE_PERMISSION[index].metada))
                if (role !== ROLE_PERMISSION[index].role) return false
        }

        return true
    }

    private async checkUserBlockStatus(userId: string) {
        const blacklistedToken =
            await this.repository.userToken.findUserBlacklistedToken(userId)
        if (blacklistedToken)
            await this.repository.userToken.updateUserActiveTokensToBlacklisted(
                userId
            )

        return !!blacklistedToken
    }
}
