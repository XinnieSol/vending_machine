import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";


export class QueryParamsDTO {
    @IsOptional()
    @IsNumber()
    pageNo?: number;

    @IsOptional()
    @IsNumber()
    noOfProducts?: number;

    @IsOptional()
    @IsString()
    search?: number;

    @IsOptional()
    @IsString()
    @IsIn(["productName", "price", "date"])
    sortBy?: string;

    @IsOptional()
    @IsString()
    @IsIn(["ascending", "descending"])
    sortDirection?: string;

}