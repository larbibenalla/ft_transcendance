import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { authenticator } from 'otplib';

@Injectable()
export class OtpService extends PrismaClient {

	constructor() {
		super();
	}

	async updateUserData(whichUser : any, toUpdate : any) {
		const user = await this.user.update({
			where : whichUser,
			data : toUpdate
		});

		if (!user)
			throw new NotFoundException();
		return user;
	}

	async findUser(data : any) {
		const user = await this.user.findUnique({ where : data });

		if (!user)
			throw new NotFoundException();
		return user;
	}

	generateOtpSecret() : string {
		return authenticator.generateSecret();
	}

	generateOtpUrl(secret : string, account_name : string) : string {
		return authenticator.keyuri(account_name, "ft_Transcendence", secret);
	}

	verifyTwoFaCode(code : string, secret : string) {
		return authenticator.verify( {token : code, secret : secret} );
	}
}
