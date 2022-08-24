import { 
    loginService, 
    registerService 
} from "../services/auth.service";
import { 
    registerValidator,
    loginValidator 
} from "../validators/auth.validators";

module.exports = [
    {
        method: 'POST',
        url: '/auth/login',
        schema: loginValidator,
        service: loginService
    },
    {
        method: 'POST',
        url: '/auth/register',
        schema: registerValidator,
        service: registerService
    }
];