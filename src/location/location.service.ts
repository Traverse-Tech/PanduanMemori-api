import { Injectable } from '@nestjs/common'
import { User, UserLocation } from '@prisma/client'
import { UpsertUserLocationDto } from './dto/upsertUserLocation.dto'
import { RepositoriesService } from '../repositories/repositories.service'
import { NotFoundException } from 'src/commons/exceptions/notFound.exception'
import { IsPatientInSafeLocationResponse } from './dto/isPatientInSafeLocationResponse.dto'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class LocationService {
    constructor(
        private readonly repository: RepositoriesService,
        private readonly notificationService: NotificationService
    ) {}

    async upsertLocation(
        user: User,
        body: UpsertUserLocationDto
    ): Promise<UserLocation> {
        const { latitude, longitude, accuracy, source } = body

        return this.repository.userLocation.upsert(
            { id: user.id },
            {
                update: {
                    latitude,
                    longitude,
                    accuracy,
                    source,
                    updatedAt: new Date(),
                },
                create: {
                    userId: user.id,
                    latitude,
                    longitude,
                    accuracy,
                    source,
                    createdAt: new Date(),
                },
            }
        )
    }

    async isPatientInSafeLocation(
        patientId: string
    ): Promise<IsPatientInSafeLocationResponse> {
        const SAFE_DISTANCE_METERS = 200

        const patient =
            await this.repository.patient.getPatientWithSafeLocation(patientId)
        const latestLocation =
            await this.repository.userLocation.findByUserId(patientId)

        if (!patient || !patient.safeLocation || !latestLocation) {
            throw new NotFoundException('Patient or location not found')
        }

        const distance = this.calculateDistance(
            Number(patient.safeLocation.latitude),
            Number(patient.safeLocation.longitude),
            Number(latestLocation.latitude),
            Number(latestLocation.longitude)
        )

        const isInSafeLocation = (await distance) <= SAFE_DISTANCE_METERS

        // if not in safe location, send email to the caregivers
        if (!isInSafeLocation) {
            const caregiverEmail = patient.caregivers.map(
                (pc) => pc.caregiver.user.email
            )
            await this.notificationService.sendSafeLocationAlertEmail(
                patient,
                caregiverEmail,
                {
                    distance: await distance,
                    latitude: latestLocation.latitude,
                    longitude: latestLocation.longitude,
                }
            )
        }

        return {
            longitude: Number(latestLocation.longitude),
            latitude: Number(latestLocation.latitude),
            distanceFromSafeLocation: await distance,
            caregiverPhoneNumber:
                patient.caregivers[0]?.caregiver.user.phoneNumber,
            isInSafeLocation,
        }
    }

    async calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): Promise<number> {
        const R = 6371e3
        const toRad = (value: number) => (value * Math.PI) / 180
        const dLat = toRad(lat2 - lat1)
        const dLon = toRad(lon2 - lon1)
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }
}
