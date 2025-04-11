import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
    Address,
    DementiaStage,
    Gender,
    Patient,
    Prisma,
    User,
    UserRole,
} from '@prisma/client'
import { hash, compare } from 'bcrypt'
import { RepositoriesService } from 'src/repositories/repositories.service'
import { RegisterRequestDTO } from './dto/registerRequest.dto'
import { RegisterResponseDTO } from './dto/registerResponse.dto'
import { StringUtil } from 'src/commons/utils/string.util'
import { BadRequestException } from 'src/commons/exceptions/badRequest.exception'
import { ConflictException } from 'src/commons/exceptions/conflict.exception'
import {
    TIME_UNIT,
    USER_BLOCKED_ERROR_DESCRIPTION,
    USER_BLOCKED_ERROR_MESSAGE,
} from './auth.constant'
import {
    FormattedCaregiverData,
    FormattedPatientData,
    FormattedUserData,
} from './auth.interface'
import { LoginRequestDTO } from './dto/loginRequest.dto'
import { LoginResponseDTO } from './dto/loginResponse.dto'
import { UnauthorizedException } from 'src/commons/exceptions/unauthorized.exception'
import { GetUserResponseDTO } from './dto/getUserResponse.dto'
import { AuthUtil } from 'src/commons/utils/auth.utils'
import { IdentifierType } from 'src/commons/interfaces/utils.interface'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly repository: RepositoriesService,
        private readonly stringUtil: StringUtil,
        private readonly authUtil: AuthUtil
    ) {}

    async register({
        name,
        identifier,
        phoneNumber,
        password,
        address,
        latitude,
        longitude,
        role,
        birthdate,
        gender,
    }: RegisterRequestDTO): Promise<RegisterResponseDTO> {
        const formattedPhoneNumber = await this.validatePhoneNumber(phoneNumber)
        const identifierType = this.authUtil.getIdentifierType(identifier)
        this.validatePassword(password)
        const userRole = this.validateRole(role)

        const isUserExists = await this.authUtil.getUserByIdentifier(
            identifier,
            identifierType
        )
        if (isUserExists) this.throwUserAlreadyExistsException(identifierType)

        const user = await this.createUser({
            name,
            password,
            address,
            latitude,
            longitude,
            role: userRole,
            birthdate,
            gender,
            phoneNumber: formattedPhoneNumber,
            email: identifierType === IdentifierType.EMAIL ? identifier : null,
            registrationNumber:
                identifierType === IdentifierType.REGISTRATION_NUMBER
                    ? identifier
                    : null,
        })

        const accessToken = await this.generateAccessToken(user.id)
        const formattedUser = this.formatUserData(user)

        return {
            token: accessToken,
            user: formattedUser,
        } as RegisterResponseDTO
    }

    async login({
        identifier,
        password,
        role,
    }: LoginRequestDTO): Promise<LoginResponseDTO> {
        const identifierType = this.authUtil.getIdentifierType(identifier)

        const user = await this.authUtil.getUserByIdentifier(
            identifier,
            identifierType
        )
        if (!user) this.throwInvalidUserAuthenticationException(identifierType)

        const isValidPassword = await compare(password, user.password)
        if (!isValidPassword)
            this.throwInvalidUserAuthenticationException(identifierType)

        if (role !== user.role.toString()) {
            throw new BadRequestException(
                'Pengguna tidak terdaftar sebagai ' +
                    (role === UserRole.CAREGIVER.toString()
                        ? 'Caregiver'
                        : role === UserRole.PATIENT.toString()
                          ? 'Pasien Demensia'
                          : this.stringUtil.capitalizeFirstLetter(role))
            )
        }

        const blacklistedToken =
            await this.repository.userToken.findUserBlacklistedToken(user.id)
        if (blacklistedToken) {
            await this.repository.userToken.updateUserActiveTokensToBlacklisted(
                user.id
            )
            throw new UnauthorizedException(
                USER_BLOCKED_ERROR_MESSAGE,
                USER_BLOCKED_ERROR_DESCRIPTION
            )
        }

        if (user.role === UserRole.PATIENT)
            this.repository.userToken.updateUserActiveTokensToInactive(user.id)
        
        const accessToken = await this.generateAccessToken(user.id)

        let formattedUser: FormattedPatientData | FormattedCaregiverData = null
        let isAssignedToPatient = false
        if (user.role === UserRole.PATIENT) {
            const { safeLocation, ...patientData } =
                await this.repository.patient.getPatientWithSafeLocation(
                    user.id
                )
            formattedUser = this.formatUserData({
                ...user,
                ...patientData,
                ...safeLocation,
            })
        } else {
            const { address, ...caregiverData } =
                await this.repository.caregiver.getCaregiverWithAddress(user.id)
            formattedUser = this.formatUserData({
                ...user,
                ...caregiverData,
                ...address,
            })
            isAssignedToPatient = !!caregiverData.patientId
        }

        return {
            token: accessToken,
            user: formattedUser,
            ...(user.role === UserRole.CAREGIVER
                ? { isAssignedToPatient }
                : {}),
        } as LoginResponseDTO
    }

    async getUser(user: User): Promise<GetUserResponseDTO> {
        let formattedUser: FormattedPatientData | FormattedCaregiverData = null
        let isAssignedToPatient = false
        if (user.role === UserRole.PATIENT) {
            const { safeLocation, ...patientData } =
                await this.repository.patient.getPatientWithSafeLocation(
                    user.id
                )
            formattedUser = this.formatUserData({
                ...user,
                ...patientData,
                ...safeLocation,
            })
        } else {
            const { address, ...caregiverData } =
                await this.repository.caregiver.getCaregiverWithAddress(user.id)
            formattedUser = this.formatUserData({
                ...user,
                ...caregiverData,
                ...address,
            })
            isAssignedToPatient = !!caregiverData.patientId
        }

        return {
            user: formattedUser,
            ...(user.role === UserRole.CAREGIVER
                ? { isAssignedToPatient }
                : {}),
        } as GetUserResponseDTO
    }

    async logout(user: User, token: string) {
        if (user.role === UserRole.CAREGIVER) {
            await this.repository.userToken.updateUserActiveTokenToInactive(
                token
            )
        } else {
            await this.repository.userToken.updateUserActiveTokensToInactive(
                user.id
            )
        }
    }

    private async createUser({
        name,
        phoneNumber,
        password,
        address,
        latitude,
        longitude,
        role,
        birthdate,
        gender,
        email,
        registrationNumber,
    }: Omit<RegisterRequestDTO, 'identifier' | 'role'> & {
        email: string
        registrationNumber: string
        role: UserRole
    }) {
        return this.repository.prisma.$transaction(async (tx) => {
            const hashedPassword = await hash(
                password,
                parseInt(process.env.APP_SALT_ROUNDS)
            )

            const addressObj = await this.repository.address.create(
                {
                    address,
                    latitude,
                    longitude,
                },
                tx
            )

            const user = await this.repository.user.create(
                {
                    name,
                    phoneNumber,
                    email,
                    registrationNumber,
                    role: role,
                    password: hashedPassword,
                },
                tx
            )

            if (role === UserRole.PATIENT) {
                const patient = await this.createPatient({
                    birthdate,
                    gender,
                    userId: user.id,
                    safeLocationId: addressObj.id,
                    tx,
                })

                return {
                    ...user,
                    ...patient,
                    ...addressObj,
                    id: user.id,
                    addressId: addressObj.id,
                }
            } else {
                const caregiver = await this.repository.caregiver.create(
                    {
                        userId: user.id,
                        addressId: addressObj.id,
                    },
                    tx
                )

                return {
                    ...user,
                    ...caregiver,
                    ...addressObj,
                    id: user.id,
                    addressId: addressObj.id,
                }
            }
        })
    }

    private async createPatient({
        birthdate,
        gender,
        userId,
        safeLocationId,
        tx,
    }: Pick<RegisterRequestDTO, 'birthdate' | 'gender'> & {
        userId: string
        safeLocationId: string
        tx: Prisma.TransactionClient
    }): Promise<Patient> {
        const patientBirthdate = this.validateBirthdate(birthdate)
        const patientGender = this.validateGender(gender)
        const patient = await this.repository.patient.create(
            {
                userId,
                safeLocationId,
                birthdate: patientBirthdate,
                gender: patientGender,
            },
            tx
        )

        return patient
    }

    private formatUserData({
        name,
        phoneNumber,
        email,
        registrationNumber,
        role,
        address,
        birthdate,
        gender,
        dementiaStage,
        patientId,
    }: Pick<
        User,
        'name' | 'phoneNumber' | 'email' | 'registrationNumber' | 'role'
    > &
        Pick<Address, 'address'> & {
            birthdate?: Date
            gender?: Gender
            dementiaStage?: DementiaStage
            patientId?: string
        }): FormattedPatientData | FormattedCaregiverData {
        const formattedUserData = {
            name,
            phoneNumber,
            email,
            registrationNumber,
            role,
            address,
        } as FormattedUserData

        if (role === UserRole.PATIENT)
            return {
                ...formattedUserData,
                birthdate,
                gender,
                dementiaStage,
            } as FormattedPatientData
        else
            return {
                ...formattedUserData,
                patientId,
            } as FormattedCaregiverData
    }

    private async validatePhoneNumber(phoneNumber: string): Promise<string> {
        if (!this.stringUtil.isValidIndonesianPhone(phoneNumber))
            throw new BadRequestException('Format nomor telepon tidak valid')

        const formattedPhoneNumber =
            this.stringUtil.formatIndonesianPhoneNumber(phoneNumber)
        const strippedPhoneNumber = formattedPhoneNumber.slice(3)

        if (strippedPhoneNumber.length < 9)
            throw new BadRequestException(
                'No HP tidak boleh kurang dari 10 Karakter'
            )

        if (strippedPhoneNumber.length > 15)
            throw new BadRequestException(
                'No HP tidak boleh lebih dari 16 Karakter'
            )

        const isUserExistsByPhoneNumber =
            await this.repository.user.findByPhoneNumber(phoneNumber)
        if (isUserExistsByPhoneNumber)
            throw new BadRequestException(
                'No HP sudah terdaftar',
                'Silakan gunakan nomor HP lain atau hubungi Customer Service jika mengalami masalah dengan nomor telepon Anda'
            )

        return formattedPhoneNumber
    }

    private validatePassword(password: string) {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()])[A-Za-z\d@$!%*?&#^()]{8,}$/
        if (!passwordRegex.test(password))
            throw new BadRequestException(
                'Password terlalu lemah',
                'Password harus terdiri dari minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter spesial'
            )
    }

    private validateRole(role: string): UserRole {
        if (!Object.values(UserRole).includes(role as UserRole))
            throw new BadRequestException(
                'Role tidak valid',
                `Harap gunakan ${Object.values(UserRole).join(' atau ')}`
            )

        return role as UserRole
    }

    private throwUserAlreadyExistsException(type: IdentifierType) {
        const errorMessage = `${type === IdentifierType.EMAIL ? 'Email' : 'NIK'} sudah terdaftar`
        const errorDescription = `Silahkan masuk dengan ${type === IdentifierType.EMAIL ? 'email' : 'NIK'} yang sama`

        throw new ConflictException(errorMessage, errorDescription)
    }

    private throwInvalidUserAuthenticationException(type: IdentifierType) {
        throw new UnauthorizedException(
            `${type === IdentifierType.EMAIL ? 'Email' : 'NIK'} atau password salah`,
            'Silakan masukkan sesuai akun yang telah didaftarkan sebelumnya'
        )
    }

    private validateBirthdate(birthdate: string): Date {
        if (!birthdate)
            throw new BadRequestException('Tanggal lahir tidak boleh kosong')

        const formattedBirthdate = this.stringUtil.parseDate(
            birthdate,
            'yyyy-MM-dd HH:mm:ss.SSS X'
        )
        if (!formattedBirthdate)
            throw new BadRequestException('Tanggal lahir tidak valid')

        return formattedBirthdate
    }

    private validateGender(gender: string): Gender {
        if (!gender)
            throw new BadRequestException('Jenis kelamin tidak boleh kosong')

        if (!Object.values(Gender).includes(gender as Gender))
            throw new BadRequestException(
                'Jenis kelamin tidak valid',
                `Harap gunakan ${Object.values(Gender).join(' atau ')}`
            )

        return gender as Gender
    }

    private async generateAccessToken(userId: string) {
        const accessToken = await this.jwtService.signAsync(
            { userId: userId },
            {
                secret: process.env.APP_ACCESS_SECRET,
                expiresIn: process.env.APP_ACCESS_EXPIRY,
            }
        )

        await this.repository.userToken.create({
            userId,
            token: accessToken,
            deactivatedAfter: new Date(
                Date.now() + this.getExpiry(process.env.APP_ACCESS_EXPIRY)
            ),
        })

        return accessToken
    }

    private getExpiry(expiresIn: string): number {
        const duration = parseInt(expiresIn.substring(0, expiresIn.length - 1))
        const unit = expiresIn[expiresIn.length - 1]
        return duration * TIME_UNIT[unit]
    }
}
