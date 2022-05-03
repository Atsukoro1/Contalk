// Modules
import { 
    FastifyReply,
    FastifyRequest,
    RouteOptions
} from "fastify";
import Joi from "joi";
import { isValidObjectId } from "mongoose";

// Modules, interfaces and services
import { 
    ReportBody, 
    ReportError,
    ReportResponse
} from "report.interface";
import { reportService } from "report.service";

export const settingsController : RouteOptions = {
    url: '/report', 
    method: 'POST',
    schema: {
        body: Joi.object({
            _id: Joi.string().custom((value, helpers) => {
                if(!isValidObjectId(value)) {
                    return helpers.message({ custom: "_id should be a valid ObjectId" });
                } else {
                    return true;
                }
            }, "Check if value is a valid Mongoose ObjectId").required(),
            reason: Joi.string().min(32).max(1024).required()
        })
    },

    validatorCompiler: ({ schema } : any) => {
        return data => schema.validate(data)
    },

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<ReportError | ReportResponse> {
        const response = await reportService(<any>req.body, (<any>req).user);

        return response;
    }
};