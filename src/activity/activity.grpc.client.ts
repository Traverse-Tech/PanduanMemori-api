import { Injectable, OnModuleInit } from '@nestjs/common'
import { Client, ClientGrpc } from '@nestjs/microservices'
import { join } from 'path'

interface LogSummaryService {
    summarizeLogs(data: {
        logs: ActivityOccurrence[]
    }): Promise<{ summary: string }>
}

interface ActivityOccurrence {
    datetime: string
    is_completed: boolean
    activity: {
        title: string
        activity_category: { name: string }
    }
}

@Injectable()
export class ActivityGrpcClient implements OnModuleInit {
    private logSummaryService: LogSummaryService

    @Client({
        transport: 2,
        options: {
            package: 'activity',
            protoPath: join(__dirname, 'proto/log_summary.proto'),
            url: process.env.GRPC_AISERVICE_URL,
        },
    })
    private client: ClientGrpc

    onModuleInit() {
        this.logSummaryService =
            this.client.getService<LogSummaryService>('LogSummaryService')
    }

    async summarizeLogs(
        logs: ActivityOccurrence[]
    ): Promise<{ summary: string }> {
        return this.logSummaryService.summarizeLogs({ logs })
    }
}
