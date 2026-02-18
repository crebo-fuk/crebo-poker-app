import type { RecordItems, HandFormValue, HandItem } from "../types/type";
import { useState } from "react";
import { TournamentList } from "./TournamentList";
import { HandList } from "./HandList";
import { HandForm } from "./HandForm";
import { v4 as uuidv4 } from "uuid";

type Props = {
  tournaments: RecordItems[];
  onAddHand: (newHand: HandItem) => void;
  hands: HandItem[];
  onDeleteHand: (hand: HandItem) => void;
  reviewHandIds: string[];
  toggleReviewHand: (id: string) => void;
};

export const HandHistory = ({
  tournaments,
  onAddHand,
  hands,
  onDeleteHand,
  toggleReviewHand,
  reviewHandIds,
}: Props) => {
  const [selectedTournamentId, setTournamentId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<true | false>(false);
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);

  const selectedTournament = tournaments.find(
    (t) => t.id === selectedTournamentId,
  );

  //==============メモ選択関数==============
  const toggleMemo = (id: string) => {
    setSelectedMemoId((prev) => (prev === id ? null : id));
  };

  const onSubmit = (value: HandFormValue) => {
    if (selectedTournamentId === null) return;

    const heroPos = value.heroPos.trim();
    const heroHand = value.heroHand.trim();
    const profitBB = value.profitBB;
    const villains = value.villains.map((v) => ({
      villainPos: v.villainPos.trim(),
      villainHand: v.villainHand.trim(),
    }));
    const memo = value.memo.trim();
    const preflop = heroHand;
    const flop = value.flop.trim();
    const turn = value.turn.trim();
    const river = value.river.trim();
    const blindSB = value.blindSB;
    const blindBB = value.blindBB;
    const stackBB = value.stackBB;
    const result = value.result;
    const preflopAction = value.preflopAction.trim();
    const flopAction = value.flopAction.trim();
    const turnAction = value.turnAction.trim();
    const riverAction = value.riverAction.trim();

    const newHand: HandItem = {
      id: uuidv4(),
      tournamentId: selectedTournamentId,
      heroPos,
      heroHand,
      profitBB,
      villains,
      memo,
      preflop,
      flop,
      turn,
      river,
      blindSB,
      blindBB,
      stackBB,
      result,
      preflopAction,
      flopAction,
      turnAction,
      riverAction,
    };

    onAddHand(newHand);
    setIsFormOpen(false);
  };

  //==============トーナメント未選択時==============
  if (selectedTournamentId === null) {
    return (
      <TournamentList
        tournaments={tournaments}
        onSelectTournament={setTournamentId}
      />
    );
  }

  //==============トーナメントとハンド履歴の合致==============
  const filteredHands: HandItem[] = hands.filter(
    (hand) => selectedTournamentId === hand.tournamentId,
  );

  //==============トーナメント選択時==============
  return (
    <div className="h-[75vh] flex flex-col">
      <div className="">
        <div className="flex items-center justify-between m-3">
          <button
            className="cursor-pointer border rounded-2xl p-2 text-sm"
            onClick={() => {
              setTournamentId(null);
              setIsFormOpen(false);
              setSelectedMemoId(null);
            }}
          >
            一覧へ
          </button>
          {!isFormOpen && (
            <button
              className="cursor-pointer border rounded-2xl p-2 text-sm"
              onClick={() => setIsFormOpen(true)}
            >
              ハンド新規作成＋
            </button>
          )}
          {isFormOpen && (
            <button
              className="cursor-pointer border rounded-2xl px-4 py-2 text-sm"
              onClick={() => setIsFormOpen(false)}
            >
              戻る
            </button>
          )}
        </div>
        {/* ==============選択されたトーナメント============== */}
        {selectedTournament != null && (
          <div className="border rounded-2xl p-1 m-3 bg-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-left">{selectedTournament.date}</div>
              <div className="text-sm font-bold">{selectedTournament.name}</div>
              <div className="text-xs text-right">
                {selectedTournament.tableSize}Max
              </div>
            </div>
          </div>
        )}
        {/* ==============ハンド新規登録フォーム============== */}
        {isFormOpen === true && (
          <HandForm
            onSubmit={onSubmit}
            tableSize={selectedTournament?.tableSize}
          />
        )}
      </div>
      {/* ==============ハンド履歴============== */}
      {selectedTournament != null && isFormOpen !== true && (
        <HandList
          hands={filteredHands}
          selectedMemoId={selectedMemoId}
          onDeleteHand={onDeleteHand}
          toggleMemo={toggleMemo}
          reviewHandIds={reviewHandIds}
          toggleReviewHand={toggleReviewHand}
        />
      )}
    </div>
  );
};
