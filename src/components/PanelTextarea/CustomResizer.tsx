import { memo } from "react";

export const CustomResizer = memo(() => {
  return (
    <div className="w-[16px] h-[16px] absolute bottom-0 right-0 pointer-events-none !bg-light-bg-primary dark:!bg-dark-gray-light">
      <div className="w-[10px] border-0 border-t border-solid border-light-typo-gray dark:border-dark-typo-gray -rotate-45 rounded absolute top-1/2 left-1/3" />
      <div className="w-[4px] border-0 border-t border-solid border-light-typo-gray dark:border-dark-typo-gray -rotate-45 ml-[5px] mt-[2px] rounded absolute top-1/2 left-1/3" />
    </div>
  );
});
