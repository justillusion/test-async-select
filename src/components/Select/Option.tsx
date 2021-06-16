export interface OptionProps {
  label: string;
  isCurrent?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

const Option = ({
  label,
  isCurrent,
  isFirst,
  isLast,
  disabled,
  onClick,
  className,
}: OptionProps) => {
  return (
    <li
      className={`focus:border-2 hover:bg-blue-50 px-2 py-1 cursor-default
        ${isCurrent ? "!bg-blue-100" : ""}
        ${isFirst && "rounded-t"}
        ${isLast && "rounded-b"}
        ${disabled && `pointer-events-none !bg-white !text-gray-300`}
        ${className}
      `}
      onClick={onClick}
    >
      {label}
    </li>
  );
};

export default Option;