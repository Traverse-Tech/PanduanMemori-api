import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { PatientCaregiver, Prisma } from '@prisma/client'

@Injectable()
export class PatientCaregiverRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        data: Prisma.PatientCaregiverCreateInput,
        tx?: Prisma.TransactionClient
    ): Promise<PatientCaregiver> {
        const prisma = tx || this.prisma
        return prisma.patientCaregiver.create({ data })
    }

    async findByPatientAndCaregiver(
        patientId: string,
        caregiverId: string
    ): Promise<PatientCaregiver | null> {
        return this.prisma.patientCaregiver.findFirst({
            where: {
                patientId,
                caregiverId,
            },
        })
    }

    async findByPatient(patientId: string): Promise<PatientCaregiver[]> {
        return this.prisma.patientCaregiver.findMany({
            where: {
                patientId,
                isDeleted: false,
            },
        })
    }

    async findByCaregiver(caregiverId: string): Promise<PatientCaregiver[]> {
        return this.prisma.patientCaregiver.findMany({
            where: {
                caregiverId,
                isDeleted: false,
            },
        })
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.patientCaregiver.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })
    }

    async restore(id: string): Promise<void> {
        await this.prisma.patientCaregiver.update({
            where: { id },
            data: {
                isDeleted: false,
                deletedAt: null,
            },
        })
    }
} 