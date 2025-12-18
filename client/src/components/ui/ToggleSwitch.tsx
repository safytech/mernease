import clsx from "clsx";
import { toggleBase, toggleDot } from "@/styles/twClasses";

type ToggleProps = {
  checked: boolean;
  onChange: () => void;
  className?: string;
};

const ToggleSwitch = ({ checked, onChange, className }: ToggleProps) => (
  <div
    onClick={onChange}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(); }}
    className={clsx(toggleBase, checked ? "bg-[#3C50E0]" : "bg-gray-300 dark:bg-dark-600", className)}
  >
    <span className={clsx(toggleDot, checked ? "translate-x-6" : "translate-x-1")} />
  </div>
);

export default ToggleSwitch;
