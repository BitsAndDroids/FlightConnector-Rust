interface TableProps {
  elements: Record<string, any>[];
  headers: string[];
}

export const Table = ({ elements, headers }: TableProps) => {
  return (
    <div className="bg-white rounded-md h-[90%]">
      <div className="overflow-auto h-full ml-4 mr-1">
        <table className="divide-y divide-gray-300 mt-2">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="font-semibold text-gray-800 py-3.5 pl-6 pr-3 text-left">
                {headers[0]}{" "}
              </th>
              {headers.length > 1 &&
                headers
                  .slice(1)
                  .map((header) => (
                    <th className="font-semibold text-gray-800 py-3.5 pl-6 pr-3 text-left">
                      {header}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody className="">
            {elements.map((element, index) => (
              <tr key={index}>
                {headers.map((header, headerIndex) => (
                  <td
                    key={headerIndex}
                    className="py-4 pl-4 pr-3 text-sm sm:pl-6"
                  >
                    {element[header as keyof typeof element]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
