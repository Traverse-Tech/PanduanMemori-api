import { Injectable } from '@nestjs/common'
import { Prisma, ActivityOccurence } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateManyFutureOccurrencesDatetime } from './interfaces/activityOccurenceRepository.interface'

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

    async updateOccurenceConnection(
        where: Prisma.ActivityOccurenceWhereUniqueInput,
        data: {
            activityId: string,
            recurrenceId: string | null,
            datetime: Date,
            isCompleted: boolean
        },
        tx?: Prisma.TransactionClient
    ): Promise<ActivityOccurence> {
        const prisma = tx || this.prisma
        return prisma.activityOccurence.update({
            where,
            data,
        })
    }

    async update(
        where: Prisma.ActivityOccurenceWhereUniqueInput,
        data: Prisma.ActivityOccurenceUpdateInput,
        tx?: Prisma.TransactionClient
    ): Promise<ActivityOccurence> {
        const prisma = tx || this.prisma
        return prisma.activityOccurence.update({
            where,
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
            where: { id, isDeleted: false },
        })
    }

    async updateManyFutureOccurrencesDateTime(
        data: UpdateManyFutureOccurrencesDatetime,
        tx?: Prisma.TransactionClient
    ) {
        const prisma = tx || this.prisma
        const { activityId, hoursDiff, minutesDiff, fromDate } = data
        const occurrences = await prisma.activityOccurence.findMany({
            where: {
                activityId,
                datetime: {
                    gte: fromDate,
                },
            },
        })

        const updates = occurrences.map((occurrence) => {
            const newDate = new Date(occurrence.datetime)
            newDate.setHours(newDate.getHours() + hoursDiff)
            newDate.setMinutes(newDate.getMinutes() + minutesDiff)

            return prisma.activityOccurence.update({
                where: { id: occurrence.id },
                data: { datetime: newDate },
            })
        })

        return Promise.all(updates)
    }
}
