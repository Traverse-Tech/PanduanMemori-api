import { Injectable } from '@nestjs/common'
import { differenceInYears } from 'date-fns'

@Injectable()
export class DateUtil {
    /**
     * Calculate age based on birthdate
     * @param {Date} birthdate
     * @return {number}
     */
    calculateAge(birthdate: Date): number {
        const currentDate = new Date()
        return differenceInYears(currentDate, birthdate)
    }
}
