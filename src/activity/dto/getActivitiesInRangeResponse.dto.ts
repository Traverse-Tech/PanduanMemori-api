export class ActivityOccurrenceDTO {
    id: string
    recurrenceId?: string
    activityId: string
    datetime: Date
    isCompleted: boolean
    isOnTime: boolean
}

export class ActivityWithOccurrencesDTO {
    id: string
    title: string
    activityCategoryIcon: string
    activityCategoryName: string
    patientId: string
    occurrences: ActivityOccurrenceDTO[]
}

export class GetActivitiesInRangeResponseDTO {
    activities: ActivityWithOccurrencesDTO[]
}
