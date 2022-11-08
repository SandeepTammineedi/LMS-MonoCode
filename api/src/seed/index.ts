import path from "path";
import { saveImageToCourseThumbnailsContainer } from "../common/azure-blob-storage";
import { db } from "../common/db";
import { faker } from "@faker-js/faker";

async function main() {
  const pictrue = await saveImageToCourseThumbnailsContainer({
    mimetype: "image/jpg",
    path: path.join(__dirname, "salesforce.jpg"),
    name: "Salesforce Administration",
  });
  const course = await db.course.create({
    data: {
      title: faker.lorem.slug(),
      description: faker.lorem.lines(3),
      pictrue,
      liveLink: "https://zoom.us",
      projectFiles: new Array(5).fill(null).map(() => faker.internet.url()),
    },
  });

  await db.module.createMany({
    data: new Array(15).fill(null).map(() => ({
      title: faker.lorem.slug(),
      courseId: course.id,
    })),
  });

  const moduleData = await db.module.findMany();

  const topics = await db.topic.createMany({
    data: moduleData.map((module) => ({
      title: faker.lorem.slug(),
      modulesId: module.id,
      assignmentFiles: new Array(5).fill(null).map(() => faker.internet.url()),
      resourceFiles: new Array(5).fill(null).map(() => faker.internet.url()),
      videoLink: faker.internet.url(),
    })),
  });
}

main().catch(console.error);
