import { Transform } from "class-transformer";
import { 
    IsEmail,
    IsNotEmpty, 
    IsString,
} from "class-validator";
import { Unique } from "src/decorators/unique.decorator";


export class LoginDto {

    @IsNotEmpty()
    @IsEmail()
    @Transform(({value}) => {
        return value.toLowerCase();
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}