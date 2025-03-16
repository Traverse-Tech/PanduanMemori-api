import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCaregiverInterface } from './interfaces/caregiverRepository.interface'
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
