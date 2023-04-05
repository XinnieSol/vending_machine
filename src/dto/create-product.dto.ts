import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsMultiple } from "src/decorators/is-multiple.decorator";


export class CreateProductDTO {
    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => {
        return value.toLowerCase();
    })
    name: string;

    @IsNotEmpty()
    @IsInt()
    @IsMultiple(5)
    price: number;
    
    @IsOptional()
    @IsString()
    description?: string

}