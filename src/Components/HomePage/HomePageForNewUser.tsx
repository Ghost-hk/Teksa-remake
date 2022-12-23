import Image from "next/image";
import { useState } from "react";

const HomePageForNewUser = () => {
  const [seller, setSeller] = useState<boolean>(true);
  return (
    <>
      {/* Hero */}
      <div className="h-[60vh] w-full">
        <div className="relative h-full">
          <div className="absolute bottom-0 top-0 left-0 z-10 w-full bg-gradient-to-r from-gray-900"></div>
          <Image
            src="/hero-big-img.jpg"
            alt="HeroImg"
            fill
            style={{
              objectFit: "cover",
              //   zIndex: 1,
            }}
          />
          {/* Hero Text */}
          <div className="absolute left-6 bottom-6 z-10">
            <h1 className="mb-1 text-xl font-semibold text-white md:text-xl xl:text-2xl">
              Sell <span className="text-violet-600">&</span> Buy,
              <br />
              Change you <span className="text-violet-600">Style</span>.
            </h1>
            <p className="w-2/3 text-sm text-white xl:text-base">
              Discover new look, fashion by keeping your wallet full and your
              wardrobe cool.
            </p>
          </div>
        </div>
      </div>

      {/* Find New Style */}
      <div className="flex items-center justify-center bg-white">
        <div className="mt-10 grow items-center px-3 md:mx-3 md:flex md:max-w-5xl md:justify-between md:px-0 lg:mx-5 lg:max-w-6xl xl:max-w-7xl">
          <div className="mb-5 w-full md:mb-0 md:max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 md:text-2xl xl:text-2xl">
              Find <span className="text-violet-600">New</span> Style
            </h2>
            <p className="my-4 text-sm text-gray-600 md:max-w-sm xl:max-w-md xl:text-base">
              Choose from the biggest brands you know and love. Discover
              independent brands made by creative artists. Whatever you&apos;re
              into, find the item and the seller for you.
            </p>
            <button className="rounded-md border border-violet-600 px-6 py-2 text-violet-600">
              Discover Now
            </button>
          </div>
          <div className="relative h-52 w-full overflow-hidden rounded-md md:h-64 md:max-w-lg">
            <Image src="/find-new-style.jpg" alt="FindNewStyle" fill />
          </div>
        </div>
      </div>

      {/* Share Your Flow */}
      <div className="flex items-center justify-center bg-white">
        <div className="mt-5 grow items-center px-3 md:mx-3 md:flex md:max-w-5xl md:flex-row-reverse md:justify-between md:px-0 lg:mx-5 lg:max-w-6xl xl:max-w-7xl">
          <div className="mb-5 w-full md:mb-0 md:max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 md:text-2xl xl:text-2xl">
              Share Your <span className="text-violet-600">Flow</span>
            </h2>
            <p className="my-4 text-sm text-gray-600 md:max-w-sm xl:max-w-md xl:text-base">
              Don&apos;t waste the unused clothes, trade them with profit, save
              the planet and the space in your wardrobe. Let&apos;s get thrifty.
            </p>
            <button className="rounded-md border border-violet-600 px-6 py-2 text-violet-600">
              Sell Now
            </button>
          </div>
          <div className="relative mr-3 h-52 w-full overflow-hidden rounded-md md:h-64 md:max-w-lg">
            <Image src="/SellImage.jpg" alt="FindNewStyle" fill />
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-10 w-full bg-white px-3 md:flex md:justify-center">
        <div className="md:max-w-lg">
          {/* How it works Title */}
          <h2 className="text-center text-xl font-semibold  text-gray-800 md:text-2xl xl:text-2xl">
            HOW IT WORKS
          </h2>

          {/* Seller or Buyer */}
          <div className="mt-3 flex">
            <div
              className={`bor w-full border-b-2 ${
                seller ? "border-violet-600" : "border-gray-600"
              } cursor-pointer`}
              onClick={() => setSeller((prev) => !prev)}
            >
              <h3 className="text-center font-semibold text-gray-800">
                I Am a Seller
              </h3>
            </div>
            <div
              className={`bor w-full border-b-2 ${
                !seller ? "border-violet-600" : "border-gray-600"
              } cursor-pointer`}
              onClick={() => setSeller((prev) => !prev)}
            >
              <h3 className="text-center font-semibold text-gray-800">
                I Am a Buyer
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="mt-4">{seller ? <Seller /> : <Buyer />}</div>
        </div>
      </div>

      {/* We've Got Your Back */}
      <div className="mt-10 w-full bg-white px-3 md:flex md:justify-center">
        <div className="md:max-w-lg">
          {/* We've Got Your Back Title */}
          <h2 className="text-center text-xl font-semibold text-gray-800 md:text-2xl xl:text-2xl">
            WE&apos;VE GOT YOUR BACK
          </h2>

          {/* Protected Payments */}
          <div className="mt-5 flex">
            <div className="mr-4">
              <Image
                src="/secure-payment.png"
                alt="FindNewStyle"
                width={64}
                height={64}
              />
            </div>
            <div>
              <h3 className="font-semibold uppercase text-gray-800 xl:text-lg">
                protected payments
              </h3>
              <p className="text-sm text-gray-600 xl:text-base">
                If it&apos;s not what you ordered, we guarantee to give your
                money back.
              </p>
            </div>
          </div>

          {/* Expedited Shipping*/}
          <div className="mt-5 flex">
            <div className="mr-4">
              <Image
                src="/express-delivery.png"
                alt="FindNewStyle"
                width={64}
                height={64}
              />
            </div>
            <div>
              <h3 className="font-semibold uppercase text-gray-800 xl:text-lg">
                Expedited Shipping
              </h3>
              <p className="text-sm text-gray-600 xl:text-base">
                All orders ship via USPS priority mail. With our pre-paid label,
                shipping has never been easier!
              </p>
            </div>
          </div>
          {/* Free Authentication */}
          <div className="mt-5 flex">
            <div className="mr-4">
              <Image
                src="/identification.png"
                alt="FindNewStyle"
                width={64}
                height={64}
              />
            </div>
            <div>
              <h3 className="font-semibold uppercase text-gray-800 xl:text-lg">
                Free Authentication
              </h3>
              <p className="text-sm text-gray-600 xl:text-base">
                Shop with confidence! Posh Authenticate offers free
                authentication on luxury items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageForNewUser;

export const Seller = () => {
  return (
    <div className="w-full">
      <div className="flex w-full items-center">
        <p className="mr-2 text-center font-semibold uppercase">
          step
          <br />
          01
        </p>
        <div className="w-full">
          <p className="border-b-2 border-gray-800 font-semibold uppercase text-gray-800 xl:text-lg">
            list it
          </p>
          <p className="mt-2 text-sm text-gray-600 xl:text-base">
            Take a photo and upload to your closet in less than 60 seconds–right
            from your phone!
          </p>
        </div>
      </div>
      <div className="my-3 flex w-full flex-row-reverse items-center">
        <p className="ml-2 text-center font-semibold uppercase">
          step
          <br />
          02
        </p>
        <div className="w-full">
          <p className="border-b-2 border-gray-800 font-semibold uppercase text-gray-800 xl:text-lg">
            share it
          </p>
          <p className="mt-2 text-sm text-gray-600 xl:text-base">
            Share listings to your network for shoppers to discover! More
            sharing = more sales.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center">
        <p className="mr-2 text-center font-semibold uppercase">
          step
          <br />
          03
        </p>
        <div className="w-full">
          <p className="border-b-2 border-gray-800 font-semibold uppercase text-gray-800 xl:text-lg">
            earn cash
          </p>
          <p className="mt-2 text-sm text-gray-600 xl:text-base">
            Shipping is easy with our pre-paid label, and you&apos;ll get cash
            in your pocket when the item is delivered!
          </p>
        </div>
      </div>
    </div>
  );
};

export const Buyer = () => {
  return (
    <div className="w-full">
      <div className="flex w-full items-center">
        <p className="mr-2 text-center font-semibold uppercase">
          step
          <br />
          01
        </p>
        <div className="w-full">
          <p className="border-b-2 border-gray-800 font-semibold uppercase text-gray-800 xl:text-lg">
            discover items
          </p>
          <p className="mt-2 text-sm text-gray-600 xl:text-base">
            From women to men to kids, discover a wide selection of items across
            thousands of brands—at prices up to 70% off!
          </p>
        </div>
      </div>
      <div className="my-3 flex w-full flex-row-reverse items-center">
        <p className="ml-2 text-center font-semibold uppercase">
          step
          <br />
          02
        </p>
        <div className="w-full">
          <p className="border-b-2 border-gray-800 font-semibold uppercase text-gray-800 xl:text-lg">
            get styled
          </p>
          <p className="mt-2 text-sm text-gray-600 xl:text-base">
            Find the perfect look with personalized recommendations from
            millions of stylists, right at your fingertips.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center">
        <p className="mr-2 text-center font-semibold uppercase">
          step
          <br />
          03
        </p>
        <div className="w-full">
          <p className="border-b-2 border-gray-800 font-semibold uppercase text-gray-800 xl:text-lg">
            spread the love
          </p>
          <p className="mt-2 text-sm text-gray-600 xl:text-base">
            Orders arrive in two days with Priority Mail shipping. If you love
            it, leave the seller a note to let them know!
          </p>
        </div>
      </div>
    </div>
  );
};
