import { Injectable } from "@nestjs/common";
import {  Multer } from "multer";

@Injectable()
export class PatientService {
    constructor() {}

    async buddyConversation(audio: Multer.File) {
        
    }
}