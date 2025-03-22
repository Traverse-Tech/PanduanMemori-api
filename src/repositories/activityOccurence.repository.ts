import { Injectable } from '@nestjs/common'
import { Prisma, ActivityOccurence } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ActivityOccurenceRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        data: Prisma.ActivityOccurenceCreateInput,
        tx?: Prisma.TransactionClient
    ): Promise<ActivityOccurence> {
        const prisma = tx || this.prisma
        return prisma.activityOccurence.create({
            data,
        })
    }

    async createMany(
        data: Prisma.ActivityOccurenceCreateManyInput[],
        skipDuplicates: boolean,
        tx?: Prisma.TransactionClient
    ): Promise<Prisma.BatchPayload> {
        const prisma = tx || this.prisma
        return prisma.activityOccurence.createMany({
            data,
            skipDuplicates,
        })
    }

    async update(
        data: Prisma.ActivityOccurenceUpdateInput,
        tx?: Prisma.TransactionClient
    ): Promise<ActivityOccurence> {
        const prisma = tx || this.prisma
        return prisma.activityOccurence.update({
            where: { id: data.id as string },
            data,
        })
    }

    async updateMany(
        where: Prisma.ActivityOccurenceWhereInput,
        data: Partial<ActivityOccurence>,
        tx?: Prisma.TransactionClient
    ): Promise<Prisma.BatchPayload> {
        const prisma = tx || this.prisma
        return prisma.activityOccurence.updateMany({
            where,
            data,
        })
    }

    async getOccurrencesByActivityId(
        activityId: string
    ): Promise<ActivityOccurence[]> {
        return this.prisma.activityOccurence.findMany({
            where: { activityId, isDeleted: false },
            include: {
                activity: true,
            },
        })
    }

    async getOccurrencesByActivityIdAndDateRange(
        activityId: string,
        startDate: Date,
        endDate: Date
    ): Promise<ActivityOccurence[]> {
        return this.prisma.activityOccurence.findMany({
            where: {
                activityId,
                isDeleted: false,
                datetime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                activity: true,
                recurrence: true,
            },
            orderBy: {
                datetime: 'asc',
            },
        })
    }

    async deleteManyFutureOccurrences(
        where: Prisma.ActivityOccurenceWhereInput
    ): Promise<Prisma.BatchPayload> {
        return this.prisma.activityOccurence.updateMany({
            where: {
                ...where,
                datetime: {
                    gte: new Date(), // only delete occurrences that haven't passed
                },
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })
    }

    async deleteMany(
        where: Prisma.ActivityOccurenceWhereInput
    ): Promise<Prisma.BatchPayload> {
        return this.prisma.activityOccurence.updateMany({
            where,
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })
    }

    async findById(id: string): Promise<ActivityOccurence> {
        return this.prisma.activityOccurence.findUnique({
            where: { id },
        })
    }
}
