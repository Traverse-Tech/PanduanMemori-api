import { Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { CaregiverRepository } from './caregiver.repository'
import { AddressRepository } from './address.repository'
import { PatientRepository } from './patient.repository'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserTokenRepository } from './userToken.repository'
import { ActivityRepository } from './activity.repository'
import { RecurrenceRepository } from './recurrence.repository'
import { ActivityOccurenceRepository } from './activityOccurence.repository'
import { ActivityCategoryRepository } from './activityCategory.repository'
import { PatientCaregiverRepository } from './patientCaregiver.repository'
import { UserLocationRepository } from './userLocation.repository'
import { EmergencyLogRepository } from './emergencyLog.repository'

@Injectable()
export class RepositoriesService {
    constructor(
        readonly prisma: PrismaService,
        readonly user: UserRepository,
        readonly patient: PatientRepository,
        readonly caregiver: CaregiverRepository,
        readonly address: AddressRepository,
        readonly userToken: UserTokenRepository,
        readonly activity: ActivityRepository,
        readonly recurrence: RecurrenceRepository,
        readonly activityOccurence: ActivityOccurenceRepository,
        readonly activityCategory: ActivityCategoryRepository,
        readonly patientCaregiver: PatientCaregiverRepository,
        readonly userLocation: UserLocationRepository,
        public readonly emergencyLog: EmergencyLogRepository
    ) {}
}
