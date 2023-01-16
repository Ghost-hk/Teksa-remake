import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

import { trpc } from "../../utils/trpc";
import Image from "next/image";
import moment from "moment";

import { FaPhoneAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const ItemPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [currImageIndex, setCurrImageIndex] = useState<number>(0);

  const { data, isLoading } = trpc.posts.getpostByItemId.useQuery(
    { ItemId: id as string },
    { enabled: !!id, refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <div>loading the data...</div>;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="mx-3 flex-grow md:mx-6 md:max-w-3xl lg:mx-9 lg:max-w-5xl  xl:max-w-7xl">
        {data ? (
          <div className="md:gap-4 lg:flex">
            {/* Item Info */}
            <div className="mt-5 w-full rounded-md bg-white px-2 py-3 shadow-md md:flex md:gap-5">
              {/* Profile info: img, username, updated x days ago */}
              <div className="md:hidden ">
                <div className="mb-4 flex items-center">
                  <div
                    className={`relative mr-2 h-8 w-8 rounded-full bg-red-400 ${
                      !data.user.image && "flex items-center justify-center"
                    }`}
                  >
                    {data.user.image ? (
                      <Image
                        src={data.user.image}
                        fill
                        alt="profile Img"
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm text-white">
                        {data.user.name?.split("")[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col ">
                    <Link
                      href={`/profile/${data.user.id}`}
                      className="text-sm text-violet-600"
                    >
                      {data.user.name}
                    </Link>
                    <p className="text-sm text-gray-400">
                      updated {moment(data.updatedAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
              {/*  Main image & other images */}
              <div className="w-full md:w-[40%]">
                {/* Main Image */}
                <div className="relative aspect-[1/1]  w-full overflow-hidden rounded-md bg-white backdrop-blur-lg">
                  <Image
                    src={`${data.images[currImageIndex]?.imageUrl}`}
                    alt="item Iamge"
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Other Images */}
                <div className="mt-3 flex gap-3">
                  {data.images.map((image, index) => {
                    return (
                      <div
                        key={image.id}
                        className={`relative h-20 w-20 cursor-pointer ${
                          index === currImageIndex
                            ? "border-4 border-violet-600"
                            : "border-2 border-gray-600"
                        }`}
                        onClick={() => setCurrImageIndex(index)}
                      >
                        <Image
                          src={`${image.imageUrl}`}
                          alt="item Iamge"
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Item info: Title, Description, Price, Size, Brand, Profile */}
              <div className="md:max-w-md">
                {/* Title */}
                <div className="col-span-3 col-start-6 mt-4 md:mt-0">
                  <p className="text-xl text-gray-800">{data.title}</p>
                </div>

                {/* Description */}
                {data.description && (
                  <div className="mt-2 text-sm text-gray-600">
                    {data.description}
                  </div>
                )}

                {/* Price, Size, Brand and location */}
                <div className="mt-2 flex gap-4">
                  <div className="">
                    <p className="text-base  text-gray-700">Price:</p>
                    <p className="text-base  text-gray-700">Gender:</p>
                    <p className="text-base  text-gray-700">Size:</p>
                    <p className="text-base  text-gray-700">Brand:</p>
                    <p className="text-base  text-gray-700">Loacation:</p>
                  </div>
                  <div>
                    <p className="text-base font-normal text-gray-800">
                      {data.price} DH
                    </p>
                    <p className="text-base font-normal text-gray-800">
                      {data.sexe}
                    </p>
                    <p className="text-base font-normal text-gray-800">
                      {data.size}
                    </p>
                    <p className="text-base font-normal text-gray-800">
                      {data?.brand[0]?.name}
                    </p>
                    <p className="text-base font-normal text-gray-800">
                      {data.user.location}
                    </p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-4 ">
                  <h2 className="mb-2 text-base font-semibold text-gray-600">
                    Contact Seller
                  </h2>

                  {data.user.phone ? (
                    data.user.showPhone ? (
                      <div className="mb-2">
                        <Link
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-violet-600 px-2 py-1 text-gray-800"
                          href={`tel:${data.user.phone}`}
                        >
                          <FaPhoneAlt />
                          Phone Call
                        </Link>
                      </div>
                    ) : null
                  ) : null}

                  {data.user.whatsapp || data.user.useSameNumber ? (
                    data.user.showWhatsapp ? (
                      <div className="mb-2">
                        <Link
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-violet-600 px-2 py-1 text-gray-800"
                          href={`https://wa.me/${data.user.whatsapp}`}
                          target={"_blank"}
                        >
                          <FaWhatsapp /> Whatsapp
                        </Link>
                      </div>
                    ) : null
                  ) : null}

                  {data.user.instagram ? (
                    data.user.showInstagram ? (
                      <div className="">
                        <Link
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-violet-600 px-2 py-1 text-gray-800"
                          href={`https://ig.me/m/${data.user.instagram}`}
                          target={"_blank"}
                        >
                          <FaInstagram /> Instagram
                        </Link>
                      </div>
                    ) : null
                  ) : null}
                </div>

                {/* Seller */}
                <div className="hidden md:block">
                  <h2 className="mt-4 mb-1 text-base font-semibold text-gray-600">
                    About Seller
                  </h2>
                  <div className="mb-1 flex items-center">
                    <Link
                      href={`/profile/${data.user.id}`}
                      className="text-base font-semibold text-violet-600"
                    >
                      {data.user.name}
                    </Link>
                  </div>

                  <p className=""></p>

                  <p className="text-sm text-gray-400">
                    User since:{" "}
                    {moment(data.user.createdAt).format("MMMM YYYY")}
                  </p>
                  <p className="text-sm text-gray-400">Individual Seller</p>
                  <p className="text-sm text-gray-400">
                    Shered Items: {data.user.posts.length}
                  </p>
                </div>

                {/* Profile info: img, username, updated x days ago */}
                {/* <div className="hidden md:block">
                <div className="mt-4  flex items-center">
                  <div
                    className={`relative mr-2 h-8 w-8 rounded-full bg-red-400 ${
                      !data.user.image && "flex items-center justify-center"
                    }`}
                  >
                    {data.user.image ? (
                      <Image
                        src={data.user.image}
                        fill
                        alt="profile Img"
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm text-white">
                        {data.user.name?.split("")[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col ">
                    <p className="text-sm text-violet-600">{data.user.name}</p>
                    <p className="text-sm text-gray-400">
                      updated {moment(data.updatedAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div> */}
              </div>
            </div>

            {/* Contact & user info */}
            {/* <div className="lg:w-full lg:max-w-xs"> */}
            {/* Contact info */}
            {/* <div className="mt-5 rounded-md bg-white px-2 py-3 text-sm shadow-md">
              <h2 className="mb-2 text-base font-semibold text-gray-600">
                Contact the seller
              </h2>

              {data.user.phone ? (
                data.user.showPhone ? (
                  <div className="flex justify-between">
                    <p className="text-gray-800">Phone Number: </p>
                    <p
                      className="cursor-pointer text-violet-600 underline"
                      onClick={() => {
                        window.open(`tel:${data.user.phone}`);
                      }}
                    >
                      {data.user.phone}
                    </p>
                  </div>
                ) : null
              ) : null}

              {data.user.whatsapp || data.user.useSameNumber ? (
                data.user.showWhatsapp ? (
                  <div className="flex justify-between">
                    <p className="text-gray-800">Whatsapp: </p>
                    <Link
                      className="cursor-pointer text-violet-600 underline"
                      href={`https://wa.me/${data.user.whatsapp}`}
                      target={"_blank"}
                    >
                      Contact
                    </Link>
                  </div>
                ) : null
              ) : null}

              {data.user.instagram ? (
                data.user.showInstagram ? (
                  <div className="flex justify-between">
                    <p className="text-gray-800">Instagram: </p>
                    <Link
                      className="cursor-pointer text-violet-600 underline"
                      href={`https://ig.me/m/${data.user.instagram}`}
                      target={"_blank"}
                    >
                      {data.user.instagram}
                    </Link>
                  </div>
                ) : null
              ) : null}

              {data.user.facebook ? (
                data.user.showFacebook ? (
                  <div className="flex justify-between">
                    <p className="text-gray-800">Fafacebook: </p>
                    <p className="text-violet-600 underline">
                      {data.user.facebook}
                    </p>
                  </div>
                ) : null
              ) : null}
            </div> */}

            {/* User info */}
            {/* <div className="mt-4 hidden w-full rounded-md bg-white px-2 py-3 shadow-md lg:block">
              <div className="mb-4  flex flex-col items-center">
                <div
                  className={`relative mr-2 h-16 w-16 rounded-full bg-red-400
                  ${!data.user.image && "flex items-center justify-center"}`}
                >
                  {data.user.image ? (
                    <Image
                      src={data.user.image}
                      fill
                      alt="profile Img"
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-sm text-white">
                      {data.user.name?.split("")[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-col items-center ">
                  <p className="cursor-pointer text-base text-violet-600">
                    {data.user.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Have been a user since:
                  </p>
                  <p className="text-sm text-gray-400">
                    {moment(data.user.createdAt).format("MMMM YYYY")}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-800">
                Items Shared: {data?.user.posts.length}
              </p>
            </div> */}
            {/* </div> */}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ItemPage;
