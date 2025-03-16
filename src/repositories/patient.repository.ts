import { Injectable } from '@nestjs/common'
import { CreatePatientInterface } from './interfaces/patientRepository.interface'
import { Patient, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class PatientRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        { userId, birthdate, gender, safeLocationId }: CreatePatientInterface,
        tx?: Prisma.TransactionClient
    ): Promise<Patient> {
        const prisma = !!tx ? tx : this.prisma
        const address = await prisma.patient.create({
            data: {
                gender,
                safeLocationId,
                id: userId,
                birthdate,
            },
        })

        return address
    }
}
