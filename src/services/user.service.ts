import { LoginDto } from "src/dto/login.dto";
import { RegisterDto } from "src/dto/register.dto";
import { UnAuthorizedError } from "src/helpers/app-error.helper";
import UserModel from "src/models/user.model";
import { generateToken, hashPassword, validatePassword } from "src/utils/auth.util";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongoose";

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

    async fetchUserById(id: ObjectId): Promise<any> {
        return await UserModel.findOne({id});
    }

    async loginUser(data: LoginDto): Promise<any> {
        const { email, password } = data;
        const user = await UserModel.findOne({ email });
        if (!user) 
            throw new UnAuthorizedError("Invalid credentials");
        const isValid = await bcrypt.compare(password, user.password);
        console.log(email, "Thank you God!!!!")
        if (!isValid)
            throw new UnAuthorizedError("Invalid credentials22");
        const token = generateToken(user.id);
        return { ...user.toJSON(), token }
    }
}

export default new UserService();