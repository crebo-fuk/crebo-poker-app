import type { HandItem } from "../types/type";
import { HandSummary } from "./HandSummary";

type Props = {
  hands: HandItem[];
};

export const HandStatistics = ({ hands }: Props) => {
  return (
    <div>
      <HandSummary hands={hands} />
    </div>
  );
};
