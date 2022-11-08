import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../common/db";
import { idSchema } from "../common/zod-schemas";

export const getCourseHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = idSchema.parse(req.params.courseId);
    const data = await getCourseData(courseId);
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getCourseData = async (courseId: number) => {
  const data = await db.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      pictrue: true,
      liveLink: true,
      modulesOrder: true,
      modules: {
        select: {
          id: true,
          title: true,
          topics: {
            select: {
              id: true,
              title: true,
              videoLink: true,
              assignmentFiles: true,
              resourceFiles: true,
            },
          },
        },
      },
      projectFiles: true,
    },
  });

  return data;
};
