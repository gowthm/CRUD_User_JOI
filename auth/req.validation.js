const Joi = require('joi');
function userValidation(req, router) {
    switch (router) {
        case 'login':
            const login_valid = Joi.object({
                email: Joi.string().email({}),
                password: Joi.string().required()
            })
            return login_valid.validate(req)
        case 'add':
            const save_valid = Joi.object({
                name: Joi.string().required(),
                phoneNo: Joi.number().required(),
                address: Joi.any().optional(),
                userRole: Joi.string().valid('admin', 'user').required(),
                email: Joi.string().email({}).required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,10}$')).required()
            })
            return save_valid.validate(req)
        case 'update':
            const update_valid = Joi.object({
                name: Joi.string().required(),
                phoneNo: Joi.number().optional(),
                address: Joi.any().optional(),
                userRole: Joi.any().optional().valid('admin', 'user'),
            })
            return update_valid.validate(req)
        case 'getall':
            const getall_valid = Joi.object({
                limit: Joi.number(),
                offset: Joi.number(),
            })
            return getall_valid.validate(req)
    }
}
module.exports = userValidation