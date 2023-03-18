import type { DetailedHTMLProps, TableHTMLAttributes } from "react";

type BaseTableProps = Omit<
  DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
  "border"
> &
  Partial<Pick<HTMLTableElement, "align" | "border">>;

const BaseTable = ({ children, ...rest }: BaseTableProps) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <table cellPadding="0" cellSpacing="0" role="presentation" {...rest}>
    {children}
  </table>
);

export default BaseTable;
