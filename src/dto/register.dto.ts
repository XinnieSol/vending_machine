import { Transform } from "class-transformer";
import { 
    IsEmail, 
    IsIn, 
    IsNotEmpty, 
    IsString,
    MinLength,
} from "class-validator";
import { Unique } from "src/decorators/unique.decorator";


export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => {
        return value.toLowerCase();
    })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @Transform(({value}) => {
        return value.toLowerCase();
    })
    @Unique()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(["buyer", "seller"])
    role: string;
}