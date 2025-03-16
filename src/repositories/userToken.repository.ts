import { Injectable } from '@nestjs/common'
import { Prisma, UserToken } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserTokenInterface } from './interfaces/userTokenRepository.interface'

@Injectable()
export class UserTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        {
            userId,
            token,
            deactivatedAfter
        }: CreateUserTokenInterface,
        tx?: Prisma.TransactionClient
    ): Promise<UserToken> {
        console.log("USER ID: " + userId)
        const prisma = !!tx? tx : this.prisma
        const userToken = await prisma.userToken.create({
            data: {
                userId,
                token,
                deactivatedAfter
            }
        })

        return userToken
    }
}
