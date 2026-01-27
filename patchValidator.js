const Joi = require('joi');

const patchvalidateTodo = (req, res, next) => {
    const schema = Joi.object({
        completed: Joi.boolean().default(false) // optional, defaults to false
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next(); // proceed to the next middleware or route handler
};

module.exports = patchvalidateTodo;