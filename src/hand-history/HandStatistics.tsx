import type { HandItem } from "../types/type";
import { HandSummary } from "./HandSummary";
import { PosStats } from "./PosStats";

type Props = {
  hands: HandItem[];
};

export const HandStatistics = ({ hands }: Props) => {
  return (
    <div>
      <HandSummary hands={hands} />
      <PosStats hands={hands} />
    </div>
  );
};
