import clsx from "clsx";

import type { PropsWithChildren } from "react";

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return <main className={clsx("grid h-screen place-items-center overflow-auto", "from-navy-50 to-navy-200 bg-gradient-to-br font-rubik")}>{children}</main>;
};
