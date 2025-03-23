import { Module } from '@nestjs/common'
import { ActivityController } from './activity.controller'
import { ActivityService } from './activity.service'
import { CaregiverModule } from 'src/caregiver/caregiver.module'
import { ActivityGrpcClient } from './activity.grpc.client'

@Module({
    imports: [CaregiverModule],
    controllers: [ActivityController],
    providers: [ActivityService, ActivityGrpcClient],
})
export class ActivityModule {}
