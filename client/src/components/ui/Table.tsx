import type {
  ReactNode
} from "react";

export interface TableColumn<T> {
  key:
    | keyof T
    | string;

  title: string;

  render?: (
    row: T
  ) => ReactNode;
}

interface TableProps<
  T extends {
    id:
      | string
      | number;
  }
> {
  columns:
    TableColumn<T>[];

  rows: T[];

  emptyText?: string;
}

const Table = <
  T extends {
    id:
      | string
      | number;
  }
>({
  columns,
  rows,
  emptyText =
    "Aucune donnée disponible"
}: TableProps<T>) => {
  return (
    <div className="table-wrapper">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map(
              (column) => (
                <th
                  key={String(
                    column.key
                  )}
                >
                  {
                    column.title
                  }
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length
                }
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map(
              (row) => (
                <tr
                  key={row.id}
                >
                  {columns.map(
                    (column) => {
                      const record =
                        row as unknown as
                          Record<
                            string,
                            unknown
                          >;

                      const value =
                        record[
                          String(
                            column.key
                          )
                        ];

                      return (
                        <td
                          key={`${row.id}-${String(
                            column.key
                          )}`}
                        >
                          {column.render
                            ? column.render(
                                row
                              )
                            : String(
                                value ??
                                  ""
                              )}
                        </td>
                      );
                    }
                  )}
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
