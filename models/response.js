class Response {
    constructor(status, message, data = null) {
        this.status = status
        this.message = message
        this.data = data
    }
    isSuccess = () => parseInt(this.code) == 0
}
module.exports = Response;
