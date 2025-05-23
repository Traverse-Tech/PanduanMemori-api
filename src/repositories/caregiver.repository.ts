import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
    CreateCaregiverInterface,
    GetPeerCaregiverInterface,
} from './interfaces/caregiverRepository.interface'
import { Address, Caregiver, Patient, Prisma, User } from '@prisma/client'

@Injectable()
export class CaregiverRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        { userId, addressId }: CreateCaregiverInterface,
        tx?: Prisma.TransactionClient
    ): Promise<Caregiver> {
        const prisma = !!tx ? tx : this.prisma
        const caregiver = await prisma.caregiver.create({
            data: {
                id: userId,
                addressId: addressId,
            },
        })

        return caregiver
    }

    async updatePatient(
        caregiverId: string,
        patientId: string,
        tx?: Prisma.TransactionClient
    ) {
        const prisma = !!tx ? tx : this.prisma
        await prisma.caregiver.update({
            where: {
                id: caregiverId,
            },
            data: {
                patients: {
                    connect: {
                        id: patientId,
                    },
                },
            },
        })
    }

    async getCaregiver(
        caregiverId: string
    ): Promise<Caregiver & { patients: Patient[] }> {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: {
                id: caregiverId,
            },
            include: {
                patients: {
                    include: {
                        patient: true,
                    },
                },
            },
        })

        return {
            ...caregiver,
            patients: caregiver.patients.map((pc) => pc.patient),
        }
    }

    async getPeerCaregivers(
        caregiverId: string
    ): Promise<GetPeerCaregiverInterface[]> {
        const { patients } = await this.getCaregiver(caregiverId)

        const peerCaregivers = await this.prisma.caregiver
            .findMany({
                where: {
                    patients: {
                        some: {
                            patientId: {
                                in: patients.map((p) => p.id),
                            },
                        },
                    },
                    NOT: { id: caregiverId },
                },
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            })
            .then((caregivers) =>
                caregivers.map(
                    (caregiver) =>
                        ({
                            id: caregiver.id,
                            name: caregiver.user.name,
                        }) as GetPeerCaregiverInterface
                )
            )

        return peerCaregivers
    }

    async getCaregiverWithAddress(
        caregiverId: string
    ): Promise<Caregiver & { address: Address; patients: Patient[] }> {
        const caregiverWithAddress = await this.prisma.caregiver.findUnique({
            where: {
                id: caregiverId,
            },
            include: {
                address: true,
                patients: {
                    include: {
                        patient: true,
                    },
                },
            },
        })

        return {
            ...caregiverWithAddress,
            patients: caregiverWithAddress.patients.map((pc) => pc.patient),
        }
    }

    async findByIds(
        ids: string[]
    ): Promise<(Caregiver & { user: User; address: Address })[]> {
        return this.prisma.caregiver.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            include: {
                user: true,
                address: true,
            },
        })
    }
}
