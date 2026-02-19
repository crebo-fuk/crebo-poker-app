import type { HandItem } from "../types/type";

type Props = {
  hands: HandItem[];
};

export const PosStats = ({ hands }: Props) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-center mt-2 mb-3">
        ポジション別収支
      </h2>
    </div>
  );
};
