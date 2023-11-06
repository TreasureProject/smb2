import { AnimationContainer } from "~/components/AnimationContainer";
import CarVid from "./car.mp4";
import Smol from "./smol.png";

export default function News() {
  return (
    <AnimationContainer className="h-full bg-[rgb(68,0,11)]">
      <div className="flex h-full flex-col p-2 text-xs">
        <div className="flex-1 bg-[#a7a789] p-3.5">
          <div className="grid h-full grid-cols-[repeat(12,1fr)] grid-rows-[min-content_min-content_min-content_1fr] gap-2.5 bg-[#c5c5b8] p-4">
            <div className="col-span-full flex justify-between border-b border-black pb-2 text-center">
              <h1 className="font-paperboy text-center font-normal tracking-widest text-[0.5rem] leading-none capsize">
                NOVEMBER 21, 2021
              </h1>
              <p className="font-paperboy text-center font-normal tracking-widest text-[0.5rem] leading-none capsize">
                ISSUE 1
              </p>
            </div>
            <div className="font-paperboy col-span-full h-full border-b border-t border-black py-4 text-center tracking-widest text-[0.5rem] leading-none capsize">
              <p>YOUR DAILY DOSE OF ALL THINGS SMOL</p>
            </div>
            <h1 className="col-span-full border-t border-black py-6 text-center font-bold tracking-wider font-mondwest text-8xl leading-none capsize">
              SMOL STREET JOURNAL
            </h1>
            <div className="col-span-4 border border-black p-3">
              <h2 className="font-bold font-mondwest text-4xl leading-none capsize">
                AGE OF PROSPERITY
              </h2>
              <div className="mt-4">
                <img
                  src={Smol}
                  className="float-left mr-4 aspect-square w-48"
                  alt=""
                />

                <p className="font-normal font-mondwest text-2xl leading-none capsize">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Porro, cum maiores? Fuga repellendus, aliquam sequi iusto
                  saepe exercitationem nihil, pariatur non adipisci rerum
                  aliquid moles Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Ad eligendi consequatur ipsam recusandae
                  quaerat! Ex dicta cumque, quaerat laudantium et eaque
                  dignissimos? Minus, sapiente illo iure illum earum laudantium
                  fugit? Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Ex explicabo pariatur, delectus perferendis labore
                  consequatur id temporibus aperiam aspernatur, repellendus eos
                  totam at deserunt maxime accusantium dolorem et ratione rerum.
                </p>
              </div>
            </div>
            <div className="col-span-4 border border-black p-3">
              <h2 className="font-bold font-mondwest text-4xl leading-none capsize">
                SMOLS PLANNING A DOWNTOWN BASH IN SMOLVILLE TO RING IN THE NEW
                YEAR. TICKETS ON SALE.
              </h2>
              <h3 className="mt-8 text-center font-bold font-mondwest text-3xl leading-none capsize">
                LOCAL NEWS
              </h3>
              <p className="mt-2 text-center font-mondwest text-xl leading-none capsize">
                Beef Thompson, retired superstar wrester, opens Beef House Gym
                in Skull Canyon
              </p>
              <h3 className="mt-8 text-center font-bold font-mondwest text-3xl leading-none capsize">
                WEATHER
              </h3>
              <p className="mt-2 text-center font-mondwest text-xl leading-none capsize">
                More snow expected.
              </p>
            </div>
            <div className="col-span-4 border border-black p-3">
              <h2 className="text-center font-bold font-mondwest text-4xl leading-none capsize">
                ALIENS DISCOVERED
              </h2>
              <p className="mt-4 font-mondwest text-xl leading-none capsize">
                Saltellites intercepted communication broadcasts from an alien
                race last night.
              </p>
              <video autoPlay loop muted playsInline className="mt-4">
                <source src={CarVid} type="video/mp4" />
              </video>
              <p className="mt-4 font-mondwest text-xl leading-none capsize">
                Creature seemed to be sending a proof of life message for
                reasons unknown.
              </p>
            </div>
          </div>
        </div>
        <div className="font-paperboy bg-[#6d000d] p-2.5 tracking-widest text-white text-[0.5rem] leading-none capsize">
          <p>You never own a Smolex - You're just a simple Smol.</p>
        </div>
      </div>
    </AnimationContainer>
  );
}
