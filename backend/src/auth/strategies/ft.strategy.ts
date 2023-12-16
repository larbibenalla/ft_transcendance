import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {

    constructor() {
        super({
            clientID: process.env.APP_UID,
            clientSecret: process.env.APP_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        });
    }

    async validate(access_token: string, refresh_token: string, profile: any): Promise<any> {
        return {
            username: profile.username,
            name: profile._json.usual_full_name,
            avatar: profile._json.image.link,
            email: profile._json.email,
            campus: profile._json.campus[0].name,
        };
    }

}