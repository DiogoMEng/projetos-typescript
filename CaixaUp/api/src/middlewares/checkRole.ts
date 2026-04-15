import { DB } from "../database/models";
import { Request, Response, NextFunction } from "express";

const checkRole = (listRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  const user = await DB.Users.findOne({
    where: { userId },
    include: {
      model: DB.RoleUserBoxBottoms,
      as: 'userPermissions',
      attributes: ['roleUserBoxBottomId'],
      include: [
        {
          model: DB.Roles,
          as: 'assignedRole',
          attributes: ['name'],
        }
      ]
    }
  });

  if (!user) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }

  const userRoles: string[] = (user.userPermissions || []).map(
    (permission: any) => permission.assignedRole.name
  );

  console.log('userRoles', userRoles);
}

export default checkRole;