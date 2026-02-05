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
};

export const HandHistory = ({
  tournaments,
  onAddHand,
  hands,
  onDeleteHand,
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
    const villainPos = value.villainPos.trim();
    const villainHand = value.villainHand.trim();
    const memo = value.memo.trim();
    const preflop = heroHand;
    const flop = value.flop.trim();
    const turn = value.turn.trim();
    const river = value.river.trim();
    const blindSB = value.blindSB;
    const blindBB = value.blindBB;
    const stack = value.stack;
    const result = value.result;
    const preflopAction = value.preflopAction.trim();
    const flopAction = value.flopAction.trim();
    const turnAction = value.turnAction.trim();
    const riverAction = value.riverAction.trim();

    if (!heroPos || !heroHand) {
      alert("Heroポジション・Heroハンドを入力してください");
      return;
    }

    const newHand: HandItem = {
      id: uuidv4(),
      tournamentId: selectedTournamentId,
      heroPos,
      heroHand,
      villainPos,
      villainHand,
      memo,
      preflop,
      flop,
      turn,
      river,
      blindSB,
      blindBB,
      stack,
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
    <div className="h-[80vh] flex flex-col">
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
          <button
            className="cursor-pointer border rounded-2xl p-2 text-sm"
            onClick={() => setIsFormOpen((prev) => !prev)}
          >
            ハンド新規作成＋
          </button>
        </div>
        {/* ==============選択されたトーナメント============== */}
        {selectedTournament != null && (
          <div className="border rounded-2xl p-2 m-3 bg-gray-200">
            <div className="flex justify-between">
              <div className="text-xs">{selectedTournament.date}</div>
              <div className="text-xs flex items-center justify-center">
                {selectedTournament.tableSize}Max
              </div>
            </div>
            <div className="text-sm font-bold">{selectedTournament.name}</div>
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
        />
      )}
    </div>
  );
};
