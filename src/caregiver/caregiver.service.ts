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
import { DateUtil } from 'src/commons/utils/date.util'
import { SearchPatientByCredentialRequestDTO } from './dto/searchPatientByCredentialRequest.dto'

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
}
