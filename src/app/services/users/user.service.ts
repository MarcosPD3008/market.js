import userModel, { User } from "../../models/user.model";
import { BaseService } from "../base/base.service";
import { injectable } from "tsyringe";

@injectable()
export default class UsersService extends BaseService<User> {
    constructor() {
        super(userModel);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.model.findOne({ email });
    }

    async findByToken(token: string): Promise<User | null> {
        return await this.model.findOne({ token });
    }
    
    async login(email: string, password: string): Promise<User | null> {
        return await this.model.findOne({ email, password });
    }

    async updateToken(id: string, token: string): Promise<User | null> {
        return await this.model.findByIdAndUpdate(id, { token });
    }
}