import { Injectable, BadRequestException } from '@nestjs/common'
import { RepositoriesService } from 'src/repositories/repositories.service'
import {
    Activity,
    ActivityOccurence,
    Prisma,
    Recurrence,
    RecurrenceType,
    User,
} from '@prisma/client'
import { CreateActivityRequestDTO } from './dto/createActivityRequest.dto'
import { CaregiverService } from 'src/caregiver/caregiver.service'
import {
    addDays,
    parseISO,
    isBefore,
    isAfter,
    addMonths,
    addYears,
    getDay,
    addWeeks,
    setHours,
    setMinutes,
} from 'date-fns'
import { GetActivitiesInRangeRequestDTO } from './dto/getActivitiesInRangeRequest.dto'
import {
    GetActivitiesInRangeResponseDTO,
    ActivityWithOccurrencesDTO,
} from './dto/getActivitiesInRangeResponse.dto'
import {
    INVALID_DATE_RANGE_ERROR_MESSAGE,
    INVALID_DATE_RANGE_ERROR_DESCRIPTION,
    INVALID_RECURRENCE_TYPE_ERROR_MESSAGE,
    INVALID_RECURRENCE_TYPE_ERROR_DESCRIPTION,
    ACTIVITY_NOT_FOUND_ERROR_MESSAGE,
    ACTIVITY_NOT_FOUND_ERROR_DESCRIPTION,
    ACTIVITY_CATEGORY_NOT_FOUND_ERROR_MESSAGE,
    ACTIVITY_CATEGORY_NOT_FOUND_ERROR_DESCRIPTION,
} from './activity.constant'
import { UpdateActivityRequestDTO } from './dto/updateActivityRequest.dto'
import { CreateActivityResponseDTO } from './dto/createActivityResponse.dto'
import { UpdateActivityOccurenceRequestDTO } from './dto/updateActivityOccurenceRequest.dto'

@Injectable()
export class ActivityService {
    constructor(
        private readonly repository: RepositoriesService,
        private readonly caregiverService: CaregiverService
    ) {}

    private async findAndValidateActivityCategory(
        activityCategoryId: string
    ): Promise<void> {
        const activityCategory =
            await this.repository.activityCategory.findById(activityCategoryId)
        if (!activityCategory) {
            throw new BadRequestException(
                ACTIVITY_CATEGORY_NOT_FOUND_ERROR_MESSAGE,
                ACTIVITY_CATEGORY_NOT_FOUND_ERROR_DESCRIPTION
            )
        }
    }

    async create(
        caregiver: User,
        body: CreateActivityRequestDTO
    ): Promise<CreateActivityResponseDTO> {
        const { title, activityCategoryId, datetime, recurrences } = body

        const patientId =
            await this.caregiverService.getPatientIdByCaregiver(caregiver)
        const time = parseISO(datetime)

        await this.findAndValidateActivityCategory(activityCategoryId)

        // Create Activity
        const activity = await this.repository.activity.create({
            title,
            activityCategory: {
                connect: {
                    id: activityCategoryId,
                },
            },
            patient: {
                connect: {
                    id: patientId,
                },
            },
            time,
        })

        // Save recurrence rules
        if (recurrences) {
            await this.createRecurrences(activity.id, recurrences, datetime)
        } else {
            // If there is no recurrence, create one ActivityOccurrence
            await this.repository.activityOccurence.create({
                activity: {
                    connect: {
                        id: activity.id,
                    },
                },
                datetime: time,
                isCompleted: false,
            })
        }

        const activityOccurrences =
            await this.repository.activityOccurence.getOccurrencesByActivityId(
                activity.id
            )

        return {
            id: activity.id,
            title: activity.title,
            activityCategoryId: activity.activityCategoryId,
            patientId: activity.patientId,
            datetime: activity.time,
            activityOccurrences: activityOccurrences.map((occ) => ({
                id: occ.id,
                activityId: occ.activityId,
                datetime: occ.datetime,
                isCompleted: occ.isCompleted,
                recurrenceId: occ.recurrenceId,
            })),
        }
    }

    private async createRecurrences(
        activityId: string,
        recurrences: CreateActivityRequestDTO['recurrences'],
        datetime: string
    ) {
        for (const recurrence of recurrences) {
            const { endDate, interval, weekDays, type } = recurrence
            const startDate = parseISO(datetime)

            await this.repository.recurrence.create({
                activity: {
                    connect: {
                        id: activityId,
                    },
                },
                startDate,
                endDate: endDate ? parseISO(endDate) : null,
                interval,
                weekDays,
                type,
            })
        }
    }

