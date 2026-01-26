const Joi = require('joi');

const validateTodo = (req, res, next) => {
    const schema = Joi.object({
        task: Joi.string().min(3).max(100).required(), // 3 to 100 characters
        completed: Joi.boolean().default(false) // optional, defaults to false
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next(); // proceed to the next middleware or route handler
};

module.exports = validateTodo;