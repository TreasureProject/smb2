import { json } from "@remix-run/node";
import { AnimationContainer } from "~/components/AnimationContainer";
import { useCustomLoaderData } from "~/hooks/useCustomLoaderData";

export const loader = async () => {
  return json({
    message: "wooooo"
  });
};

export default function Smolspace() {
  const data = useCustomLoaderData<typeof loader>();

  return (
    <AnimationContainer className="bg-acid p-3">
      <h1 className="font-medium italic font-chad text-7xl">Smolspace</h1>
      <div className="font-neuebit mt-3 flex gap-4 font-bold">
        <div className="flex basis-72 flex-col gap-4">
          <div className="bg-fud p-1">
            <p className="text-white text-2xl">Hello, Smol #12345!</p>
            <div className="bg-neonPink p-1">
              <div className="flex items-start">
                <img
                  src="https://djmahssgw62sw.cloudfront.net/general/0x526dadcb2829176864d05a9005296fe135550ebbe1e4978f4d5da1656b521e6b.svg"
                  alt="smol #12345"
                  className="aspect-square h-auto w-36"
                />
                <div className="ml-2 flex flex-col text-vroom underline">
                  <p>Edit Profile</p>
                  <p>Edit Status</p>
                  <p>Edit Your Links</p>
                  <p>Add/Edit Photo</p>
                  <p>Message Bing</p>
                  <p>Account Settings</p>
                </div>
              </div>
              <div className="mt-1">
                <p>View My:</p>
                <nav>
                  <ul className="inline-flex flex-wrap divide-x-2 divide-vroom text-vroom leading-[0.4]">
                    <li className="p-1">Profile</li>
                    <li className="p-1">Photos</li>
                    <li className="p-1">Friends</li>
                    <li className="p-1">Links</li>
                    <li className="p-1">Messages</li>
                    <li className="p-1">Settings</li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between bg-dream p-1">
              <p className="text-2xl">Smolspace Announcements</p>
            </div>
            <div className="mt-4">
              <img
                src="https://ca.slack-edge.com/T031NQXG1SL-U031GNTKE0L-08bf4967182b-512"
                alt=""
                className="float-left m-1 aspect-square h-auto w-24"
              />
              <p className="text-vroom underline">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam
                odit maxime nesciunt architecto voluptatem rerum quaerat est
                magnam, accusamus quod omnis reiciendis adipisci placeat
                aspernatur illo ipsa beatae, rem excepturi...
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1">
            <div className="flex-1">
              <p className="text-3xl">Your latest blog entries</p>
              <p>There are no blog entries yet.</p>
            </div>
            <div className="flex basis-48 flex-col bg-tang p-1">
              <p className="text-center text-white text-2xl">Nov 12, 2021</p>
              <div className="flex-1 bg-white p-1">
                <p className="text-center font-bold">Your Friends:</p>
                <p className="text-center text-neonPink">2</p>
                <p className="text-center font-bold">Profile Views:</p>
                <p className="text-center text-neonPink">24</p>
                <p className="text-center font-bold">Joined:</p>
                <p className="text-center text-neonPink">2 hours ago</p>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-pepe p-1">
            <p className="text-2xl">Cool New People</p>
            <div className="flex justify-evenly bg-white p-1">
              <div>
                <p className="text-center text-vroom text-xl">Mollie Smith</p>
                <img
                  className="aspect-square h-auto w-32"
                  src="https://djmahssgw62sw.cloudfront.net/general/0x9f76da85286fb06d6cde2c4e6e86a0819c415161d4b4cb1c692e013b496e6bda.svg"
                  alt=""
                />
              </div>
              <div>
                <p className="text-center text-vroom text-xl">Jake Kinsley</p>
                <img
                  className="aspect-square h-auto w-32"
                  src="https://djmahssgw62sw.cloudfront.net/general/0x6189e7b1ed5b205faa30db27873d97595c2b7fa3f38c6a3618d118cdd8ba7b5c.svg"
                  alt=""
                />
              </div>
              <div>
                <p className="text-center text-vroom text-xl">
                  Aiden McLaughlin
                </p>
                <img
                  className="aspect-square h-auto w-32"
                  src="https://djmahssgw62sw.cloudfront.net/general/0x51c96669fe6ec1a2ff3f71772cfd5b57d1a39895446855115afca9e449ba06d6.svg"
                  alt=""
                />
              </div>
              <div>
                <p className="text-center text-vroom text-xl">Faye L Bing</p>
                <img
                  className="aspect-square h-auto w-32"
                  src="https://djmahssgw62sw.cloudfront.net/general/0x9bb1e35bda8cf97a7a8cc339c9f03a9f21d269014501e7c5d1492324cdac8fb7.svg"
                  alt=""
                />
              </div>
              <div>
                <p className="text-center text-vroom text-xl">Paul Brooks</p>
                <img
                  className="aspect-square h-auto w-32"
                  src="https://djmahssgw62sw.cloudfront.net/general/0xac20ab637276fbecfd26ecbf1685f61e5034db6d1761ed6c1ec6cd700ff8e55e.svg"
                  alt=""
                />
              </div>
              <div>
                <p className="text-center text-vroom text-xl">Erika You</p>
                <img
                  className="aspect-square h-auto w-32"
                  src="https://djmahssgw62sw.cloudfront.net/general/0x75c1ebcd5ff13dae2338f424253a12cbf68356fb824434abb2a112bbd011dc5c.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-tang/80 p-1 text-red-800">
              <p className="text-2xl">Friend Requests</p>
            </div>
            <p className="text-2xl">0 Open Friend Requests</p>
            <button className="rounded-md border border-black bg-gray-300 px-2">
              View All Friend Requests
            </button>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between bg-pepe p-1">
              <p className="text-2xl">Your Friend's Bulletins</p>
              <p className="text-vroom">[view all bulletins]</p>
            </div>
            <ul>
              <li className="inline-flex space-x-1 text-xl">
                <p>Jake -</p>
                <p className="text-vroom">
                  How did you find out about Smolspace?
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AnimationContainer>
  );
}
