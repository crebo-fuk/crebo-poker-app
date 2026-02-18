import type { HandItem } from "../types/type";
import { useState } from "react";

type Props = {
  hands: HandItem[];
  selectedMemoId: string | null;
  onDeleteHand: (hand: HandItem) => void;
  toggleMemo: (id: string) => void;
  reviewHandIds: string[];
  toggleReviewHand: (id: string) => void;
};

export const HandList = ({
  hands,
  selectedMemoId,
  onDeleteHand,
  toggleMemo,
  reviewHandIds,
  toggleReviewHand,
}: Props) => {
  const splitCard = (hand: string) => {
    const result: string[] = [];
    for (let i = 0; i < hand.length; i += 2) {
      result.push(hand.slice(i, i + 2));
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

  //----------復習（review）表示フィルター----------
  const [onlyReview, setOnlyReview] = useState(false);

  const reviewFilterHands = onlyReview
    ? posFilteredHands.filter((h) => reviewHandIds.includes(h.id))
    : posFilteredHands;

  //----------ハンド勝率集計----------
  const shownHands = reviewFilterHands; //適宜filterかかったハンドを変える
  const totalHands = shownHands.length;
  const totalWin = shownHands.filter((h) => h.result === "WIN").length;
  const totalLose = shownHands.filter((h) => h.result === "LOSE").length;
  const totalChop = shownHands.filter((h) => h.result === "CHOP").length;
  const winRate =
    totalHands > 0 ? Math.round((totalWin / totalHands) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain p-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs">
          <div>
            <div>ハンド数</div>
            <div>{totalHands}</div>
          </div>
          <div>
            <div className="text-green-600">WIN</div>
            <div>{totalWin}</div>
          </div>
          <div>
            <div className="text-red-600">LOSE</div>
            <div>{totalLose}</div>
          </div>
          <div>
            <div className="text-gray-600">CHOP</div>
            <div>{totalChop}</div>
          </div>
          <div>
            <div>勝率</div>
            <div>{winRate}%</div>
          </div>
        </div>
      </div>
      <div className="text-xs flex justify-between">
        <div className="flex gap-3 mt-3 mb-3">
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
        <div className="flex gap-3 mt-3 mb-3 mr-3">
          <div>要復習のみ</div>
          <input
            type="checkbox"
            checked={onlyReview}
            onChange={(e) => setOnlyReview(e.target.checked)}
          />
        </div>
      </div>

      {shownHands.map((hand: HandItem) => {
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
        const resultBorder = resultWin
          ? "border-green-900"
          : resultLose
            ? "border-red-900"
            : "";
        {
          /*---BB計算。後々ハンドそのものにもたせるか */
        }
        const stackChips =
          hand.blindBB > 0
            ? (hand.stackBB * hand.blindBB).toLocaleString()
            : "";
        return (
          <div
            key={hand.id}
            className={`text-xs border p-2 m-1 rounded-xl ${resultBg}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex p-1 m-1 items-center">
                <div className="flex">
                  <div>
                    <div className="flex gap-1">
                      {splitCard(hand.heroHand).map((h, i) => {
                        return (
                          <div
                            className={`border ${resultBorder} rounded-sm text-sm w-7 h-11 flex items-center justify-center`}
                            key={i}
                          >
                            {h}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-11 ml-5">
                    <div className="border rounded bg-gray-200 p-1">
                      {hand.heroPos}
                    </div>
                  </div>
                  {hand.profitBB && (
                    <div className="flex items-center justify-center h-11 ml-5 text-sm">
                      <div
                        className={
                          hand.profitBB > 0
                            ? "text-lime-600"
                            : hand.profitBB < 0
                              ? "text-pink-600 font-semibold"
                              : "text-gray-400"
                        }
                      >
                        {hand.profitBB > 0 ? "+" : ""}
                        {hand.profitBB}BB
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text">
                  <button
                    className={`border rounded py-1 px-2 ${reviewHandIds.includes(hand.id) && "text-red-500 bg-gray-200"}`}
                    onClick={() => toggleReviewHand(hand.id)}
                  >
                    要復習{reviewHandIds.includes(hand.id) ? "✓" : ""}
                  </button>
                </div>
                <button
                  className="pr-3 cursor-pointer"
                  onClick={() => onDeleteHand(hand)}
                >
                  ×
                </button>
              </div>
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
                  <div className="border-b"></div>
                  <div className="flex mt-2">
                    <div className="ml-2 mr-3 flex items-center justify-center">
                      blind
                    </div>
                    {hand.blindSB > 0 && hand.blindBB > 0 && (
                      <div className="mr-3 flex items-center justify-center">
                        {hand.blindSB}/{hand.blindBB}
                      </div>
                    )}
                    <div className="mr-3 flex items-center justify-center">
                      ES
                    </div>
                    {hand.stackBB > 0 && (
                      <div className="flex items-center justify-center">
                        {hand.stackBB}BB (= {stackChips}chips)
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    <div className="ml-2 mr-3 mt-2 h-11 flex items-center justify-center">
                      ボード
                    </div>
                    <div className="flex gap-7 ml-3 mt-2 mb-4">
                      <div className="flex gap-1">
                        {splitCard(hand.flop).length === 3 &&
                          splitCard(hand.flop).map((f, i) => (
                            <div
                              key={i}
                              className="border rounded-sm text-sm w-7 h-11 flex items-center justify-center "
                            >
                              {f}
                            </div>
                          ))}
                        {splitCard(hand.flop).length < 3 && (
                          <div className="flex gap-1">
                            <div className="border rounded-sm text-sm w-7 h-11 flex items-center justify-center"></div>
                            <div className="border rounded-sm text-sm w-7 h-11 flex items-center justify-center"></div>
                            <div className="border rounded-sm text-sm w-7 h-11 flex items-center justify-center"></div>
                          </div>
                        )}
                      </div>
                      <div className="border rounded-sm text-sm w-7 h-11 flex items-center justify-center">
                        {hand.turn}
                      </div>
                      <div className="border rounded-sm text-sm w-7 h-11 flex items-center justify-center">
                        {hand.river}
                      </div>
                    </div>
                  </div>
                  {/*-----ショーダウン-----*/}
                  {hand.villains && (
                    <div className="flex text-xs">
                      <div className="ml-2 mr-3 mt-2 flex items-center justify-center">
                        ショーダウン
                      </div>
                      {hand.villains.map((v) => {
                        return v.villainHand ? (
                          <div key={v.villainHand} className="mr-4">
                            <div className="flex gap-1">
                              {splitCard(v.villainHand).length === 2 &&
                                splitCard(v.villainHand).map((f, i) => (
                                  <div
                                    key={i}
                                    className="border rounded-sm text-sm w-7 h-11 flex items-center justify-center "
                                  >
                                    {f}
                                  </div>
                                ))}
                            </div>
                            <div className="border rounded-2xl bg-gray-200 mt-1">
                              {v.villainPos}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  <div className="grid grid-cols-4 w-full text-left h-30 bg-gray-200 rounded-xl mt-2">
                    <div className="border-r ml-2">
                      <div>プリフロップ</div>
                      <div className="whitespace-pre-wrap mt-2">
                        {hand.preflopAction}
                      </div>
                    </div>
                    <div className="border-r ml-1">
                      <div>フロップ</div>
                      <div className="whitespace-pre-wrap mt-2">
                        {hand.flopAction}
                      </div>
                    </div>
                    <div className="border-r ml-1">
                      <div>ターン</div>
                      <div className="whitespace-pre-wrap mt-2">
                        {hand.turnAction}
                      </div>
                    </div>
                    <div className="ml-1">
                      <div className="">リバー</div>
                      <div className="whitespace-pre-wrap mt-2">
                        {hand.riverAction}
                      </div>
                    </div>
                  </div>
                  {hand.memo && (
                    <div className="flex mt-3 w-full">
                      <div className="ml-2 mr-3 h-15 w-10 flex items-center justify-center">
                        メモ
                      </div>
                      <div className="p-2 ml-3 mr-3 text-left border rounded-3xl w-full whitespace-pre-wrap">
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
