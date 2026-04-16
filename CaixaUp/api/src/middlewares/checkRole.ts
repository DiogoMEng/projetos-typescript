import { DB } from "../database/models";
import { Request, Response, NextFunction } from "express";

const checkRole = (listRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req;
    const { boxBottomId } = req.params;
    const user = await DB.Users.findOne({
      where: { userId },
      include: {
        model: DB.RoleUserBoxBottoms,
        as: 'userPermissions',
        attributes: ['roleUserBoxBottomId'],
        where: { boxBottomId },
        include: [
          {
            model: DB.Roles,
            as: 'assignedRole',
            attributes: ['name'],
          }
        ]
      }
    });

    if (!user || !user.userPermissions || user.userPermissions.length === 0) {
      return res.status(403).json({ message: "Acesso negado: Você não faz parte desta caixinha" });
    }

    const userRoles: string[] = (user.userPermissions || []).map(
      (permission: any) => permission.assignedRole.name
    );
    const hasPermission = listRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({ message: "Acesso negado: Permissão insuficiente" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor", error });
  }
}

export default checkRole;