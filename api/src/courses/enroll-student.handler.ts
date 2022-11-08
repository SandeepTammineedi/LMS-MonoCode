import { RequestHandler } from "express";
import { authzManagementClient } from "../common/authz-client";
import { db } from "../common/db";
import { emailSchema, idSchema } from "../common/zod-schemas";

export const enrollStudentHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = idSchema.parse(req.params.courseId);
    const email = emailSchema.parse(req.body.email);

    // Find user by email in auth0
    const user = await authzManagementClient.getUsersByEmail(email);

    if (!user.length) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // If multiple users found, return error
    if (user.length > 1) {
      return res.status(400).json({
        message: "Multiple users found with this email",
      });
    }

    // If user is already enrolled, return error
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        enrolledBy: true,
      },
    });

    if (course?.enrolledBy.includes(user[0].user_id as string)) {
      return res.status(400).json({
        message: "User already enrolled in this course",
      });
    }

    // Add user to course
    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        enrolledBy: {
          push: user[0].user_id,
        },
      },
    });

    return res.json({
      message: "User enrolled successfully",
    });
  } catch (error) {
    next(error);
  }
};
