import { catchAsync } from 'utils/catchAsync';
import UserService from '../services/User.service';
import { Request, Response } from 'express';

const userService = new UserService();

class UserController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    await userService.create({
      name, email, password,
    });
    res.status(201).json({ name, email });
  });

  static getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  });

  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.getById(id);
    res.status(200).json(user);
  });

  static editUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = req.body;
    const updatedRecord = await userService.update(id, dto);
    if (!updatedRecord) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });

  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await userService.delete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  });
}

export default UserController;