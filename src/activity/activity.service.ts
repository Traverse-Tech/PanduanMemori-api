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
    subWeeks,
    formatISO,
    startOfWeek,
    endOfWeek,
} from 'date-fns'
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
import { ActivityResponseDTO } from './dto/activityResponse.dto'
import { UpdateActivityOccurenceRequestDTO } from './dto/updateActivityOccurenceRequest.dto'
import { ActivityOccurenceResponseDTO } from './dto/activityOccurenceResponse.dto'
import { GetActivitiesInRangeRequestDTO } from './dto/getActivitiesInRangeRequest.dto'
import { DeleteActivityRequestDTO } from './dto/deleteActivityRequest.dto'
import { CompleteActivityOccurrenceRequestDTO } from './dto/completeActivityOccurrenceRequest.dto'

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
    ): Promise<ActivityResponseDTO> {
        const { patientId, title, activityCategoryId, datetime, recurrences } =
            body

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

        const response: ActivityResponseDTO = {
            id: activity.id,
            title: activity.title,
            activityCategoryId: activity.activityCategoryId,
            patientId: activity.patientId,
            datetime: activity.time,
        }

        return response
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

    // Activities will be generated lazily based on recurrence rules.
    async getActivitiesInRange(
        query: GetActivitiesInRangeRequestDTO
    ): Promise<GetActivitiesInRangeResponseDTO> {
        const { patientId, startDate, endDate } = query

        let rangeStart = parseISO(startDate)
        let rangeEnd = parseISO(endDate)
        if (isAfter(rangeStart, rangeEnd)) {
            throw new BadRequestException(
                INVALID_DATE_RANGE_ERROR_MESSAGE,
                INVALID_DATE_RANGE_ERROR_DESCRIPTION
            )
        }

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
                    isOnTime: occ.isOnTime,
                    recurrenceId: occ.recurrenceId,
                })),
            })
        }

        const response: GetActivitiesInRangeResponseDTO = {
            activities: result,
        }
        return response
    }

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

    async updateActivity(
        caregiver: User,
        id: string,
        body: UpdateActivityRequestDTO
    ): Promise<ActivityResponseDTO> {
        const { patientId, title, activityCategoryId, datetime, recurrences } =
            body

        const existingActivity = await this.findAndValidateActivity(
            id,
            patientId
        )
        if (activityCategoryId) {
            await this.findAndValidateActivityCategory(activityCategoryId)
        }

        const activity = await this.repository.activity.update(
            { id },
            {
                title,
                activityCategory: activityCategoryId
                    ? {
                          connect: { id: activityCategoryId },
                      }
                    : undefined,
                time: datetime ? parseISO(datetime) : new Date(),
            }
        )

        if (recurrences) {
            await this.updateRecurrences(
                id,
                recurrences,
                datetime,
                existingActivity.time
            )
        }

        if (datetime) {
            const currentTime = new Date()
            const newTime = parseISO(datetime)

            // Get the time difference to apply to future occurrences
            const hoursDiff =
                newTime.getHours() - existingActivity.time.getHours()
            const minutesDiff =
                newTime.getMinutes() - existingActivity.time.getMinutes()

            await this.repository.activityOccurence.updateManyFutureOccurrencesDateTime(
                {
                    activityId: id,
                    hoursDiff,
                    minutesDiff,
                    fromDate: currentTime,
                }
            )
        } else {
            // If no recurrence, update single occurrence
            const occurrences =
                await this.repository.activityOccurence.getOccurrencesByActivityId(
                    id
                )
            if (occurrences.length > 0) {
                await this.repository.activityOccurence.update(
                    { id: occurrences[0].id },
                    {
                        datetime: parseISO(datetime),
                    }
                )
            }
        }

        const response: ActivityResponseDTO = {
            id: activity.id,
            title: activity.title,
            activityCategoryId: activity.activityCategoryId,
            patientId: activity.patientId,
            datetime: activity.time,
        }

        return response
    }

    async deleteFutureActivity(body: DeleteActivityRequestDTO) {
        const { activityId, patientId } = body
        await this.findAndValidateActivity(activityId, patientId)

        await this.softDeleteActivity(activityId)
        await this.repository.activityOccurence.deleteManyFutureOccurrences({
            activityId: activityId,
        })
    }

    async deleteAllActivity(body: DeleteActivityRequestDTO) {
        const { activityId, patientId } = body
        await this.findAndValidateActivity(activityId, patientId)

        await this.softDeleteActivity(activityId)
        await this.repository.activityOccurence.deleteMany({
            activityId: activityId,
        })
    }

    async completeActivityOccurence(
        body: CompleteActivityOccurrenceRequestDTO
    ): Promise<ActivityOccurenceResponseDTO> {
        const { activityOccurenceId, actualStartTime, endTime } = body
        const occurrence = await this.findAndValidateActivityOccurence(activityOccurenceId)

        const isOnTime = !isAfter(actualStartTime, occurrence.datetime)
        const updatedOccurence = await this.repository.activityOccurence.update(
            { id: activityOccurenceId },
            {
                actualStartTime,
                endTime,
                isCompleted: true,
                isOnTime,
            }
        )

        const response: ActivityOccurenceResponseDTO = {
            id: updatedOccurence.id,
            activityId: updatedOccurence.activityId,
            datetime: updatedOccurence.datetime,
            isCompleted: updatedOccurence.isCompleted,
            isOnTime: updatedOccurence.isOnTime,
        }

        return response
    }

    async updateActivityOccurence(
        id: string,
        body: UpdateActivityOccurenceRequestDTO
    ): Promise<ActivityOccurenceResponseDTO> {
        const { datetime, title, activityCategoryId } = body
        const occurrence = await this.findAndValidateActivityOccurence(id)
        const activity = await this.repository.activity.findById(
            occurrence.activityId
        )

        if (title !== undefined || activityCategoryId !== undefined) {
            const hasTitleChange =
                title !== undefined && title !== activity.title
            const hasCategoryChange =
                activityCategoryId !== undefined &&
                activityCategoryId !== activity.activityCategoryId

            // If there is a change in title or activityCategoryId, create a new activity
            if (hasTitleChange || hasCategoryChange) {
                if (activityCategoryId) {
                    await this.findAndValidateActivityCategory(
                        activityCategoryId
                    )
                }

                const newActivity = await this.repository.activity.create({
                    title: title || activity.title,
                    activityCategory: activityCategoryId
                        ? {
                              connect: { id: activityCategoryId },
                          }
                        : {
                              connect: { id: activity.activityCategoryId },
                          },
                    patient: {
                        connect: { id: activity.patientId },
                    },
                    time: datetime ? parseISO(datetime) : occurrence.datetime,
                })

                const updatedOccurence =
                    await this.repository.activityOccurence.updateOccurenceConnection(
                        { id },
                        {
                            activityId: activity ? newActivity.id : undefined,
                            datetime: datetime
                                ? parseISO(datetime)
                                : occurrence.datetime,
                            recurrenceId: null,
                            isCompleted: occurrence.isCompleted,
                            isOnTime: occurrence.isOnTime,
                        }
                    )

                const response: ActivityOccurenceResponseDTO = {
                    id: updatedOccurence.id,
                    activityId: updatedOccurence.activityId,
                    datetime: updatedOccurence.datetime,
                    isCompleted: updatedOccurence.isCompleted,
                    isOnTime: updatedOccurence.isOnTime,
                }

                return response
            }
        }

        // If only datetime, update occurrence
        const updatedOccurence = await this.repository.activityOccurence.update(
            { id },
            {
                datetime: datetime ? parseISO(datetime) : occurrence.datetime,
            }
        )

        const response: ActivityOccurenceResponseDTO = {
            id: updatedOccurence.id,
            activityId: updatedOccurence.activityId,
            datetime: updatedOccurence.datetime,
            isCompleted: updatedOccurence.isCompleted,
            isOnTime: updatedOccurence.isOnTime,
        }

        return response
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
        await this.repository.activity.update(
            { id: activityId },
            {
                isDeleted: true,
                deletedAt: new Date(),
            }
        )
        await this.repository.recurrence.deleteMany({ activityId })
    }

    private combineDateAndTime(date: Date, time: Date): Date {
        return setMinutes(setHours(date, time.getHours()), time.getMinutes())
    }

    async getWeeklySummary(patientId: string): Promise<{ summary: string }> {
        const startOfPrevWeek = startOfWeek(subWeeks(new Date(), 1), {
            weekStartsOn: 1,
        })
        const endOfPrevWeek = endOfWeek(subWeeks(new Date(), 1), {
            weekStartsOn: 1,
        })

        const { activities } = await this.getActivitiesInRange({
            patientId: patientId,
            startDate: formatISO(startOfPrevWeek),
            endDate: formatISO(endOfPrevWeek),
        })

        const logs = activities.flatMap((activity) =>
            activity.occurrences.map((occ) => ({
                datetime: occ.datetime.toISOString(),
                is_completed: occ.isCompleted,
                activity: {
                    title: activity.title,
                    activity_category: { name: activity.activityCategoryId },
                },
            }))
        )

        if (!logs.length) {
            return {
                summary:
                    'Tidak ada aktivitas pasien minggu lalu yang ditemukan.',
            }
        }
    }
}
