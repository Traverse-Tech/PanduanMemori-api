import { Global, Module } from '@nestjs/common'
import { RepositoriesService } from './repositories.service'
import { UserRepository } from './user.repository'
import { CaregiverRepository } from './caregiver.repository'
import { AddressRepository } from './address.repository'
import { PatientRepository } from './patient.repository'
import { UserTokenRepository } from './userToken.repository'

@Global()
@Module({
    imports: [],
    providers: [
        RepositoriesService,
        UserRepository,
        PatientRepository,
        CaregiverRepository,
        AddressRepository,
        UserTokenRepository,
    ],
    exports: [RepositoriesService],
})
export class RepositoriesModule {}
