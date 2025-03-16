import { SetMetadata } from '@nestjs/common'
import { IS_CAREGIVER_ACCESSIBLE } from './decorator.constant'

export const IsCaregiver = () => SetMetadata(IS_CAREGIVER_ACCESSIBLE, true)
