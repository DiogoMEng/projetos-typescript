import { DB } from '#models/index.js';
import { PermissionModel } from '#models/permission.js';
import { RoleModel } from '#models/Role.model.js';
import { Request, Response, NextFunction } from 'express';

type PermissionWithRole = PermissionModel & { assignedRole: RoleModel };

const checkRole = (listRoles: string[]) => verifyUserRole.bind(null, listRoles);

async function verifyUserRole(
  listRoles: string[],
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId } = req;
    const { boxBottomId } = req.params;
    const user = await DB.Users.findOne({
      where: { userId },
      include: {
        model: DB.Permissions,
        as: 'userPermissions',
        attributes: ['permissionId'],
        where: { boxBottomId },
        include: [
          {
            model: DB.Roles,
            as: 'assignedRole',
            attributes: ['name'],
          },
        ],
      },
    });

    const permissions = user?.userPermissions;
    if (!user || !permissions || permissions.length === 0) {
      res.status(403).json({
        message: 'Acesso negado: Você não faz parte desta caixinha',
      });
      return;
    }

    const userRoles = (permissions as PermissionWithRole[]).map(
      (permission) => permission.assignedRole.name,
    );
    const hasPermission = listRoles.some((role) => userRoles.includes(role));
    if (!hasPermission) {
      res
        .status(403)
        .json({ message: 'Acesso negado: Permissão insuficiente' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor', error });
  }
}

export default checkRole;
