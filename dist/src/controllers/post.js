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
const post_model_1 = __importDefault(require("../models/post_model"));
const response_1 = __importDefault(require("../response"));
const error_1 = __importDefault(require("../error"));
const getAllPosts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("new version of get all posts");
    try {
        let posts = {};
        console.log("getAllPosts");
        console.log("req");
        console.log(req);
        if (req.query != null && req.query.sender != null) {
            posts = yield post_model_1.default.find({ sender: req.query.sender });
        }
        else {
            posts = yield post_model_1.default.find();
        }
        return new response_1.default(posts, req.userId, null);
    }
    catch (err) {
        console.log("err");
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const getPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        const posts = yield post_model_1.default.findById(req.params.id);
        return new response_1.default(posts, req.userId, null);
    }
    catch (err) {
        console.log("fail to get post from db");
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const addNewPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("in add new post");
    console.log("message: " + req.body["message"]);
    console.log("sender: " + req.body["sender"]);
    console.log("image: " + req.body["image"]);
    const post = new post_model_1.default({
        message: req.body["message"],
        sender: req.body["sender"],
        imageUrl: req.body["image"]
    });
    if (post.imageUrl == "") {
        console.log("image string emptyyyyyyyy");
    }
    try {
        const newPost = yield post.save();
        console.log("save post in db");
        return new response_1.default(newPost, req.userId, null);
    }
    catch (err) {
        console.log("fail to save post in db");
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const updatePostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("updatePostById");
    try {
        console.log('tairrrrr', req);
        console.log('req.body', req.body);
        const post = yield post_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(post);
        return new response_1.default(post, req.userId, null);
    }
    catch (err) {
        console.log("fail to update post in db");
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const deletePostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('2222?');
    console.log(req.params.id);
    try {
        yield post_model_1.default.findByIdAndDelete(req.params.id);
        console.log("delete post from db");
        return new response_1.default(null, req.userId, null);
    }
    catch (err) {
        console.log("fail to delete post");
        console.log(err);
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
module.exports = { getAllPosts, addNewPost, getPostById, updatePostById, deletePostById };
//# sourceMappingURL=post.js.map