import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Req,
} from '@nestjs/common'
import { ActivityService } from './activity.service'
import { ResponseUtil } from 'src/commons/utils/response.util'
import { GetCurrentUser } from 'src/commons/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'
import { CreateActivityRequestDTO } from './dto/createActivityRequest.dto'
import { IsCaregiver } from 'src/commons/decorators/isCaregiver.decorator'
import { GetActivitiesInRangeRequestDTO } from './dto/getActivitiesInRangeRequest.dto'
import { UpdateActivityRequestDTO } from './dto/updateActivityRequest.dto'
import { UpdateActivityOccurenceRequestDTO } from './dto/updateActivityOccurenceRequest.dto'

@Controller('activity')
export class ActivityController {
    constructor(
        private readonly ActivityService: ActivityService,
        private readonly responseUtil: ResponseUtil
    ) {}

    @IsCaregiver()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @GetCurrentUser() user: User,
        @Body() body: CreateActivityRequestDTO
    ) {
        const responseData = await this.ActivityService.create(user, body)

        return this.responseUtil.response({}, responseData)
    }

    @IsCaregiver()
    @Get()
    @HttpCode(HttpStatus.OK)
    async getActivitiesInRange(
        @GetCurrentUser() user: User,
        @Query() query: GetActivitiesInRangeRequestDTO
    ) {
        const responseData = await this.ActivityService.getActivitiesInRange(
            user,
            query
        )

        return this.responseUtil.response({}, responseData)
    }

    @IsCaregiver()
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async updateActivity(
        @GetCurrentUser() user: User,
        @Param('id') id: string,
        @Body() body: UpdateActivityRequestDTO
    ) {
        const responseData = await this.ActivityService.updateActivity(
            user,
            id,
            body
        )

        return this.responseUtil.response({}, responseData)
    }

    @IsCaregiver()
    @Delete('future/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteFutureActivity(
        @GetCurrentUser() user: User,
        @Param('id') id: string
    ) {
        await this.ActivityService.deleteFutureActivity(user, id)

        return this.responseUtil.response({
            responseMessage: 'Activity deleted successfully',
        })
    }

    @IsCaregiver()
    @Delete('all/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAllActivity(
        @GetCurrentUser() user: User,
        @Param('id') id: string
    ) {
        await this.ActivityService.deleteAllActivity(user, id)

        return this.responseUtil.response({
            responseMessage: 'Activity deleted successfully',
        })
    }

    @IsCaregiver()
    @Patch('complete/:id')
    @HttpCode(HttpStatus.OK)
    async completeActivityOccurrence(@Param('id') id: string) {
        const responseData =
            await this.ActivityService.completeActivityOccurence(id)

        return this.responseUtil.response({}, responseData)
    }

    @IsCaregiver()
    @Patch('occurence/:id')
    @HttpCode(HttpStatus.OK)
    async updateActivityOccurrence(
        @Param('id') id: string,
        @Body() body: UpdateActivityOccurenceRequestDTO
    ) {
        const responseData = await this.ActivityService.updateActivityOccurence(
            id,
            body
        )

        return this.responseUtil.response({}, responseData)
    }

    @IsCaregiver()
    @Get('weekly-summary')
    @HttpCode(HttpStatus.OK)
    async getWeeklySummary(@Req() req) {
        return this.ActivityService.getWeeklySummary(req.user)
    }
}
