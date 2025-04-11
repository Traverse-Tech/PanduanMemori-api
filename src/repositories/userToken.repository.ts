import { Injectable } from '@nestjs/common'
import { Prisma, UserToken } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserTokenInterface } from './interfaces/userTokenRepository.interface'

@Injectable()
export class UserTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        { userId, token, deactivatedAfter }: CreateUserTokenInterface,
        tx?: Prisma.TransactionClient
    ): Promise<UserToken> {
        const prisma = !!tx ? tx : this.prisma
        const userToken = await prisma.userToken.create({
            data: {
                userId,
                token,
                deactivatedAfter,
            },
        })

        return userToken
    }

    async updateUserActiveTokensToInactive(
        userId: string,
        tx?: Prisma.TransactionClient
    ) {
        const prisma = !!tx ? tx : this.prisma
        await prisma.userToken.updateMany({
            where: {
                userId: userId,
                status: 'ACTIVE',
            },
            data: {
                status: 'NONACTIVE',
            },
        })
    }

    async updateUserActiveTokenToInactive(
        token: string,
        tx?: Prisma.TransactionClient
    ) {
        const prisma = !!tx ? tx : this.prisma
        await prisma.userToken.update({
            where: {
                token: token,
            },
            data: {
                status: 'NONACTIVE',
            },
        })
    }

    async updateUserActiveTokensToBlacklisted(
        userId: string,
        tx?: Prisma.TransactionClient
    ) {
        const prisma = !!tx ? tx : this.prisma
        await prisma.userToken.updateMany({
            where: {
                userId: userId,
                status: 'ACTIVE',
            },
            data: {
                status: 'BLACKLISTED',
                blacklistedAt: new Date(),
            },
        })
    }

    async findToken(token: string): Promise<UserToken> {
        const tokenObj = this.prisma.userToken.findFirst({
            where: {
                token: token,
            },
        })

        return tokenObj
    }

    async findUserBlacklistedToken(userId: string): Promise<UserToken> {
        const blacklistedToken = this.prisma.userToken.findFirst({
            where: {
                userId: userId,
                status: 'BLACKLISTED',
            },
        })

        return blacklistedToken
    }
}
