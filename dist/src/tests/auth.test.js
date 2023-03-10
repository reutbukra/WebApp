"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const message_model_1 = __importDefault(require("../models/message_model"));
let userId = "";
const userEmail = "user1@gmail.com";
const userPassword = "12345";
const userName = "user";
const newUserName = "user1";
let accessToken = '';
let refreshToken = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
    yield message_model_1.default.remove();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
    yield message_model_1.default.remove();
    mongoose_1.default.connection.close();
}));
describe("Auth Tests", () => {
    test("Not authorized attempt test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post');
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Register test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/register').send({
            "_email": userEmail,
            "password": userPassword,
            "name": userName,
            "image": "",
        });
        expect(response.statusCode).toEqual(200);
        userId = response.body._id;
    }));
    test("Login test wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword + '4'
        });
        expect(response.statusCode).not.toEqual(200);
        const tokens = response.body.tokens;
        expect(tokens).toBeUndefined();
    }));
    test("Login test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.tokens.accessToken;
        expect(accessToken).not.toBeNull();
        refreshToken = response.body.tokens.refreshToken;
        expect(accessToken).not.toBeNull();
    }));
    test("login using valid access token ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get("/post")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
    }));
    test("Test using wrong access token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT 1' + accessToken);
        expect(response.statusCode).not.toEqual(200);
    }));
    jest.setTimeout(15000);
    test("Test expired token", () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(r => setTimeout(r, 6000));
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default).get('/auth/refresh').set('Authorization', 'JWT ' + refreshToken);
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.accessToken;
        expect(accessToken).not.toBeNull();
        refreshToken = response.body.refreshToken;
        expect(refreshToken).not.toBeNull();
        response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
    }));
    test("get user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/" + userId)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        console.log(response.body);
        expect(response.body._id).toEqual(userId);
        expect(response.body.name).toEqual(userName);
    }));
    test("update user by Id", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default)
            .put("/auth/" + userId)
            .set("Authorization", "JWT " + accessToken)
            .send({
            name: newUserName,
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual(newUserName);
        expect(response.body._id).toEqual(userId);
        response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/" + userId)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual(newUserName);
        expect(response.body._id).toEqual(userId);
        response = yield (0, supertest_1.default)(server_1.default)
            .put("/auth/12345")
            .set("Authorization", "JWT " + accessToken)
            .send({
            name: newUserName,
        });
        expect(response.statusCode).toEqual(400);
    }));
    test("Logout test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/auth/logout').set('Authorization', 'JWT ' + refreshToken);
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=auth.test.js.map