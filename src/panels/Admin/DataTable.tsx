import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
}

export const DataTable = <T,>({ columns, data }: DataTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="border-b border-gray-300 text-left"
          >
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="p-2 font-medium whitespace-nowrap">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-gray-100 hover:bg-gray-50"
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-2 align-top">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
