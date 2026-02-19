import type { HandItem } from "../types/type";

type Props = {
  hands: HandItem[];
};

export const HandSummary = ({ hands }: Props) => {
  const totalHands = hands.length;
  const totalProfitBB = hands.reduce((sum, h) => {
    const n = Number(h.profitBB);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
  const vallidHands = hands.filter((h) => h.profitBB != null);
  const avgProfitBB = totalProfitBB / vallidHands.length;
  const winHands = hands.filter((h) => h.result === "WIN");
  const loseHands = hands.filter((h) => h.result === "LOSE");
  const chopHands = hands.filter((h) => h.result === "CHOP");
  const handsWinRate =
    totalHands > 0 ? ((winHands.length / totalHands) * 100).toFixed(1) : 0;
  return (
    <div>
      <h2 className="text-lg font-bold text-center mt-2 mb-3">ハンド統計</h2>
      <div>総ハンド数：{totalHands}ハンド</div>
      <div>
        合計損益(BB)：{totalProfitBB > 0 ? "+" : ""}
        {totalProfitBB}BB
      </div>
      <div>
        平均損益(BB)：{avgProfitBB > 0 ? "+" : ""}
        {avgProfitBB} BB/hand
      </div>
      <div className="flex gap-3 items-center justify-center">
        <div>
          <div className="text-green-600">WIN</div>
          <div>{winHands.length}</div>
        </div>
        <div>
          <div className="text-red-600">LOSE</div>
          <div>{loseHands.length}</div>
        </div>
        <div>
          <div className="text-gray-600">CHOP</div>
          <div>{chopHands.length}</div>
        </div>
        <div>
          <div>勝率</div>
          <div>{handsWinRate}%</div>
        </div>
      </div>
    </div>
  );
};
