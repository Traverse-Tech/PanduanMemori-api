import { Module } from '@nestjs/common'
import { ActivityController } from './activity.controller'
import { ActivityService } from './activity.service'
import { CaregiverModule } from 'src/caregiver/caregiver.module'

@Module({
    imports: [CaregiverModule],
    controllers: [ActivityController],
    providers: [ActivityService],
})
export class ActivityModule {}
