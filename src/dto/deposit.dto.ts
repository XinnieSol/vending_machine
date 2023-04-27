import { IsArray, IsIn, IsInt, IsNotEmpty } from "class-validator";
import { MinSize } from "src/decorators/min-size.decorator";
import { Size } from "src/decorators/size.decorator";


export class DepositDTO {
    @IsNotEmpty()
    @IsInt()
    @IsIn([5, 10, 20, 50, 100])
    coins: number

}