interface RowProps {
  id: string;
  name: string;
  object: any;
  onClick: (set: any) => void;
  onDelete: (toDelete: any) => void;
  setDelete?: boolean;
  setEdit?: boolean;
  onEdit: (toEdit: any) => void;
}
export const Row = (props: RowProps) => {
  return (
    <div
      className="flex flex-row items-center justify-between mb-2 p-2 bg-white rounded-md px-3 drop-shadow"
      key={props.id}
      onClick={() => {
        props.onClick(props.object);
        console.log("set");
      }}
    >
      <p className="">{props.name}</p>
      <div className="flex flex-row justify-between w-12">
        {props.setDelete === undefined || props.setDelete ? (
          <img
            src={"/trashcan.svg"}
            alt="info"
            onClick={(e) => {
              props.onDelete(props.object);
              e.stopPropagation();
            }}
            className="cursor-pointer h-[16px]"
          />
        ) : (
          <span className="w-4"></span>
        )}
        <img
          src={"/edit.svg"}
          alt="info"
          onClick={() => {
            props.onEdit(props.object);
          }}
          className="cursor-pointer h-[16px]"
        />
      </div>
    </div>
  );
};
