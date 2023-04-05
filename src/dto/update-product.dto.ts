import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateProductDTO {
    @IsOptional()
    @IsString()
    @Transform(({value}) => {
        return value.toLowerCase();
    })
    name: string;

    @IsOptional()
    @IsInt()
    price: number;
    
    @IsOptional()
    @IsString()
    description?: string

}