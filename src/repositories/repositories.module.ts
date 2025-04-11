import { Global, Module } from '@nestjs/common'
import { RepositoriesService } from './repositories.service'
import { UserRepository } from './user.repository'
import { CaregiverRepository } from './caregiver.repository'
import { AddressRepository } from './address.repository'
import { PatientRepository } from './patient.repository'
import { UserTokenRepository } from './userToken.repository'
import { ActivityRepository } from './activity.repository'
import { RecurrenceRepository } from './recurrence.repository'
import { ActivityOccurenceRepository } from './activityOccurence.repository'
import { ActivityCategoryRepository } from './activityCategory.repository'
import { PatientCaregiverRepository } from './patientCaregiver.repository'
import { UserLocationRepository } from './userLocation.repository'
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
        ActivityRepository,
        RecurrenceRepository,
        ActivityOccurenceRepository,
        ActivityCategoryRepository,
        PatientCaregiverRepository,
        UserLocationRepository,
    ],
    exports: [RepositoriesService, AddressRepository],
})
export class RepositoriesModule {}
