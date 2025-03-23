import { Global, Module } from '@nestjs/common'
import { ResponseUtil } from './utils/response.util'
import { StringUtil } from './utils/string.util'
import { AuthUtil } from './utils/auth.utils'
import { DateUtil } from './utils/date.util'

@Global()
@Module({
    providers: [ResponseUtil, StringUtil, AuthUtil, DateUtil],
    exports: [ResponseUtil, StringUtil, AuthUtil, DateUtil],
})
export class CommonsModule {}
