import Link from "next/link";
import React from "react";
const OptionsLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className={'m-8'}>
      <div>
        <Link href={'/'} className={"text-white"}>Back</Link>
      </div>
      {children}
    </div>
  );
}

export default OptionsLayout;
