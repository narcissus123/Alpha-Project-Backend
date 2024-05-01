class ResponseMessage {
    constructor({
        eventId,
        messageId,
        type,
        message
    }) {
        this.eventId = eventId;
        this.messageId = messageId;
        this.type = type;
        this.message = message;
    }
}
module.exports = ResponseMessage;
