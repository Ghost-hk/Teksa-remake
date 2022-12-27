//@ts-ignore
const user = [
  {
    email: "ibradawdi1@gmail.com",
    name: "Ibrahim",
  },
  {
    email: "dawdighost12@gamil.com",
    name: "Dawdi",
  },
  {
    email: "ghost-hk@mail.com",
    name: "Ghost",
  },
];

const category = [
  {
    name: "Hat",
  },
  {
    name: "Hoodie",
  },
  {
    name: "T-shirt",
  },
];

const brand = [
  {
    name: "Nike",
  },
  {
    name: "Adidas",
  },
  {
    name: "Puma",
  },
];

const images = [
  //red hoodie
  {
    imageUrl: "https://teksa-images.s3.eu-west-2.amazonaws.com/redHoodie.jpeg",
    postId: 1,
  },
  //black hoodie
  {
    imageUrl:
      "https://teksa-images.s3.eu-west-2.amazonaws.com/balckHoodie.jpeg",
    postId: 2,
  },
  // red T-shirt
  {
    imageUrl: "https://teksa-images.s3.eu-west-2.amazonaws.com/redTShirt.jpeg",
    postId: 3,
  },
  // blue T-shirt
  {
    imageUrl: "https://teksa-images.s3.eu-west-2.amazonaws.com/bleuTShirt.jpeg",
    postId: 4,
  },
  // hat
  {
    imageUrl: "https://teksa-images.s3.eu-west-2.amazonaws.com/redHat.jpeg",
    postId: 5,
  },
];

const posts = [
  {
    title: "Red Hoodie",
    price: 100,
    sexe: "Male",
    size: "XL",
    brand: { connect: { id: 1 } },
    category: { connect: { id: 2 } },
    userId: 1,
  },
  {
    title: "Black Hoodie",
    price: 150,
    sexe: "Male",
    size: "L",
    brand: { connect: { id: 2 } },
    category: { connect: { id: 2 } },
    userId: 2,
  },
  {
    title: "Red T-shirt",
    price: 90,
    sexe: "Female",
    size: "S",
    brand: { connect: { id: 3 } },
    category: { connect: { id: 3 } },
    userId: 3,
  },
  {
    title: "Blue T-shirt",
    price: 120,
    sexe: "Male",
    size: "XXL",
    brand: { connect: { id: 1 } },
    category: { connect: { id: 3 } },
    userId: 1,
  },
  {
    title: "Red Cap",
    price: 120,
    sexe: "Male",
    size: "Unisize",
    brand: { connect: { id: 1 } },
    category: { connect: { id: 1 } },
    userId: 1,
  },
];

module.exports = {
  user,
  category,
  brand,
  posts,
  images,
};
