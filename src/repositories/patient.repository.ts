import { Injectable } from '@nestjs/common'
import { CreatePatientInterface } from './interfaces/patientRepository.interface'
import { Address, Patient, Prisma, User } from '@prisma/client'
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

    async getPatient(patientId: string): Promise<Patient> {
        const patient = await this.prisma.patient.findUnique({
            where: {
                id: patientId,
            },
        })

        return patient
    }

    async getPatientWithSafeLocation(patientId: string): Promise<
        Patient & {
            user: User
            safeLocation: Address
            caregivers: {
                caregiver: { user: { phoneNumber: string; email: string } }
            }[]
        }
    > {
        const patientWithSafeLocation = await this.prisma.patient.findUnique({
            where: {
                id: patientId,
            },
            include: {
                user: true,
                safeLocation: true,
                caregivers: {
                    include: {
                        caregiver: {
                            include: {
                                user: {
                                    select: {
                                        phoneNumber: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        return patientWithSafeLocation
    }

    async findByIds(ids: string[]): Promise<Patient[]> {
        return this.prisma.patient.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })
    }
}
