import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'
import { LoginRequestDTO } from 'src/auth/dto/loginRequest.dto'
import { NotFoundException } from 'src/commons/exceptions/notFound.exception'
import { RepositoriesService } from 'src/repositories/repositories.service'
import { SearchPatientByCredentialDTO } from './dto/searchPatientByCredentialResponse.dto'
import { AuthUtil } from 'src/commons/utils/auth.utils'

@Injectable()
export class CaregiverService {
    constructor(
        private readonly repository: RepositoriesService,
        private readonly authUtil: AuthUtil
    ) {}

    async searchPatientByCredential({
        identifier,
        password,
    }: LoginRequestDTO): Promise<SearchPatientByCredentialDTO> {
        const PATIENT_NOT_FOUND_ERROR_MESSAGE = 'Pasien tidak ditemukan'
        const PATIENT_NOT_FOUND_ERROR_DESCRIPTION =
            'Pastikan data sudah benar dan pasien sudah terdaftar sebelumnya'

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
        } as SearchPatientByCredentialDTO
    }
}
