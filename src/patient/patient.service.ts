import { BadRequestException, Injectable } from '@nestjs/common'
import { Multer } from 'multer'
import * as FormData from 'form-data'
import axios from 'axios'
import { User } from '@prisma/client'

@Injectable()
export class PatientService {
    constructor() {}

    async buddyConversation(user: User, audio: Multer.File) {
        if (!audio) throw new BadRequestException('Tidak ada suara permintaan')

        const form = new FormData()
        form.append('audio', audio.buffer, {
            filename: audio.originalname,
            contentType: audio.mimetype,
            knownLength: audio.size,
        })
        form.append('user_id', user.id)

        try {
            const response = await axios.post(
                `${process.env.AI_SERVICE_URL}/va/`,
                form,
                {
                    headers: form.getHeaders(),
                }
            )

            return response.data
        } catch (error) {
            console.log(error)
            throw new BadRequestException(
                'Gagal memproses audio',
                error.message
            )
        }
    }
}