    /**
     * Method to get activities in a specific range.
     * Activities will be generated lazily based on recurrence rules.
     */
    async getActivitiesInRange(
        caregiver: User,
        query: GetActivitiesInRangeRequestDTO
    ): Promise<GetActivitiesInRangeResponseDTO> {
        const { startDate, endDate } = query

        // Convert string dates to Date objects
        let rangeStart = parseISO(startDate)
        let rangeEnd = parseISO(endDate)

        // Validate date range
        if (isAfter(rangeStart, rangeEnd)) {
            throw new BadRequestException(
                INVALID_DATE_RANGE_ERROR_MESSAGE,
                INVALID_DATE_RANGE_ERROR_DESCRIPTION
            )
        }

        const patientId =
            await this.caregiverService.getPatientIdByCaregiver(caregiver)
        const activities =
            await this.repository.activity.getActivitiesByPatientId(patientId)
        const result: ActivityWithOccurrencesDTO[] = []

        // Generate ActivityOccurrence for each activity in the range
        for (const activity of activities) {
            rangeStart = this.combineDateAndTime(rangeStart, activity.time)
            rangeEnd = this.combineDateAndTime(rangeEnd, activity.time)
            const occurrences = await this.generateOccurrencesInRange(
                activity,
                rangeStart,
                rangeEnd
            )

            result.push({
                id: activity.id,
                title: activity.title,
                activityCategoryId: activity.activityCategoryId,
                patientId: activity.patientId,
                occurrences: occurrences.map((occ) => ({
                    id: occ.id,
                    activityId: occ.activityId,
                    datetime: occ.datetime,
                    isCompleted: occ.isCompleted,
                    recurrenceId: occ.recurrenceId,
                })),
            })
        }

        return { activities: result }
    }

    /**
     * Method to generate ActivityOccurrence in a specific range.
     */
    private async generateOccurrencesInRange(
        activity: Activity & { recurrences: Recurrence[] },
        rangeStart: Date,
        rangeEnd: Date
    ) {
        const { id: activityId, recurrences } = activity

        // If there is no recurrence, return activityOccurence
        if (!recurrences || recurrences.length === 0) {
            return this.repository.activityOccurence.getOccurrencesByActivityId(
                activityId
            )
        }

        const occurrences: Prisma.ActivityOccurenceCreateManyInput[] = []

        for (const recurrence of recurrences) {
            const { startDate, endDate, interval, weekDays, type } = recurrence

            // Determine the starting date for generation
            let currentDate = isBefore(rangeStart, startDate)
                ? new Date(startDate)
                : new Date(rangeStart)

            // Generate ActivityOccurrence in the requested range
            while (
                (!endDate || !isAfter(currentDate, endDate)) && // Check if the date is within the recurrence range
                !isAfter(currentDate, rangeEnd) // Check if the date is within the requested range
            ) {
                // Skip if it's a daily recurrence with weekDays and current day is not selected
                if (type === RecurrenceType.DAILY && weekDays.length > 0) {
                    const currentDay = getDay(currentDate)
                    if (!weekDays.includes(currentDay)) {
                        currentDate = addDays(currentDate, 1)
                        continue
                    }
                }

                occurrences.push({
                    activityId,
                    datetime: currentDate,
                    isCompleted: false,
                    recurrenceId: recurrence.id,
                })

                switch (type) {
                    case RecurrenceType.DAILY:
                        currentDate = addDays(currentDate, interval)
                        break
                    case RecurrenceType.WEEKLY:
                        currentDate = addWeeks(currentDate, interval)
                        break
                    case RecurrenceType.MONTHLY:
                        currentDate = addMonths(currentDate, interval)
                        break
                    case RecurrenceType.YEARLY:
                        currentDate = addYears(currentDate, interval)
                        break
                    default:
                        throw new BadRequestException(
                            INVALID_RECURRENCE_TYPE_ERROR_MESSAGE,
                            INVALID_RECURRENCE_TYPE_ERROR_DESCRIPTION
                        )
                }
            }
        }

        if (occurrences.length > 0) {
            await this.repository.activityOccurence.createMany(
                occurrences,
                true
            )
        }

        return this.repository.activityOccurence.getOccurrencesByActivityIdAndDateRange(
            activityId,
            rangeStart,
            rangeEnd
        )
    }

