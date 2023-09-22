import { cn } from "~/utils";

export const Box = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative overflow-hidden box", className)}>
      {children}
    </div>
  );
};
