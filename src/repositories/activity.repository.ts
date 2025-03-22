import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Activity, Prisma, Recurrence } from '@prisma/client'

@Injectable()
export class ActivityRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        data: Prisma.ActivityCreateInput,
        tx?: Prisma.TransactionClient
    ): Promise<Activity> {
        const prisma = !!tx ? tx : this.prisma
        const activity = await prisma.activity.create({
            data,
        })

        return activity
    }

    async getActivitiesByPatientId(
        patientId: string
    ): Promise<(Activity & { recurrences: Recurrence[] })[]> {
        return this.prisma.activity.findMany({
            where: {
                patientId,
                isDeleted: false,
            },
            include: {
                recurrences: {
                    where: {
                        isDeleted: false,
                    },
                },
            },
        })
    }

    async findById(id: string): Promise<Activity> {
        return this.prisma.activity.findUnique({
            where: { id },
        })
    }

    async update(data: Prisma.ActivityUpdateInput): Promise<Activity> {
        const { id, ...updateData } = data
        return this.prisma.activity.update({
            where: { id: id as string },
            data: updateData,
        })
    }
}
