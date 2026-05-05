import { Request, Response } from 'express';
import RoleUserBoxBottomService from '../services/RoleUserBoxBottom.service';
import { catchAsync } from '../utils/catchAsync';

const roleUserBoxBottomService = new RoleUserBoxBottomService();

class RoleUserBoxBottomController {
  register = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    const { userId, roleId } = req.body;
    if (!userId || !boxBottomId || !roleId) {
      throw new Error('Campos obrigatórios ausentes: userId, boxBottomId, roleId');
    }
    const permission = await roleUserBoxBottomService.create({ userId, boxBottomId, roleId });
    res.status(201).json({ message: 'Permissão registrado com sucesso', data: permission });
  });

  getAllMembers = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    const members = await roleUserBoxBottomService.getAllMembers(boxBottomId);
    res.status(200).json(members);
  });

  editRole = catchAsync(async (req: Request, res: Response) => {
    const { userId, boxBottomId } = req.params;
    const { roleId } = req.body;
    const updatedRecord = await roleUserBoxBottomService.editRole(userId, boxBottomId, roleId);
    if (!updatedRecord) throw new Error('Não foi encontrado registro de acesso para este usuário no campo especificado.');
    res.status(200).json({ message: 'Função de usuário atualizada com sucesso' });
  });

  deleteBoxBottom = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await roleUserBoxBottomService.delete(userId);
    res.status(200).json({ message: 'Membro excluído com sucesso' });
  });
}

export default new RoleUserBoxBottomController();