import type { PropsWithChildren } from "react";
import clsx from "clsx";

export type ButtonProps = PropsWithChildren<{
  disabled?: boolean;
  onClick: () => void;
}>;

export const Button = ({ children, disabled, onClick }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "border hover:bg-gray-200 rounded px-2 py-0.5 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
