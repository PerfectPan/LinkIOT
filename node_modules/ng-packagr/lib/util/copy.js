"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cpx_1 = require("cpx");
const promisify_1 = require("./promisify");
const log_1 = require("./log");
const array_1 = require("./array");
function copyFiles(src, dest, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = array_1.toArray(src).map(src => {
            log_1.debug(`copyFiles from ${src} to ${dest}`);
            return promisify_1.promisify(resolveOrReject => {
                if (options) {
                    cpx_1.copy(src, dest, options, resolveOrReject);
                }
                else {
                    cpx_1.copy(src, dest, resolveOrReject);
                }
            });
        });
        return Promise.all(promises);
    });
}
exports.copyFiles = copyFiles;
//# sourceMappingURL=copy.js.map