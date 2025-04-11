export interface IsPatientInSafeLocationResponse {
    longitude: number
    latitude: number
    distanceFromSafeLocation: number
    isInSafeLocation: boolean
    caregiverPhoneNumber: string
}
