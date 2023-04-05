import { LoginDto } from "src/dto/login.dto";
import { RegisterDto } from "src/dto/register.dto";
import { NotFoundError, UnAuthorizedError } from "src/helpers/app-error.helper";
import UserModel from "src/models/user.model";
import { generateToken, hashPassword, validatePassword } from "src/utils/auth.util";
import * as bcrypt from "bcrypt";
import { ObjectId } from "mongoose";
import { DepositDTO } from "src/dto/deposit.dto";

class UserService {

    async register(data: RegisterDto): Promise<any> {
        const newUser = await UserModel.create(data);

        return newUser.toJSON();

    }

    async fetchUserByEmail(email: string): Promise<any> {
        return await UserModel.findOne({email});
    }

    async fetchUserById(id: ObjectId): Promise<any> {
        return await UserModel.findById(id);
    }

    async loginUser(data: LoginDto): Promise<any> {
        const { email, password } = data;
        const user = await UserModel.findOne({ email });
        if (!user) 
            throw new UnAuthorizedError("Invalid credentials");
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid)
            throw new UnAuthorizedError("Invalid credentials");

        if (user.sessions.length)
            throw new UnAuthorizedError("You have an active session. Logout from all active sessions");

        const token = generateToken(user.id);
        await UserModel.findByIdAndUpdate({ _id: user._id }, { sessions: [token] });
        const userDetails = user.toJSON();
        delete userDetails.sessions;

        return { ...userDetails, token }
    }

    async logoutSession(userId: ObjectId): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) 
            throw new NotFoundError("User does not exist");
        await UserModel.findByIdAndUpdate(user._id, { sessions: [] });
        return;
    }

    async deposit(userId: ObjectId, data: DepositDTO): Promise<any> {
        const user = await UserModel.findById(userId);
        if (!user) 
            throw new NotFoundError("User does not exist");
        await UserModel.findOneAndUpdate({_id: userId}, {
            $push: {
                coins: { $each: data.coins }
            }
        });

        return await UserModel.findById(userId);
    }

    async resetBalance(userId: ObjectId): Promise<any> {
        const user = await UserModel.findById(userId);
        if (!user) 
            throw new NotFoundError("User does not exist");
        await UserModel.findOneAndUpdate(
            {_id: userId}, {$set: { coins: [] }
        });

        return await UserModel.findById(userId);
    }
}

export default new UserService();