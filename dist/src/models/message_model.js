"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    senderID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    body: {
        type: String,
    },
    username: {
        type: String,
    },
    time: {
        type: String,
    },
});
exports.default = mongoose_1.default.model('Message', MessageSchema);
//# sourceMappingURL=message_model.js.map