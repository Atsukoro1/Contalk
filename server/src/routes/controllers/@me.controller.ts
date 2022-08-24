import { fetchHomepage } from "../services/@me.service"

module.exports = [
    {
        method: 'GET',
        url: '/@me',
        service: fetchHomepage
    }
];