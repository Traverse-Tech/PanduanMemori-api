import { ActivityOccurrenceDTO } from './getActivitiesInRangeResponse.dto'

export class CreateActivityResponseDTO {
    id: string
    title: string
    activityCategoryId: string
    patientId: string
    datetime: Date
    activityOccurrences: ActivityOccurrenceDTO[]
}
