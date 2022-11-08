import { Router } from "express";
import { permissions } from "../common/constants/permissions";
import { checkPermissions } from "../middleware/authz.middleware";
import { createCourseHandler } from "./create-course.handler";
import { enrollStudentHandler } from "./enroll-student.handler";
import { getAllCoursesHandler } from "./get-all-courses.handler";
import { getCourseHandler } from "./get-course.handler";
import { getEnrolledUsers } from "./get-enrolled-list";
import { getMyCoursesHandler } from "./get-my-courses.handler";
import moduleRouter from "./modules/module.router";
import { updateCourseFilesHandler } from "./update-course-files";
import { updateCourseHandler } from "./update-course.handler";

const coursesRouter = Router();

coursesRouter
  .route("/")
  .post(checkPermissions([permissions.create_course]), createCourseHandler)
  .get(checkPermissions([permissions.read_my_courses]), getMyCoursesHandler);

coursesRouter.get(
  "/all",
  checkPermissions([permissions.read_course]),
  getAllCoursesHandler
);

coursesRouter
  .route("/:courseId")
  .get(checkPermissions([permissions.read_course]), getCourseHandler)
  .put(checkPermissions([permissions.update_course]), updateCourseHandler);

coursesRouter.get(
  "/:courseId/enrolled",
  checkPermissions(permissions.read_enrolled),
  getEnrolledUsers
);

coursesRouter.put(
  "/:courseId/enrolled",
  checkPermissions(permissions.update_enrolled),
  enrollStudentHandler
);

coursesRouter.put(
  "/update-files",
  checkPermissions([permissions.update_course]),
  updateCourseFilesHandler
);

// Modules
coursesRouter.use("/:courseId/modules", moduleRouter);

export default coursesRouter;
