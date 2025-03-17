import { Injectable } from '@nestjs/common'
import { IdentifierType } from '../interfaces/utils.interface'
import { StringUtil } from './string.util'
import { BadRequestException } from '../exceptions/badRequest.exception'
import { User } from '@prisma/client'
import { RepositoriesService } from 'src/repositories/repositories.service'

@Injectable()
export class AuthUtil {
    constructor(
        private readonly stringUtil: StringUtil,
        private readonly repository: RepositoriesService
    ) {}

    getIdentifierType(identifier: string): IdentifierType {
        if (
            this.stringUtil.isNumeric(identifier) &&
            this.stringUtil.isValidIndonesianRegistrationNumber(identifier)
        )
            return IdentifierType.REGISTRATION_NUMBER
        else if (this.stringUtil.isNumeric(identifier))
            throw new BadRequestException('NIK seharusnya berjumlah 16 digit')

        if (this.stringUtil.isValidEmail(identifier))
            return IdentifierType.EMAIL
        else
            throw new BadRequestException(
                'Format email tidak tepat',
                'Contoh: name@email.com'
            )
    }

    async getUserByIdentifier(identifier: string, type: IdentifierType) {
        let user: User = null

        if (type === IdentifierType.EMAIL)
            user = await this.repository.user.findByEmail(identifier)
        else
            user =
                await this.repository.user.findByRegistrationNumber(identifier)

        return user
    }
}
