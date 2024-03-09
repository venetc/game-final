import BaseTable from "./BaseTable";

import type { ComponentProps, ReactNode } from "react";


const Row = ({
  children,
  multiple = false,
  ...rest
}: { children: ReactNode; multiple?: boolean } & ComponentProps<
  typeof BaseTable
>) => (
  <BaseTable {...rest}>
    <tbody>{multiple ? children : <tr>{children}</tr>}</tbody>
  </BaseTable>
);

export default Row;
