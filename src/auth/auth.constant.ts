import { UserRole } from "@prisma/client"
import { IS_CAREGIVER_ACCESSIBLE, IS_PATIENT_ACCESSIBLE } from "src/commons/decorators/decorator.constant"

export const TIME_UNIT = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
}

export const ROLE_PERMISSION = [
    {
      metada: IS_CAREGIVER_ACCESSIBLE,
      role: UserRole.CAREGIVER
    },
    {
      metada: IS_PATIENT_ACCESSIBLE,
      role: UserRole.PATIENT
    }
]

export const USER_BLOCKED_ERROR_MESSAGE = "Akun diblokir"
export const USER_BLOCKED_ERROR_DESCRIPTION = "Silahkan hubungi Customer Service untuk informasi lebih lanjut"
