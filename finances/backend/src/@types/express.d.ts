import { AuthenticatedUser } from "../interfaces/user.protocol";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}