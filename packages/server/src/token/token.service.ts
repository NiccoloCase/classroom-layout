import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose"
import { Model } from 'mongoose';
import { ITokenModel } from "./token.schema";
import { TokenScope, Token } from '../graphql';


@Injectable()
export class TokenService {
    constructor(@InjectModel("Token") private readonly tokenModel: Model<ITokenModel>) { }

    /**
     * Genera un nuovo token e lo salva nel database
     * (Se ne esiste già uno valido restituisce quello)
     * @param email Email del client che ha richiesto il token
     * @param scope Ambito / funzione del token
     */
    async generateNewToken(email: string, scope: TokenScope) {
        try {
            // controlla se esiste già un token ancora valido 
            const token = await this.tokenModel.findOne({ email, scope });
            if (token) return token;
            // crea un nuovo token
            const newToken = new this.tokenModel({ email, scope });
            await newToken.save();
            return newToken;
        }
        catch (err) {
            throw new InternalServerErrorException();
        }
    }

    /**
     * Controlla l'esistenza nel database di un token con l'ID passato e 
     * che questo abbia un preciso ambito. Se il token esiste viene elimianto dal database.
     * @returns Restituisce il documento del token se le verifiche hanno avuto successo
     */
    async readAndCheckTokenById(id: string, scope: TokenScope): Promise<Token> {
        let token;
        try {
            token = await this.tokenModel.findOneAndDelete({ _id: id });
        }
        catch (err) {
            throw new InternalServerErrorException();
        }
        if (!token)
            throw new BadRequestException("The token passed does not exist: it may have expired or already been used");
        if (token.scope !== scope)
            throw new BadRequestException("The token passed is not of the requested type");

        return token;
    }
}
