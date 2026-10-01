import { Request, Response } from 'express';
import PermissionService from '#services/Permission.service.js';
import { catchAsync } from '#utils/catchAsync.js';
import { BadRequestError, NotFoundError } from '#errors/httpErrors.js';

const permissionService = new PermissionService();

class RoleUserBoxBottomController {
  register = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    const { userId, roleId } = req.body;
    if (!userId || !boxBottomId || !roleId) {
      throw new BadRequestError(
        'Campos obrigatórios ausentes: userId, boxBottomId, roleId',
      );
    }
    const permission = await permissionService.create({
      userId,
      boxBottomId,
      roleId,
    });
    res
      .status(201)
      .json({ message: 'Permissão registrado com sucesso', data: permission });
  });

  getAllMembers = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    const members = await permissionService.getAllMembers(boxBottomId);
    res.status(200).json(members);
  });

  editRole = catchAsync(async (req: Request, res: Response) => {
    const { userId, boxBottomId } = req.params;
    const { roleId } = req.body;
    const updatedRecord = await permissionService.editRole(
      userId,
      boxBottomId,
      roleId,
    );
    if (!updatedRecord) {
      throw new NotFoundError(
        'Registro de acesso para este usuário não encontrado',
      );
    }
    res
      .status(200)
      .json({ message: 'Função de usuário atualizada com sucesso' });
  });

  deleteBoxBottom = catchAsync(async (req: Request, res: Response) => {
    const { permissionId } = req.params;
    await permissionService.delete(permissionId);
    res.status(200).json({ message: 'Membro excluído com sucesso' });
  });
}

export default new RoleUserBoxBottomController();
