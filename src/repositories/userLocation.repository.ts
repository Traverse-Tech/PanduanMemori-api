import { Injectable } from '@nestjs/common'
import { Prisma, UserLocation, LocationSource } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UserLocationRepository {
    constructor(private readonly prisma: PrismaService) {}

    async upsert(
        where: Prisma.UserLocationWhereUniqueInput,
        data: {
            update: {
                latitude: number
                longitude: number
                accuracy?: number
                source?: LocationSource
                updatedAt?: Date
            }
            create: {
                userId: string
                latitude: number
                longitude: number
                accuracy?: number
                source?: LocationSource
                createdAt?: Date
            }
        }
    ): Promise<UserLocation> {
        return this.prisma.userLocation.upsert({
            where,
            update: data.update,
            create: data.create,
        })
    }

    async findUnique(
        where: Prisma.UserLocationWhereUniqueInput
    ): Promise<UserLocation | null> {
        return this.prisma.userLocation.findUnique({
            where,
        })
    }

    async findByUserId(userId: string): Promise<UserLocation | null> {
        return this.prisma.userLocation.findFirst({
            where: {
                userId,
            },
        })
    }
}
