import { RequestHandler } from "express";
import { authzManagementClient } from "../common/authz-client";
import { db } from "../common/db";
import { idSchema } from "../common/zod-schemas";

export const getEnrolledUsers: RequestHandler = async (req, res, next) => {
  try {
    const courseId = idSchema.parse(req.params.courseId);
    const data = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        enrolledBy: true,
      },
    });

    if (!data?.enrolledBy.length) {
      return res.status(200).json([]);
    }

    // Get user name, email from auth0 for each user in enrolledBy
    const searchQuery = data.enrolledBy
      .map((u) => `user_id:"${u}"`)
      .join(" OR ");

    const enrolledUsers = await authzManagementClient.getUsers({
      q: searchQuery,
      fields: "user_id,name,email",
    });

    return res.json(
      enrolledUsers.map((u) => ({
        id: u.user_id,
        name: u.name,
        email: u.email,
      }))
    );
  } catch (error) {
    next(error);
  }
};
