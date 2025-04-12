import { Injectable, BadRequestException } from '@nestjs/common'
import { compare } from 'bcrypt'
import { NotFoundException } from 'src/commons/exceptions/notFound.exception'
import { RepositoriesService } from 'src/repositories/repositories.service'
import { SearchPatientByCredentialResponseDTO } from './dto/searchPatientByCredentialResponse.dto'
import { AuthUtil } from 'src/commons/utils/auth.utils'
import { UpdateAssignedPatientRequestDTO } from './dto/updateAssignedPatientRequest.dto'
import {
    PATIENT_NOT_FOUND_ERROR_DESCRIPTION,
    PATIENT_NOT_FOUND_ERROR_MESSAGE,
} from 'src/patient/patient.constant'
import { User, EmergencyLog } from '@prisma/client'
import { DateUtil } from 'src/commons/utils/date.util'
import { SearchPatientByCredentialRequestDTO } from './dto/searchPatientByCredentialRequest.dto'
import {
    CAREGIVER_NOT_FOUND_ERROR_DESCRIPTION,
    CAREGIVER_NOT_FOUND_ERROR_MESSAGE,
} from './caregiver.constant'
import { AddPatientToCaregiverRequestDTO } from './dto/addPatientToCaregiver.dto'
import { CaregiverPatientResponseDto } from './dto/caregiverPatientResponse.dto'

@Injectable()
export class CaregiverService {
    constructor(
        private readonly repository: RepositoriesService,
        private readonly authUtil: AuthUtil,
        private readonly dateUtil: DateUtil
    ) {}

    async getPeerCaregivers({ id: caregiverId }: User) {
        const peers =
            await this.repository.caregiver.getPeerCaregivers(caregiverId)
        return { peers }
    }

    async updateAssignedPatient(
        { id: caregiverId }: User,
        { patientId }: UpdateAssignedPatientRequestDTO
    ) {
        const patient = await this.repository.user.findById(patientId)
        if (!patient || patient.role !== 'PATIENT')
            throw new NotFoundException(
                PATIENT_NOT_FOUND_ERROR_MESSAGE,
                PATIENT_NOT_FOUND_ERROR_DESCRIPTION
            )

        await this.repository.caregiver.updatePatient(caregiverId, patientId)
    }

    async searchPatientByCredential({
        identifier,
        password,
    }: SearchPatientByCredentialRequestDTO): Promise<SearchPatientByCredentialResponseDTO> {
        const identifierType = this.authUtil.getIdentifierType(identifier)
        const user = await this.authUtil.getUserByIdentifier(
            identifier,
            identifierType
        )

        if (!user || user.role !== 'PATIENT')
            throw new NotFoundException(
                PATIENT_NOT_FOUND_ERROR_MESSAGE,
                PATIENT_NOT_FOUND_ERROR_DESCRIPTION
            )

        const isValidPassword = await compare(password, user.password)
        if (!isValidPassword)
            throw new NotFoundException(
                PATIENT_NOT_FOUND_ERROR_MESSAGE,
                PATIENT_NOT_FOUND_ERROR_DESCRIPTION
            )

        const patient = await this.repository.patient.getPatient(user.id)

        return {
            patientId: user.id,
            name: user.name,
            age: this.dateUtil.calculateAge(new Date(patient.birthdate)),
        } as SearchPatientByCredentialResponseDTO
    }

    async getPatientIdsByCaregiver({
        id: caregiverId,
    }: User): Promise<string[]> {
        const caregiverData =
            await this.repository.caregiver.getCaregiver(caregiverId)
        if (!caregiverData) {
            throw new NotFoundException(
                CAREGIVER_NOT_FOUND_ERROR_MESSAGE,
                CAREGIVER_NOT_FOUND_ERROR_DESCRIPTION
            )
        }
        if (!caregiverData.patients.length) {
            throw new NotFoundException(
                PATIENT_NOT_FOUND_ERROR_MESSAGE,
                PATIENT_NOT_FOUND_ERROR_DESCRIPTION
            )
        }
        return caregiverData.patients.map((pc) => pc.id)
    }

    async addPatientToCaregiver(
        { id: caregiverId }: User,
        body: AddPatientToCaregiverRequestDTO
    ): Promise<void> {
        const { identifier } = body
        const identifierType = this.authUtil.getIdentifierType(identifier)
        const patient = await this.authUtil.getUserByIdentifier(
            identifier,
            identifierType
        )

        // Validate caregiver exists and is a caregiver
        const caregiver = await this.repository.user.findById(caregiverId)
        if (!caregiver || caregiver.role !== 'CAREGIVER') {
            throw new BadRequestException(
                'Caregiver not found',
                'The specified caregiver does not exist'
            )
        }

        // Check if relation already exists
        const existingRelation =
            await this.repository.patientCaregiver.findByPatientAndCaregiver(
                patient.id,
                caregiverId
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
                caregiver: { connect: { id: caregiverId } },
            })
        }
    }

    async removePatientFromCaregiver(
        { id: caregiverId }: User,
        patientId: string
    ): Promise<void> {
        const relation =
            await this.repository.patientCaregiver.findByPatientAndCaregiver(
                patientId,
                caregiverId
            )
        if (!relation || relation.isDeleted) {
            throw new BadRequestException(
                'Relation not found',
                'This caregiver is not assigned to this patient'
            )
        }

        await this.repository.patientCaregiver.softDelete(relation.id)
    }

    async getCaregiverPatients(caregiverId: string): Promise<{
        data: CaregiverPatientResponseDto[]
    }> {
        const relations =
            await this.repository.patientCaregiver.findByCaregiver(caregiverId)
        const patients = await this.repository.user.findByIds(
            relations.map((rel) => rel.patientId)
        )
        const patientIds = patients.map((patient) => patient.id)

        const patientData = await this.repository.patient.findByIds(patientIds)

        const data = patients.map((user) => {
            const patient = patientData.find((p) => p.id === user.id)
            if (!patient) {
                throw new Error(
                    `Patient data not found for user id: ${user.id}`
                )
            }

            return {
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email ?? undefined,
                registrationNumber: user.registrationNumber,
                birthdate: patient.birthdate.toISOString(),
                age: this.dateUtil.calculateAge(new Date(patient.birthdate)),
                gender: patient.gender,
                dementiaStage: patient.dementiaStage,
            }
        })

        return {
            data: data,
        }
    }

    async getAllPatientEmergencyLocationLogs({
        id: caregiverId,
    }: User): Promise<{ data: EmergencyLog[] }> {
        const relations =
            await this.repository.patientCaregiver.findByCaregiver(caregiverId)

        if (!relations) {
            throw new NotFoundException(
                'No patients found',
                'No patients found for this caregiver'
            )
        }

        const emergencyLocation = await this.repository.emergencyLog.findMany({
            where: {
                patientId: {
                    in: relations.map((relation) => relation.patientId),
                },
            },
        })

        return { data: emergencyLocation }
    }
}
