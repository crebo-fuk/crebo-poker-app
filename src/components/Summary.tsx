import type { RecordItems } from "../types/type";

type Props = {
  records: RecordItems[];
  exchange: (money: number) => string;
};

export const Summary = ({ records, exchange }: Props) => {
  //==============トータル収支==============
  const totalProfit = records.reduce((sum, r) => sum + (r.buyOut - r.buyIn), 0);
  //=============トータル賞金===============
  const totalPrize = records.reduce((sum, r) => sum + r.buyOut, 0);
  //=============最大賞金===========
  const maxPrize = records.reduce((max, r) => Math.max(max, r.buyOut), 0);
  //=============平均buy-in=========== */
  const totalBuyIn = records.reduce((sum, r) => sum + r.buyIn, 0);
  const averageBuyIn =
    records.length === 0 ? 0 : Math.round(totalBuyIn / records.length);
  //=============トーナメント参加数===========
  const totalTmCount = records.length;
  //=============インマネ率===========
  const itmCount = records.filter((r) => r.buyOut > 0).length;
  const itmRate =
    records.length === 0 ? 0.0 : ((itmCount / totalTmCount) * 100).toFixed(1);
  //=============ROI===========
  const Roi =
    totalBuyIn === 0
      ? 0.0
      : (((totalPrize - totalBuyIn) / totalBuyIn) * 100).toFixed(1);

  return (
    <div className="">
      <div className="grid grid-cols-2 text-xs">
        <div className="border rounded-xl mt-1 mr-2 mb-2 p-2 text-left">
          <p className="">トータル収支</p>
          <p
            className={`text-xl ${
              totalProfit > 0
                ? "text-green-500"
                : totalProfit < 0
                  ? "text-red-500"
                  : "text-black"
            }`}
          >
            {totalProfit >= 0 ? "+" : ""}
            {exchange(totalProfit)}
          </p>
        </div>
        <div className="grid grid-cols-2">
          <div className="border rounded-xl mt-1 mr-2 mb-2 p-2 text-left">
            <p>
              ITM({itmCount}/{totalTmCount})
            </p>
            <div className="flex">
              <p className="text-cyan-700 text-sm">{itmRate}%</p>
              <p className=" flex items-center justify-center text-xs"></p>
            </div>
          </div>
          <div className="border rounded-xl mt-1 mr-2 mb-2 p-2 text-left">
            <p>ROI</p>
            <p className="text-sm">{Roi}%</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 text-sm">
        <div className="ring ring-zinc-900 rounded-xl mt-1 mr-2 p-2">
          <p>total賞金</p>
          <p className="text-yellow-600">{exchange(totalPrize)}</p>
        </div>
        <div className="ring ring-zinc-900 rounded-xl mt-1 mr-2 p-2">
          <p>最大賞金</p>
          <p className="text-yellow-600">{exchange(maxPrize)}</p>
        </div>
        <div className="ring ring-zinc-900 rounded-xl mt-1 mr-2 p-2">
          <p>平均buy-in</p>
          <p>{exchange(averageBuyIn)}</p>
        </div>
      </div>
    </div>
  );
};
