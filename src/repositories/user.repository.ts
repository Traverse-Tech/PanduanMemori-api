import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { CreateUserInterface } from './interfaces/userRepository.interface'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        {
            name,
            phoneNumber,
            email,
            password,
            registrationNumber,
            role,
        }: CreateUserInterface,
        tx?: Prisma.TransactionClient
    ): Promise<User> {
        const prisma = !!tx ? tx : this.prisma
        const user = await prisma.user.create({
            data: {
                name,
                phoneNumber,
                email,
                password,
                registrationNumber,
                role,
            },
        })

        return user
    }

    async findById(userId: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
        })

        return user
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        return user
    }

    async findByRegistrationNumber(registrationNumber: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                registrationNumber: registrationNumber,
            },
        })

        return user
    }

    async findByPhoneNumber(phoneNumber: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber,
            },
        })

        return user
    }
}
