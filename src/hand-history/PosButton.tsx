type Props = {
  positions: string[];
};

export const PosButton = ({ positions }: Props) => {
  return (
    <div className="flex gap-1">
      {positions.map((pos) => {
        return (
          <button key={pos} type="button" className="border rounded w-10 h-5">
            {pos}
          </button>
        );
      })}
    </div>
  );
};
