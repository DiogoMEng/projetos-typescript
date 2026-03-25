import { verify, JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from 'interfaces/user.interface';

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token de acesso não informado' });
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const [, accessToken] = parts;
  try {
    const decoded = verify(accessToken, JWT_SECRET!) as TokenPayload;
    req.userId = decoded.userId;
    req.email = decoded.email;

    return next();
  } catch(error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}