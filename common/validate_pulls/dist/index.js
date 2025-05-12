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
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const cheerio = require('cheerio');
const validatePull = (prUrl, by) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get(prUrl);
        const $ = cheerio.load(response.data);
        const title = $('.js-issue-title').text().trim().split('\n')[0];
        const author = $('.js-issue-assignees').text().trim().split('\n').filter((author) => author !== "")[0];
        const issueLabel = $('.js-issue-labels').find("span").text().trim().split("\n").filter((label) => label !== "");
        let status = $('.State').text().trim().split("\n")[0];
        const pull = {
            title: title,
            url: prUrl,
            openedBy: author,
            issueLabel: issueLabel,
            status: status
        };
        if (pull.openedBy !== by) {
            return {
                valid: false,
                msg: `This pull request is opened by ${pull.openedBy}, ${by} is not the assignee of this pull request`
            };
        }
        return {
            valid: true,
            msg: "Pull request is valid",
            pull: pull
        };
    }
    catch (error) {
        console.error(error);
    }
});
module.exports = {
    validatePull
};
