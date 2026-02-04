import type { HandItem } from "../types/type";
import { useState } from "react";

type Props = {
  hands: HandItem[];
  selectedMemoId: string | null;
  onDeleteHand: (hand: HandItem) => void;
  toggleMemo: (id: string) => void;
};

export const HandList = ({
  hands,
  selectedMemoId,
  onDeleteHand,
  toggleMemo,
}: Props) => {
  const splitCard = (flop: string) => {
    const result: string[] = [];
    for (let i = 0; i < flop.length; i += 2) {
      result.push(flop.slice(i, i + 2));
    }
    return result;
  };

  //----------HeroPos別フィルター----------
  const [selectedHeroPos, setSelectedHeroPos] = useState<string>("ALL");
  const posFilteredHands =
    selectedHeroPos === "ALL"
      ? hands
      : hands.filter((h) => h.heroPos === selectedHeroPos);
  const filteredHeroPos = Array.from(new Set(hands.map((h) => h.heroPos)));

  //----------ハンド勝率集計----------
  const totalHands = posFilteredHands.length;
  const totalWin = posFilteredHands.filter((h) => h.result === "WIN").length;
  const totalLose = posFilteredHands.filter((h) => h.result === "LOSE").length;
  const totalChop = posFilteredHands.filter((h) => h.result === "CHOP").length;
  const winRate =
    totalHands > 0 ? Math.round((totalWin / totalHands) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain p-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 text-xs">
          <div>ハンド数: {totalHands}</div>
          <div className="text-green-600">WIN: {totalWin}</div>
          <div className="text-red-600">LOSE: {totalLose}</div>
          <div className="text-gray-600">CHOP: {totalChop}</div>
          <div>勝率: {winRate}%</div>
        </div>
        <div className="flex gap-3 mr-3 text-xs">
          <div>HEROポジション</div>
          <select
            className="border w-25"
            value={selectedHeroPos}
            onChange={(e) => setSelectedHeroPos(e.target.value)}
          >
            <option value="ALL">ALL</option>
            {filteredHeroPos.map((pos) => (
              <option key={pos} className="">
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>
      {posFilteredHands.map((hand: HandItem) => {
        const isOpenMemo = selectedMemoId === hand.id;
        const resultWin = hand.result === "WIN";
        const resultLose = hand.result === "LOSE";
        const resultChop = hand.result === "CHOP";
        const resultBg = resultWin
          ? "bg-green-100"
          : resultLose
            ? "bg-red-100"
            : resultChop
              ? "bg-gray-100"
              : "";
        {
          /*---BB計算。後々ハンドそのものにもたせるか */
        }
        const stackBB =
          hand.blindBB > 0 ? (hand.stack / hand.blindBB).toFixed(1) : "";
        return (
          <div key={hand.id} className={`border p-2 m-3 ${resultBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex p-2 m-2 items-center">
                <div className="gap-4 flex">
                  <div>
                    <div>(Heroポジション)</div>
                    <div className="flex items-center justify-center h-15">
                      {hand.heroPos}
                    </div>
                  </div>
                  <div>
                    <div>(Heroハンド)</div>
                    <div className="flex gap-1">
                      {splitCard(hand.heroHand).map((h, i) => {
                        return (
                          <div
                            className="border rounded-sm text-sm w-10 h-15 flex items-center justify-center"
                            key={i}
                          >
                            {h}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-red-500 flex items-center justify-center ml-7 mr-7">
                    V S
                  </div>
                  <div>
                    <div>(Villainポジション)</div>
                    <div className="flex items-center justify-center h-15">
                      {hand.villainPos}
                    </div>
                  </div>
                  <div>
                    <div>(villainハンド)</div>
                    <div className="flex gap-1">
                      {splitCard(hand.villainHand).map((h, i) => {
                        return (
                          <div
                            key={i}
                            className="border rounded-sm text-sm w-10 h-15 flex items-center justify-center"
                          >
                            {h}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="pr-3 cursor-pointer"
                onClick={() => onDeleteHand(hand)}
              >
                ×
              </button>
            </div>
            <div className="">
              <div className="flex items-left">
                <div className="ml-3">詳細</div>
                <button
                  className="ml-3 text-sm rounded-3xl cursor-pointer w-8 h-5"
                  onClick={() => {
                    toggleMemo(hand.id);
                  }}
                >
                  {isOpenMemo ? "▲" : "▼"}
                </button>
              </div>
              {/* ==============ハンド詳細画面============== */}
              {isOpenMemo && (
                <div className="items-left">
                  <div className="flex">
                    <div className="ml-5 mr-3 mt-2 w-15 h-10 flex items-center justify-center">
                      blind
                    </div>
                    {hand.blindSB > 0 && hand.blindBB > 0 && (
                      <div className="mr-3 mt-2 w-15 h-10 flex items-center justify-center">
                        {hand.blindSB}/{hand.blindBB}
                      </div>
                    )}
                    <div className="ml-5 mr-1 mt-2 w-12 h-10 flex items-center justify-center">
                      ES
                    </div>
                    {hand.stack > 0 && (
                      <div className="mr-3 mt-2 h-10 flex items-center justify-center">
                        {hand.stack} ({stackBB}BB)
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    <div className="ml-5 mr-3 mt-2 h-15 w-15 flex items-center justify-center">
                      ボード
                    </div>
                    <div className="flex gap-10 ml-3 mt-2 mb-4">
                      <div className="flex gap-1">
                        {splitCard(hand.flop).length === 3 &&
                          splitCard(hand.flop).map((f, i) => (
                            <div
                              key={i}
                              className="border rounded-sm text-sm w-10 h-15 flex items-center justify-center"
                            >
                              {f}
                            </div>
                          ))}
                        {splitCard(hand.flop).length < 3 && (
                          <div className="flex gap-1">
                            <div className="border rounded-sm text-sm w-10 h-15 flex items-center justify-center"></div>
                            <div className="border rounded-sm text-sm w-10 h-15 flex items-center justify-center"></div>
                            <div className="border rounded-sm text-sm w-10 h-15 flex items-center justify-center"></div>
                          </div>
                        )}
                      </div>
                      <div className="border rounded-sm text-sm w-10 h-15 flex items-center justify-center">
                        {hand.turn}
                      </div>
                      <div className="border rounded-sm text-sm w-10 h-15 flex items-center justify-center">
                        {hand.river}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 w-full text-left h-30">
                    <div className="border-r ml-3">
                      <div>プリフロップ</div>
                      <div className="whitespace-pre-wrap mt-2">
                        {hand.preflopAction}
                      </div>
                    </div>
                    <div className="border-r ml-3">
                      <div>フロップ</div>
                      <div className="whitespace-pre-wrap mt-2">
                        {hand.flopAction}
                      </div>
                    </div>
                    <div className="border-r ml-3">
                      <div>ターン</div>
                      <div className="whitespace-pre-wrap mt-2">
                        {hand.turnAction}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="">リバー</div>
                      <div className="whitespace-pre-wrap mt-2">
                        {hand.riverAction}
                      </div>
                    </div>
                  </div>
                  {hand.memo && (
                    <div className="flex mt-3 w-full">
                      <div className="ml-5 mr-3 mt-2 mb-4 h-15 w-15 flex items-center justify-center">
                        メモ
                      </div>
                      <div className="p-3 ml-3 mr-10 text-sm text-left border rounded-3xl w-[80%] whitespace-pre-wrap">
                        {hand.memo}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
