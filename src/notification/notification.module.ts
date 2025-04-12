import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { RepositoriesModule } from 'src/repositories/repositories.module'

@Module({
    imports: [RepositoriesModule],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
