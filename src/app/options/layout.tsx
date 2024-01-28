import Link from "next/link";
import React from "react";
const OptionsLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className={''}>
      <div>
        <Link href={'/'} className={"text-white"}>Back</Link>
      </div>
      <div className="m-8">
        {children}</div>
    </div>
  );
}

export default OptionsLayout;
