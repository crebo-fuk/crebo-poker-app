import type { HandItem } from "../types/type";
import { HandSummary } from "./HandSummary";

type Props = {
  hands: HandItem[];
};

export const HandStatistics = ({ hands }: Props) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-center mt-2 mb-3">ハンド統計</h2>
      <div>
        <HandSummary hands={hands} />
      </div>
    </div>
  );
};
