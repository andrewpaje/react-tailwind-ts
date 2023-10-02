import { FilterValue } from "react-table";

export interface IIndeterminateInputProps {
  indeterminate?: boolean;
  value?: string;
}

export interface GlobalFilterProps {
  globalFilter: string;
  setGlobalFilter: (filterValue: FilterValue) => void;
}
