import { SetMetadata } from '@nestjs/common'
import { IS_PATIENT_ACCESSIBLE } from './decorator.constant'

export const IsPatient = () => SetMetadata(IS_PATIENT_ACCESSIBLE, true)
