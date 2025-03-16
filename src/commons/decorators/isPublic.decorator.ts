import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC_ACCESSIBLE } from './decorator.constant'

export const IsPublic = () => SetMetadata(IS_PUBLIC_ACCESSIBLE, true)
