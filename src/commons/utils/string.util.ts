import { Injectable } from "@nestjs/common";
import { parse, parseISO, isValid } from "date-fns";

@Injectable()
export class StringUtil {
    //=========================================================
    //#region Commons
    //=========================================================

    /**
     * Checks if a given string consists only of numeric digits (0-9).
     */
    isNumeric(str: string): boolean {
        return /^[0-9]+$/.test(str)
    }


    //=========================================================
    //#region Phone Number
    //=========================================================

    /**
     * Check if the phone number follows the Indonesian phone number format, which starts with +62, 62, or 08.
     */
    isValidIndonesianPhone(phoneNumber: string): boolean {
        return /^(?:\+62|62|08)\d+$/.test(phoneNumber)
    }

    /**
     * Convert the phone number to match one of the Indonesian phone number formats, which starts with +62.
     */
    formatIndonesianPhoneNumber(phoneNumber: string): string {
        const COUNTRY_CODE_PREFIX = '62'
        const COMPLETE_COUNTRY_CODE_PREFIX = '+62'
        const LOCAL_PREFIX = '0'

        if (phoneNumber.startsWith(COMPLETE_COUNTRY_CODE_PREFIX))
            return phoneNumber
        else if (phoneNumber.startsWith(COUNTRY_CODE_PREFIX))
            return "+" + phoneNumber
        else if (phoneNumber.startsWith(LOCAL_PREFIX))
            return COMPLETE_COUNTRY_CODE_PREFIX + phoneNumber.substring(1)
        else
            return COMPLETE_COUNTRY_CODE_PREFIX + phoneNumber
    }


    //=========================================================
    //#region RegistrationNumber
    //=========================================================

    /**
     * Check if the registration number follows the Indonesian registration number format, which consists of 16 digits.
     */
    isValidIndonesianRegistrationNumber(registrationNumber: string): boolean {
        return /^\d{16}$/.test(registrationNumber)
    }

    
    //=========================================================
    //#region Email
    //=========================================================

    /**
     * Check if the email follows the common email format, which consists of a local part, an "@" symbol, and a domain part.
     */
    isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    //=========================================================
    //#region Date
    //=========================================================
    
    /**
     * Parses a date string into a valid JavaScript Date object
     */
    parseDate(date: string, format?: string): Date | null {
        const parsedDate = !!format? parse(date, format, new Date()) : new Date(date);
        return isValid(parsedDate)? parsedDate : null;
    }
}
