import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class BuyProductProductDTO {

    @IsNotEmpty()
    @IsInt()
    amountOfProduct: number;

}