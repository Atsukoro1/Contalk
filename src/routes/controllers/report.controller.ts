// Modules
import { 
    FastifyReply,
    FastifyRequest,
    RouteOptions
} from "fastify";

// Modules, interfaces and services
import { 
    ReportError,
    ReportResponse
} from "../interfaces/report.interface";
import { reportService } from "../services/report.service";
import { 
    reportValidator,
    schemaValidator
} from "../validators/report.validator";

export const settingsController : RouteOptions = {
    url: '/report', 
    method: 'POST',
    schema: reportValidator,
    validatorCompiler: schemaValidator,

    async handler(req : FastifyRequest, res : FastifyReply) : Promise<ReportError | ReportResponse> {
        const response = await reportService(<any>req.body, (<any>req).user);

        return response;
    }
};