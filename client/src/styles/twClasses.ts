// src/styles/twClasses.ts
export const buttonBase =
  "inline-flex items-center gap-2 rounded-md text-sm font-medium transition focus:outline-none";

export const buttonVariants = {
  primary:
    "bg-[#3C50E0] px-4 py-2 text-white hover:bg-[#293bcc] disabled:opacity-70",
  secondary:
    "border border-gray-300 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] px-4 py-2 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary",
};

export const inputBase =
  "w-full rounded-md border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] py-2 px-3 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-primary";

export const labelBase =
  "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";

export const cardTitle =
  "text-lg font-semibold text-gray-800 dark:text-white";

export const toggleBase =
  "relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-all duration-300";

export const toggleDot =
  "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300";

export const tableContainer =
  "overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]";

export const tableBase =
  "w-full text-left text-sm text-gray-700 dark:text-gray-300";

export const tableHead =
  "bg-gray-100 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 font-medium";

export const tableRowHover =
  "hover:bg-gray-50 dark:hover:bg-white/[0.02] transition";

export const paginationButtonBase =
  "inline-flex items-center gap-1 rounded-md border text-sm px-3 py-1.5 transition";

export const paginationActive =
  "bg-[#3C50E0] text-white border-[#3C50E0]";

export const paginationInactive =
  "border-gray-300 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06]";
