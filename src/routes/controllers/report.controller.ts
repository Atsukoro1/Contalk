import { reportService } from "../services/report.service";
import { 
    reportValidator
} from "../validators/report.validator";

module.exports = [
    {
        url: '/report', 
        method: 'POST',
        schema: reportValidator,
        service: reportService
    }
];