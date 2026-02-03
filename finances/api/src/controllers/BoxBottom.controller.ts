import BoxBottomService from '../services/BoxBottom.service';
import { Request, Response } from 'express';

const boxBottomService = new BoxBottomService();

class BoxBottomController {
  static async register(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, targetValue } = req.body;
    try {
      const boxBottom = await boxBottomService.register({
        name, description, targetValue, userId: id
      });
      res.status(201).json({ message: `BoxBottom ${boxBottom.name} created successfully.` });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getAllBoxBottomsByUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const boxBottoms = await boxBottomService.getAllBoxBottomsByUser(id);
      res.status(200).json(boxBottoms);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  // static async getCategoryById(req: Request, res: Response) {
  //   const { id } = req.params;
  //   try {
  //     const category = await categoryService.getCategoryById(id);
  //     res.status(200).json(category);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       res.status(404).json({ message: error.message });
  //     }
  //   }
  // }

  // static async editCategory(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const dto = req.body;
  //   try {
  //     const updatedRecord = await categoryService.editCategory(id, dto);
  //     if (!updatedRecord) {
  //       return res.status(404).json({ message: 'Category not found' });
  //     }
  //     res.status(200).json({ message: 'Category updated successfully' });
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       res.status(400).json({ message: error.message });
  //     }
  //   }
  // }

  // static async deleteCategory(req: Request, res: Response) {
  //   const { id } = req.params;
  //   try {
  //     await categoryService.deleteCategory(id);
  //     res.status(200).json({ message: 'Category deleted successfully' });
  //   } catch (error) { 
  //     if (error instanceof Error) {
  //       res.status(400).json({ message: error.message });
  //     }
  //   }
  // }
}

export default BoxBottomController;