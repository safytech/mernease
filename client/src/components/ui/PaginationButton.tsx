import clsx from "clsx";
import { paginationButtonBase, paginationActive, paginationInactive } from "@/styles/twClasses";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

const PaginationButton: React.FC<Props> = ({ active, className, children, ...props }) => (
  <button
    {...props}
    className={clsx(
      paginationButtonBase,
      active ? paginationActive : paginationInactive,
      className
    )}
  >
    {children}
  </button>
);

export default PaginationButton;
