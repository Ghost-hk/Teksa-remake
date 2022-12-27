// import { PrismaClient } from "@prisma/client";
// import { user, category } from "./data";

// @ts-ignore
const { PrismaClient } = require("@prisma/client");
const data = require("./data.ts");
const pr = new PrismaClient();

const main = async () => {
  try {
    await pr.category.deleteMany();
    console.log("Deleted records in category table");
    await pr.brand.deleteMany();
    console.log("Deleted records in brand table");
    await pr.post.deleteMany();
    console.log("Deleted records in post table");
    await pr.images.deleteMany();
    console.log("Deleted records in images table");
    await pr.user.deleteMany();
    console.log("Deleted records in user table");
    await pr.$queryRaw`ALTER TABLE Post AUTO_INCREMENT = 1`;
    console.log("reset post auto increment to 1");
    await pr.$queryRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
    console.log("reset category auto increment to 1");
    await pr.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
    console.log("reset user auto increment to 1");
    await pr.$queryRaw`ALTER TABLE Images AUTO_INCREMENT = 1`;
    console.log("reset images auto increment to 1");
    await pr.$queryRaw`ALTER TABLE Brand AUTO_INCREMENT = 1`;
    console.log("reset brand auto increment to 1");

    // add to db
    await pr.category.createMany({
      data: data.category,
    });

    await pr.brand.createMany({
      data: data.brand,
    });

    await pr.user.createMany({
      data: data.user,
    });
    console.log("Added user data");

    await pr.images.createMany({
      data: data.images,
    });
    console.log("Added images data");

    // await pr.post.createMany({
    //   data: data.post,
    // });
    // @ts-ignore
    data.posts.forEach(async (post) => {
      await pr.post.create({
        data: post,
      });
    });
    console.log("Added post data");
  } catch (error) {
    console.log(error);
  } finally {
    await pr.$disconnect();
  }
};

main();
