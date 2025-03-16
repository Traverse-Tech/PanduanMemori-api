import { Global, Module } from '@nestjs/common'
import { ResponseUtil } from './utils/response.util'
import { StringUtil } from './utils/string.util'
import { AuthUtil } from './utils/auth.utils'

@Global()
@Module({
    providers: [ResponseUtil, StringUtil, AuthUtil],
    exports: [ResponseUtil, StringUtil, AuthUtil],
})
export class CommonsModule {}
