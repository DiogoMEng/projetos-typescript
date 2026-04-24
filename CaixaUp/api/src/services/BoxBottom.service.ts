import { Op } from "sequelize";
import { DB } from "../database/models";
import { BoxBottom } from "../interfaces/boxBottom.interface";
import { Service } from "./Service";
import RoleUserBoxBottomService from "./RoleUserBoxBottom.service";

const roleUserBoxBottomService = new RoleUserBoxBottomService();

class BoxBottomService extends Service<any, BoxBottom> {
  constructor () {
    super(DB.BoxBottoms, "boxBottomId");
  }

  async getAllBoxBottomsByUser(userId: string): Promise<BoxBottom[]> {
    return await super.getAll({
      where: {
        [Op.or]: [
          { userId },
          { "$boxMembers.user_id$": userId },
        ],
      },
      include: [
        {
          model: DB.RoleUserBoxBottoms,
          as: "boxMembers",
          attributes: ["roleId"],
          required: false,
        },
        {
          model: DB.Users,
          as: "BoxCreator",
          attributes: ["userId", "name"],
        },
      ],
      distinct: true,
      subQuery: false,
    });
  }

  protected async beforeCreate(dto: BoxBottom): Promise<void> {
    const boxExists = await DB.BoxBottoms.findOne({
      where: {
        name: dto.name,
        userId: dto.userId,
      },
    });
    if (boxExists) throw new Error("Caixinha já existe para este usuário");
  }

  protected async afterCreate(record: BoxBottom): Promise<void> {
    const ownerRole = await DB.Roles.findOne({ where: { name: "OWNER" } });
    if (!ownerRole) throw new Error("Role OWNER não encontrada");

    await roleUserBoxBottomService.create({
      userId: record.userId,
      boxBottomId: record.boxBottomId,
      roleId: ownerRole.roleId,
    });
  }
}

export default BoxBottomService;
