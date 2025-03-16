import { Global, Module } from '@nestjs/common'
import { ResponseUtil } from './utils/response.util'
import { StringUtil } from './utils/string.util'

@Global()
@Module({
    providers: [ResponseUtil, StringUtil],
    exports: [ResponseUtil, StringUtil],
})
export class CommonsModule {}
