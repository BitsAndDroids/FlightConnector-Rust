interface ElementActions<T> {
  addSelected: (element: T, selected: boolean) => void;
}

interface TableProps<T> {
  elements: Record<string, T>[];
  deleteById?: (id: number) => void;
  editById?: (id: number) => void;
  addSelected?: ElementActions<T>;
  selectable?: boolean;
  headers: string[];
}

export const Table = ({
  elements,
  deleteById,
  editById,
  addSelected,
  selectable,
  headers,
}: TableProps<any>) => {
  return (
    <div className="bg-white rounded-md h-[88%]">
      <div className="overflow-auto h-full ml-4 mr-1">
        <table className="divide-y divide-gray-300 mt-2">
          <thead className="sticky top-0 bg-white z-10">
            <tr key={`table-${typeof elements.at(0)}`}>
              {selectable && <th key={`select-col`}></th>}
              <th
                key={0}
                className="font-semibold text-gray-800 py-3.5 pl-6 pr-3 text-left"
              >
                {headers[0]}{" "}
              </th>
              {headers.length > 1 &&
                headers.slice(1).map((header, index) => (
                  <th
                    key={index}
                    className="font-semibold text-gray-800 py-3.5 pl-6 pr-3 text-left"
                  >
                    {header}
                  </th>
                ))}
              {(deleteById || editById) && (
                <th
                  className="font-semibold text-gray-800 py-3.5 pl-6 pr-3 text-left"
                  key={`actions-col`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="">
            {elements.map((element, index) => (
              <tr key={`tr-${index}`} className="">
                {selectable && (
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        addSelected?.addSelected(element, e.target.checked)
                      }
                    />
                  </td>
                )}
                {headers.map((header, headerIndex) => (
                  <td
                    key={`${headerIndex}-${index}`}
                    className="py-4 pl-4 pr-3 text-sm sm:pl-6"
                  >
                    {element[header as keyof typeof element]}
                  </td>
                ))}
                <td
                  key={`$-${index}-del`}
                  className="py-4 pl-4 pr-3 text-sm sm:pl-6"
                >
                  <span className="inline-flex flex-row items-center align-middle justify-items-center h-full">
                    {deleteById && (
                      <img
                        src={"/trashcan.svg"}
                        alt="info"
                        onClick={(e) => {
                          deleteById(element.id);
                          e.stopPropagation();
                        }}
                        className="cursor-pointer h-[16px] mr-2"
                      />
                    )}
                    {editById && (
                      <img
                        src={"/edit.svg"}
                        alt="info"
                        onClick={(e) => {
                          editById(element.id);
                          e.stopPropagation();
                        }}
                        className="cursor-pointer h-[16px]"
                      />
                    )}
                  </span>
                </td>
                {}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
