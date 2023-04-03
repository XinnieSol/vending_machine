import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, RequestHandler } from "express";
import { BadRequestError } from "src/helpers/app-error.helper";


const validationPipe = async (
    schema: new () => {}, requestObj: object
) => {
    const transformedClass = plainToInstance(schema, requestObj);
    const errors = await validate(transformedClass);
    if (errors.length > 0 &&  errors[0].constraints) 
        return Object.values(errors[0].constraints);

    return true;
}

export const validator = (validationSchema: any, source: string): RequestHandler =>
    async (req, res, next: NextFunction) => {
        if (!req[source])
            throw new BadRequestError("Missing required fields");
        

        const result: any = await validationPipe(validationSchema, req[source]);
        if (result !== true) {
            res.status(400).send({
                success: false,
                message: result,
              });
            return
        }

        next();
    }
