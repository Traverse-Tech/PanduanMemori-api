import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { CommonsModule } from './commons/commons.module'
import { HttpExceptionFilter } from './commons/filters/http-exception.filter'
import { AuthModule } from './auth/auth.module'
import { RepositoriesModule } from './repositories/repositories.module'
import { AuthGuard } from './auth/auth.guard'
import { CaregiverModule } from './caregiver/caregiver.module'
import { PatientModule } from './patient/patient.module'
import { ActivityModule } from './activity/activity.module'
import * as dotenv from 'dotenv'

dotenv.config()
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({}),
        CommonsModule,
        PrismaModule,
        AuthModule,
        RepositoriesModule,
        CaregiverModule,
        PatientModule,
        ActivityModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
