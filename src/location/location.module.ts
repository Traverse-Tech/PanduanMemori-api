import { Module } from '@nestjs/common'
import { LocationController } from './location.controller'
import { LocationService } from './location.service'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { NotificationModule } from 'src/notification/notification.module'

@Module({
    imports: [RepositoriesModule, NotificationModule],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService],
})
export class LocationModule {}
