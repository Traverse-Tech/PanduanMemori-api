import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'
import { LoginRequestDTO } from 'src/auth/dto/loginRequest.dto'
import { NotFoundException } from 'src/commons/exceptions/notFound.exception'
import { RepositoriesService } from 'src/repositories/repositories.service'
import { SearchPatientByCredentialResponseDTO } from './dto/searchPatientByCredentialResponse.dto'
import { AuthUtil } from 'src/commons/utils/auth.utils'
import { UpdateAssignedPatientRequestDTO } from './dto/updateAssignedPatientRequest.dto'
import {
    PATIENT_NOT_FOUND_ERROR_DESCRIPTION,
    PATIENT_NOT_FOUND_ERROR_MESSAGE,
} from 'src/patient/patient.constant'
import { User } from '@prisma/client'
import {
    CAREGIVER_NOT_FOUND_ERROR_DESCRIPTION,
    CAREGIVER_NOT_FOUND_ERROR_MESSAGE,
} from './caregiver.constant'

@Injectable()
export class CaregiverService {
    constructor(
        private readonly repository: RepositoriesService,
        private readonly authUtil: AuthUtil
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
    }: LoginRequestDTO): Promise<SearchPatientByCredentialResponseDTO> {
        const identifierType = this.authUtil.getIdentifierType(identifier)
        const patient = await this.authUtil.getUserByIdentifier(
            identifier,
            identifierType
        )

        if (!patient || patient.role !== 'PATIENT')
            throw new NotFoundException(
                PATIENT_NOT_FOUND_ERROR_MESSAGE,
                PATIENT_NOT_FOUND_ERROR_DESCRIPTION
            )

        const isValidPassword = await compare(password, patient.password)
        if (!isValidPassword)
            throw new NotFoundException(
                PATIENT_NOT_FOUND_ERROR_MESSAGE,
                PATIENT_NOT_FOUND_ERROR_DESCRIPTION
            )

        return {
            patientId: patient.id,
            name: patient.name,
        } as SearchPatientByCredentialResponseDTO
    }

    async getPatientIdByCaregiver({ id: caregiverId }: User): Promise<string> {
        const caregiverData =
            await this.repository.caregiver.getCaregiver(caregiverId)
        if (!caregiverData) {
            throw new NotFoundException(
                CAREGIVER_NOT_FOUND_ERROR_MESSAGE,
                CAREGIVER_NOT_FOUND_ERROR_DESCRIPTION
            )
        }
        if (!caregiverData.patient) {
            throw new NotFoundException(
                PATIENT_NOT_FOUND_ERROR_MESSAGE,
                PATIENT_NOT_FOUND_ERROR_DESCRIPTION
            )
        }
        return caregiverData.patient.id
    }
}
