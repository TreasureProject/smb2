import { cn } from "~/utils";

export const Button = ({
  children,
  primary,
  ...props
}: {
  children: React.ReactNode;
  primary?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={cn(
      props.className,
      "w-full rounded-md bg-white px-4 py-2 text-black font-formula text-[0.6rem] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base",
      primary && "bg-troll font-semibold uppercase tracking-wider text-white"
    )}
  >
    {children}
  </button>
);
