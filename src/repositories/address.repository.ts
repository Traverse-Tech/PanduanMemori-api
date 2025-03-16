import { Injectable } from '@nestjs/common'
import { CreateAddressInterface } from './interfaces/addressRepository.interface'
import { Address, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AddressRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        {
            address,
            latitude,
            longitude
        }: CreateAddressInterface,
        tx?: Prisma.TransactionClient
    ): Promise<Address> {
        const prisma = !!tx? tx : this.prisma
        const addressObj = await prisma.address.upsert({
            where: {
                longitude_latitude: {
                    latitude: latitude,
                    longitude: longitude,
                }
            },
            update: { address: address },
            create: {
                address,
                latitude,
                longitude
            }
        })

        return addressObj
    }
}
