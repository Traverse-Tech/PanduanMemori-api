import { Injectable, BadRequestException } from '@nestjs/common'
import { NotFoundException } from 'src/commons/exceptions/notFound.exception'
import { User } from '@prisma/client'
import { Multer } from 'multer'
import { RepositoriesService } from 'src/repositories/repositories.service'
import { AuthUtil } from 'src/commons/utils/auth.utils'
import { AddCaregiverRequestDTO } from './dto/addCaregiverRequest.dto'
import * as FormData from 'form-data'
import axios from 'axios'

@Injectable()
export class PatientService {
    constructor(
        private readonly repository: RepositoriesService,
        private readonly authUtil: AuthUtil
    ) {}

    async buddyConversation(user: User, audio: Multer.File) {
        if (!audio) throw new BadRequestException('Tidak ada suara permintaan')

        const form = new FormData()
        form.append('audio', audio.buffer, {
            filename: audio.originalname,
            contentType: audio.mimetype,
            knownLength: audio.size,
        })
        form.append('user_id', user.id)

        try {
            const response = await axios.post(
                `${process.env.AI_SERVICE_URL}/va/`,
                form,
                {
                    headers: form.getHeaders(),
                }
            )

            return response.data
        } catch (error) {
            console.log(error)
            throw new BadRequestException(
                'Gagal memproses audio',
                error.message
            )
        }
    }

    async getCaregivers({ id: patientId }: User) {
        const caregivers =
            await this.repository.patientCaregiver.findByPatient(patientId)
        const caregiverIds = caregivers.map((rel) => rel.caregiverId)
        return this.repository.user.findByIds(caregiverIds)
    }

    async addCaregiver(user: User, body: AddCaregiverRequestDTO) {
        const { identifier } = body
        const identifierType = this.authUtil.getIdentifierType(identifier)
        const caregiver = await this.authUtil.getUserByIdentifier(
            identifier,
            identifierType
        )

        // Validate patient exists and is a caregiver
        const patient = await this.repository.patient.getPatient(user.id)
        if (!patient || user.role !== 'PATIENT') {
            throw new BadRequestException(
                'Patient not found',
                'The specified patient does not exist'
            )
        }

        // Check if relation already exists
        const existingRelation = await this.repository.patientCaregiver.findByPatientAndCaregiver(
            patient.id,
            caregiver.id
        )
        if (existingRelation && !existingRelation.isDeleted) {
            throw new BadRequestException(
                'Relation already exists',
                'This caregiver is already assigned to this patient'
            )
        }

        // Create or restore relation
        if (existingRelation) {
            await this.repository.patientCaregiver.restore(existingRelation.id)
        } else {
            await this.repository.patientCaregiver.create({
                patient: { connect: { id: patient.id } },
                caregiver: { connect: { id: caregiver.id } },
            })
        }
        
    }
}
