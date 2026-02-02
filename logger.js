const logRequest = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${req.method} ${req.url} from ${req.ip}`);
    next();// donot forget to call next() to pass control to the next middleware
}

module.exports = logRequest;