    async updateActivity(caregiver: User, body: UpdateActivityRequestDTO) {
        const { id, title, activityCategoryId, datetime, recurrences } = body
        const patientId =
            await this.caregiverService.getPatientIdByCaregiver(caregiver)

        const existingActivity = await this.findAndValidateActivity(
            id,
            patientId
        )

        // Check if activity category exists if provided
        if (activityCategoryId) {
            await this.findAndValidateActivityCategory(activityCategoryId)
        }

        const activity = await this.repository.activity.update({
            id,
            title,
            activityCategory: activityCategoryId
                ? {
                      connect: { id: activityCategoryId },
                  }
                : undefined,
            time: datetime ? parseISO(datetime) : new Date(),
        })

        // Handle datetime update
        if (datetime) {
            const existingRecurrences =
                await this.repository.recurrence.findByActivityId(id)
            if (existingRecurrences.length > 0) {
                // If has recurrence, delete all occurrences and recreate
                await this.repository.activityOccurence.deleteManyFutureOccurrences(
                    { activityId: id }
                )
                await this.updateRecurrences(
                    id,
                    recurrences || [],
                    datetime,
                    activity.time
                )
            } else {
                // If no recurrence, update single occurrence
                const occurrences =
                    await this.repository.activityOccurence.getOccurrencesByActivityId(
                        id
                    )
                if (occurrences.length > 0) {
                    await this.repository.activityOccurence.update({
                        id: occurrences[0].id,
                        datetime: parseISO(datetime),
                    })
                }
            }
        }

        if (recurrences) {
            await this.updateRecurrences(
                id,
                recurrences,
                datetime,
                existingActivity.time
            )
        }

        return activity
    }

    async deleteFutureActivity(caregiver: User, id: string) {
        const patientId =
            await this.caregiverService.getPatientIdByCaregiver(caregiver)
        await this.findAndValidateActivity(id, patientId)

        await this.softDeleteActivity(id)
        await this.repository.activityOccurence.deleteManyFutureOccurrences({
            activityId: id,
        })
    }

    async deleteAllActivity(caregiver: User, id: string) {
        const patientId =
            await this.caregiverService.getPatientIdByCaregiver(caregiver)
        await this.findAndValidateActivity(id, patientId)

        await this.softDeleteActivity(id)
        await this.repository.activityOccurence.deleteMany({ activityId: id })
    }

    async completeActivityOccurence(id: string) {
        await this.findAndValidateActivityOccurence(id)
        const updatedOccurence = await this.repository.activityOccurence.update(
            {
                id,
                isCompleted: true,
            }
        )

        return updatedOccurence
    }

    async updateActivityOccurence(body: UpdateActivityOccurenceRequestDTO) {
        const { id, datetime } = body
        await this.findAndValidateActivityOccurence(id)

        const updatedOccurence = await this.repository.activityOccurence.update(
            {
                id,
                datetime: datetime ? parseISO(datetime) : new Date(),
            }
        )

        return updatedOccurence
    }

    private async findAndValidateActivity(
        id: string,
        patientId: string
    ): Promise<Activity> {
        const activity = await this.repository.activity.findById(id)
        if (!activity || activity.patientId !== patientId) {
            const activityOccurence =
                await this.repository.activityOccurence.findById(id)
            if (!activityOccurence) {
                throw new BadRequestException(
                    ACTIVITY_NOT_FOUND_ERROR_MESSAGE,
                    ACTIVITY_NOT_FOUND_ERROR_DESCRIPTION
                )
            }
        }
        return activity
    }

    private async findAndValidateActivityOccurence(
        id: string
    ): Promise<ActivityOccurence> {
        const activityOccurence =
            await this.repository.activityOccurence.findById(id)
        if (!activityOccurence) {
            throw new BadRequestException(
                ACTIVITY_NOT_FOUND_ERROR_MESSAGE,
                ACTIVITY_NOT_FOUND_ERROR_DESCRIPTION
            )
        }
        return activityOccurence
    }

    private async updateRecurrences(
        activityId: string,
        recurrences: UpdateActivityRequestDTO['recurrences'],
        datetime?: string,
        existingTime?: Date
    ) {
        const existingRecurrences =
            await this.repository.recurrence.findByActivityId(activityId)
        const hasRecurrenceChanges = this.hasRecurrenceChanges(
            existingRecurrences,
            recurrences
        )

        if (!hasRecurrenceChanges) return

        await this.repository.recurrence.deleteMany({ activityId })
        await this.createRecurrences(
            activityId,
            recurrences,
            datetime || existingTime.toISOString()
        )
        await this.repository.activityOccurence.deleteManyFutureOccurrences({
            activityId,
        })
    }

    private hasRecurrenceChanges(
        existingRecurrences: Recurrence[],
        newRecurrences: UpdateActivityRequestDTO['recurrences']
    ): boolean {
        if (existingRecurrences.length !== newRecurrences.length) return true

        return newRecurrences.some((newRec) => {
            return !existingRecurrences.some(
                (existingRec) =>
                    existingRec.type === newRec.type &&
                    existingRec.interval === newRec.interval &&
                    (!newRec.endDate ||
                        existingRec.endDate?.toISOString() === newRec.endDate)
            )
        })
    }

    private async softDeleteActivity(activityId: string): Promise<void> {
        await this.repository.activity.update({
            id: activityId,
            isDeleted: true,
            deletedAt: new Date(),
        })
        await this.repository.recurrence.deleteMany({ activityId })
    }

    private combineDateAndTime(date: Date, time: Date): Date {
        return setMinutes(setHours(date, time.getHours()), time.getMinutes())
    }
}
