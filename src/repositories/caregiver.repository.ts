import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCaregiverInterface, GetPeerCaregiverInterface } from './interfaces/caregiverRepository.interface'
import { Address, Caregiver, Prisma } from '@prisma/client'

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
                patientId: patientId,
            },
        })
    }

    async getCaregiver(caregiverId: string): Promise<Caregiver> {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: {
                id: caregiverId,
            }
        })

        return caregiver
    }

    async getPeerCaregivers(caregiverId: string): Promise<GetPeerCaregiverInterface[]> {
        const { patientId } = await this.getCaregiver(caregiverId)

        const peerCaregivers = await this.prisma.caregiver.findMany({
            where: {
                patientId: patientId,
                NOT: { id: caregiverId }
            },
            select: {
                id: true,
                user: {
                    select: {
                        name: true
                    }
                }
            }
        }).then((caregivers) =>
            caregivers.map((caregiver) => ({
                id: caregiver.id,
                name: caregiver.user.name
            } as GetPeerCaregiverInterface))
        );

        return peerCaregivers
    }

    async getCaregiverWithAddress(
        caregiverId: string
    ): Promise<Caregiver & { address: Address }> {
        const caregiverWithAddress = await this.prisma.caregiver.findUnique({
            where: {
                id: caregiverId,
            },
            include: {
                address: true,
            },
        })

        return caregiverWithAddress
    }
}
