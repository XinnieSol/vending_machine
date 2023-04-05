import { IsArray, IsIn, IsNotEmpty } from "class-validator";
import { MinSize } from "src/decorators/min-size.decorator";
import { Size } from "src/decorators/size.decorator";


export class DepositDTO {
    @IsNotEmpty()
    @IsArray()
    @Size(1)
    @IsIn([5, 10, 20, 50, 100], {
        each: true
    })
    coins: number[]

}