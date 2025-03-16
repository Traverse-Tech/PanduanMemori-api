import { RegisterResponseDTO } from './registerResponse.dto'

export class LoginResponseDTO extends RegisterResponseDTO {
    isAssignedToPatient?: boolean
}
