export class ActivityOccurrenceDTO {
    id: string
    recurrenceId?: string
    activityId: string
    datetime: Date
    isCompleted: boolean
}

export class ActivityWithOccurrencesDTO {
    id: string
    title: string
    activityCategoryId: string
    patientId: string
    occurrences: ActivityOccurrenceDTO[]
}

export class GetActivitiesInRangeResponseDTO {
    activities: ActivityWithOccurrencesDTO[]
}
