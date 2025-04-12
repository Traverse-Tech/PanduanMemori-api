import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { Patient, User, Caregiver, Address } from '@prisma/client'
import { DateUtil } from 'src/commons/utils/date.util'
import { RepositoriesService } from 'src/repositories/repositories.service'
import axios from 'axios'

@Injectable()
export class NotificationService {
    private readonly resend: Resend
    private readonly dateUtil: DateUtil

    constructor(private readonly repository: RepositoriesService) {
        this.resend = new Resend(process.env.RESEND_API_KEY)
        this.dateUtil = new DateUtil()
    }

    async sendSafeLocationAlertEmail(
        patient: Patient & { user: User; safeLocation: Address },
        caregiverEmails: string[],
        data: {
            distance: number
            latitude: number
            longitude: number
        }
    ): Promise<void> {
        const age = this.dateUtil.calculateAge(new Date(patient.birthdate))
        const address = await this.getAddressFromCoordinates(
            data.latitude,
            data.longitude
        )

        const emailPromises = this.resend.emails.send({
            from: 'PanduanMemori <onboarding@resend.dev>',
            to: caregiverEmails,
            subject: `🚨 ${patient.user.name} terlalu jauh dari lokasi aman!`,
            html: `
              <h2>Peringatan Lokasi Aman</h2>
              <p><strong>${patient.user.name}</strong> saat ini berada <strong>${data.distance.toFixed(2)} meter</strong> dari lokasi amannya.</p>
              <p>Data pasien:</p>
              <ul>
                <li>Nama: ${patient.user.name}</li>
                <li>Nomor Telepon: ${patient.user.phoneNumber}</li>
                <li>Email: ${patient.user.email ?? '-'}</li>
                <li>Nomor Registrasi: ${patient.user.registrationNumber}</li>
                <li>Usia: ${age}</li>
                <li>Jenis Kelamin: ${patient.gender}</li>
                <li>Level Demensia: ${patient.dementiaStage ?? '-'}</li>
                <li>Lokasi Aman: ${patient.safeLocation.address}</li>
              </ul>
        
              <p>Lokasi saat ini: ${address}, longitude: ${data.longitude}, latitude: ${data.latitude}</p>
              <br>
              <p>Mohon segera periksa kondisi ${patient.user.name}.</p>
            `,
        })

        await this.repository.emergencyLog.create({
            patient: {
                connect: {
                    id: patient.id,
                },
            },
            type: 'LOCATION_ALERT',
            description: `Pasien ${patient.user.name} keluar dari lokasi aman sejauh ${data.distance.toFixed(2)} meter, saat ini berada di ${address}, longitude: ${data.longitude}, latitude: ${data.latitude}. Lokasi aman pasien adalah ${patient.safeLocation.address}.`,
        })
    }

    private async getCaregiversOfPatient(
        patientId: string
    ): Promise<(Caregiver & { user: User; address: Address })[]> {
        const relations =
            await this.repository.patientCaregiver.findByPatient(patientId)
        const caregiverIds = relations.map((relation) => relation.caregiverId)
        const caregivers =
            await this.repository.caregiver.findByIds(caregiverIds)
        return caregivers
    }

    private async getAddressFromCoordinates(
        lat: number,
        lng: number
    ): Promise<string> {
        const apiKey = process.env.OPENCAGE_API_KEY
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`

        const res = await axios.get(url)
        const results = res.data.results

        if (results.length > 0) {
            return results[0].formatted
        }

        return 'Unknown location'
    }
}
