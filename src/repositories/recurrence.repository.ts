import { Injectable } from '@nestjs/common'
import { Recurrence, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class RecurrenceRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        data: Prisma.RecurrenceCreateInput,
        tx?: Prisma.TransactionClient
    ): Promise<Recurrence> {
        const prisma = !!tx ? tx : this.prisma
        return prisma.recurrence.create({
            data,
        })
    }

    async deleteMany(
        where: Prisma.RecurrenceWhereInput
    ): Promise<Prisma.BatchPayload> {
        return this.prisma.recurrence.updateMany({
            where,
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })
    }

    async findByActivityId(activityId: string): Promise<Recurrence[]> {
        return this.prisma.recurrence.findMany({
            where: {
                activityId,
                isDeleted: false,
            },
        })
    }
}
