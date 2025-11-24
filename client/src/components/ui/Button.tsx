import clsx from "clsx";
import { buttonBase, buttonVariants } from "@/styles/twClasses";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
};

const Button: React.FC<Props> = ({ variant = "primary", className, children, ...props }) => (
  <button
    {...props}
    className={clsx(buttonBase, buttonVariants[variant], className)}
  >
    {children}
  </button>
);

export default Button;
