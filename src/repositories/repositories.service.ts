import { Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { CaregiverRepository } from './caregiver.repository'
import { AddressRepository } from './address.repository'
import { PatientRepository } from './patient.repository'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserTokenRepository } from './userToken.repository'

@Injectable()
export class RepositoriesService {
    constructor(
        readonly prisma: PrismaService,
        readonly user: UserRepository,
        readonly patient: PatientRepository,
        readonly caregiver: CaregiverRepository,
        readonly address: AddressRepository,
        readonly userToken: UserTokenRepository
    ) {}
}
