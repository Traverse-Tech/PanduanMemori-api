import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { EmergencyLog, Prisma } from '@prisma/client'

@Injectable()
export class EmergencyLogRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.EmergencyLogCreateInput): Promise<EmergencyLog> {
        return this.prisma.emergencyLog.create({ data })
    }

    async findMany(params: {
        where: Prisma.EmergencyLogWhereInput
    }): Promise<EmergencyLog[]> {
        return this.prisma.emergencyLog.findMany(params)
    }
}
