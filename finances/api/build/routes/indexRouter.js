const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const body_parser_1 = __importDefault(require('body-parser'));
const userRouter_1 = __importDefault(require('./userRouter'));

exports.default = (app) => {
  app.use(body_parser_1.default.json(), userRouter_1.default);
};
