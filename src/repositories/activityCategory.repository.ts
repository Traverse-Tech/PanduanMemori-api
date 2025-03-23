import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ActivityCategory } from '@prisma/client'

@Injectable()
export class ActivityCategoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<ActivityCategory> {
        return this.prisma.activityCategory.findUnique({
            where: { id, isDeleted: false },
        })
    }
}
