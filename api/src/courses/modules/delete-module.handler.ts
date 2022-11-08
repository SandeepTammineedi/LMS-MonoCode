import { RequestHandler } from "express";
import { db } from "../../common/db";
import { idSchema } from "../../common/zod-schemas";

export const deleteModuleHandler: RequestHandler = async (req, res, next) => {
  try {
    const moduleId = await idSchema.parseAsync(req.params.moduleId);
    await db.module.delete({
      where: {
        id: moduleId,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
