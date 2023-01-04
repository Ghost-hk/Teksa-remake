// // import { PrismaClient } from "@prisma/client";
// // import { user, category } from "./data";

// @ts-ignore
const { PrismaClient } = require("@prisma/client");
// const data = require("./data.ts");
// const pr = new PrismaClient();

// const main = async () => {
//   try {
//     await pr.category.deleteMany();
//     console.log("Deleted records in category table");
//     await pr.brand.deleteMany();
//     console.log("Deleted records in brand table");
//     await pr.post.deleteMany();
//     console.log("Deleted records in post table");
//     await pr.images.deleteMany();
//     console.log("Deleted records in images table");
//     await pr.user.deleteMany();
//     console.log("Deleted records in user table");
//     await pr.$queryRaw`ALTER TABLE Post AUTO_INCREMENT = 1`;
//     console.log("reset post auto increment to 1");
//     await pr.$queryRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
//     console.log("reset category auto increment to 1");
//     await pr.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
//     console.log("reset user auto increment to 1");
//     await pr.$queryRaw`ALTER TABLE Images AUTO_INCREMENT = 1`;
//     console.log("reset images auto increment to 1");
//     await pr.$queryRaw`ALTER TABLE Brand AUTO_INCREMENT = 1`;
//     console.log("reset brand auto increment to 1");

//     // add to db
//     await pr.category.createMany({
//       data: data.category,
//     });

//     await pr.brand.createMany({
//       data: data.brand,
//     });

//     await pr.user.createMany({
//       data: data.user,
//     });
//     console.log("Added user data");

//     await pr.images.createMany({
//       data: data.images,
//     });
//     console.log("Added images data");

//     // await pr.post.createMany({
//     //   data: data.post,
//     // });
//     // @ts-ignore
//     data.posts.forEach(async (post) => {
//       await pr.post.create({
//         data: post,
//       });
//     });
//     console.log("Added post data");
//   } catch (error) {
//     console.log(error);
//   } finally {
//     await pr.$disconnect();
//   }
// };

// main();

// import { PrismaClient } from "@prisma/client";

// Connect to the database
const pr = new PrismaClient();

async function seed() {
  // Define your seed data here
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
  try {
    const brands = [
      {
        name: "Nike",
      },
      {
        name: "Adidas",
      },
      {
        name: "Puma",
      },
      {
        name: "Under Armour",
      },
      {
        name: "Reebok",
      },
    ];

    const categories = [
      {
        name: "Clothing",
      },
      {
        name: "Shoes",
      },
      {
        name: "Accessories",
      },
    ];

    const users = [
      {
        name: "Alice",
        email: "alice@example.com",
      },
    ];

    const alicesPost = [
      {
        title: "Vintage Dress",
        description: "A beautiful vintage dress in excellent condition",
        price: 50,
        size: "M",
        sexe: "female",
        brand: {
          connect: { name: "Nike" },
        },
        category: {
          connect: { name: "Clothing" },
        },
      },
      {
        title: "Men's T-Shirt",
        description: "A gently used men's t-shirt in size L",
        price: 15,
        size: "L",
        sexe: "male",
        brand: {
          connect: { name: "Adidas" },
        },
        category: {
          connect: { name: "Clothing" },
        },
      },
      {
        title: "Women's Jacket",
        description: "A brand new women's jacket in size S",
        price: 75,
        size: "S",
        sexe: "female",
        brand: {
          connect: { name: "Puma" },
        },
        category: {
          connect: { name: "Clothing" },
        },
      },
      {
        title: "Men's Jeans",
        description: "A pair of gently used men's jeans in size 32",
        price: 30,
        size: "32",
        sexe: "male",
        brand: {
          connect: { name: "Under Armour" },
        },
        category: {
          connect: { name: "Clothing" },
        },
      },
      {
        title: "Women's Skirt",
        description: "A brand new women's skirt in size XS",
        price: 35,
        size: "XS",
        sexe: "female",
        brand: {
          connect: { name: "Reebok" },
        },
        category: {
          connect: { name: "Clothing" },
        },
      },
    ];

    brands.map(async (brand) => {
      return await pr.brand.create({ data: { name: brand.name } });
    });

    categories.map(async (category) => {
      return await pr.category.create({ data: { name: category.name } });
    });

    users.map(async (user) => {
      return await pr.user.create({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    });

    alicesPost.map(async (post) => {
      return await pr.post.create({
        data: {
          title: post.title,
          description: post.description,
          price: post.price,
          size: post.size,
          sexe: post.sexe,
          brand: post.brand,
          category: post.category,
          // userId: users[0].id,
          //@ts-ignore
          // user: { create: { name: users[0].name, email: users[0].email } },
          user: { connect: { email: users[0].email } },
        },
      });
    });
  } catch (e) {
    console.log(e);
  } finally {
    await pr.$disconnect();
  }
}

seed();
