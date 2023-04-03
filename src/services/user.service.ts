import { RegisterDto } from "src/dto/register.dto";
import UserModel from "src/models/user.model";
import { hashPassword } from "src/utils/auth.util";

class UserService {
    async register(data: RegisterDto): Promise<any> {
        let { password } = data;
        password = await hashPassword(password);
        data.password = password;
        const newUser = await UserModel.create(data);

        return newUser.toJSON();

    }

    async fetchUserByEmail(email: string): Promise<any> {
        return await UserModel.findOne({email});
    }
}

export default new UserService();