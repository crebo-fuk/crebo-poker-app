import type {
  HandFormValue,
  SelectedModal,
  Target,
  Actions,
} from "../types/type";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { HandSelectModal } from "./HandSelectModal";
import { ActButton } from "./ActButton";

type Props = {
  onSubmit: (value: HandFormValue) => void;
  tableSize?: 6 | 9;
};

export const HandForm = ({ onSubmit, tableSize }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm<HandFormValue>({
    defaultValues: {
      heroPos: "",
      heroHand: "",
      villains: [{ villainPos: "", villainHand: "" }],
      memo: "",
      preflop: "",
      flop: "",
      turn: "",
      river: "",
      blindSB: undefined,
      blindBB: undefined,
      stack: undefined,
      result: undefined,
      preflopAction: "",
      flopAction: "",
      turnAction: "",
      riverAction: "",
    },
  });

  const positions9Max: string[] = [
    "UTG",
    "UTG+1",
    "MP",
    "MP+1",
    "HJ",
    "CO",
    "BTN",
    "SB",
    "BB",
  ];
  const positions6Max: string[] = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
  const positions = tableSize === 9 ? positions9Max : positions6Max;

  const results = ["WIN", "LOSE", "CHOP"];

  const submit = (value: HandFormValue) => {
    onSubmit(value);
    reset();
  };

  const { fields, append, remove } = useFieldArray({
    name: "villains",
    control,
  });

  //-----ハンドセレクトのModal作成-----
  const [selectedModal, setSelectedModal] = useState<SelectedModal>(null);
  const [selectedCards, setSelectedCards] = useState<
    Record<Target, string[]> & { villainHands: Record<number, string[]> }
  >({
    heroHand: [],
    flop: [],
    turn: [],
    river: [],
    villainHands: {},
  });
  const maxLength: Record<Target, number> = {
    heroHand: 2,
    flop: 3,
    turn: 1,
    river: 1,
  };
  const VillainHandMaxLength = 2;
  const closeModal = () => {
    setSelectedModal(null);
  };

  //-----ハンドセレクト関数(Villain以外)-----
  const addCard = (target: Target, card: string) => {
    setSelectedCards((prev) => {
      if (prev[target].length >= maxLength[target]) return prev;
      const next = [...prev[target], card];
      if (next.length === maxLength[target]) setValue(target, next.join(""));
      return {
        ...prev,
        [target]: next,
      };
    });
  };
  const handleAddHeroHand = (card: string) => addCard("heroHand", card);
  const handleAddFlopCard = (card: string) => addCard("flop", card);
  const handleAddTurnCard = (card: string) => addCard("turn", card);
  const handleAddRiverCard = (card: string) => addCard("river", card);
  const addVillainCard = (index: number, card: string) => {
    setSelectedCards((prev) => {
      if (prev.villainHands[index].length >= VillainHandMaxLength) return prev;
      const next = [...prev.villainHands[index], card];
      if (next.length === VillainHandMaxLength)
        setValue(`villains.${index}.villainHand`, next.join(""));
      return {
        ...prev,
        villainHands: { ...prev.villainHands, [index]: next },
      };
    });
  };

  const disableCards = [
    ...selectedCards.heroHand,
    ...selectedCards.flop,
    ...selectedCards.turn,
    ...selectedCards.river,
    ...Object.values(selectedCards.villainHands).flat(),
  ];

  //-----カードスロット（Villain以外）-----
  const renderCardSlots = (target: Target) => {
    const selected = selectedCards[target] ?? [];
    const slots = Array.from({ length: maxLength[target] });
    return (
      <div className="flex items-center justify-center gap-3">
        {slots.map((_, i) => {
          const v = selected[i];
          return (
            <button
              key={`${target}-${i}`}
              type="button"
              className={`border w-7 h-10 rounded ${v ? "bg-gray-200" : ""}`}
              onClick={() => {
                setSelectedCards((prev) => {
                  const nextArr = prev[target].slice(0, i);
                  const next = { ...prev, [target]: nextArr };

                  setValue(target, nextArr.join(""), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });

                  return next;
                });

                setSelectedModal(target);
              }}
            >
              {v ?? "＋"}
            </button>
          );
        })}
      </div>
    );
  };

  //-----villainカード用スロット-----
  const renderVillainCardSlots = (index: number) => {
    const selected = selectedCards.villainHands[index] ?? [];
    const slots = Array.from({ length: VillainHandMaxLength });
    return (
      <div className="flex items-center justify-center gap-3">
        {slots.map((_, i) => {
          const v = selected[i];
          return (
            <button
              key={`villain-${index}-${i}`}
              type="button"
              className={`border w-7 h-10 rounded ${v ? "bg-gray-200" : ""}`}
              onClick={() => {
                setSelectedCards((prev) => {
                  const nextArr = (prev.villainHands[index] ?? []).slice(0, i);
                  const nextVIllainHands = {
                    ...prev.villainHands,
                    [index]: nextArr,
                  };
                  setValue(`villains.${index}.villainHand`, nextArr.join(""), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  return { ...prev, villainHands: nextVIllainHands };
                });
                setSelectedModal({ type: "villainHand", index });
              }}
            >
              {v ?? "＋"}
            </button>
          );
        })}
      </div>
    );
  };

  //-----useFieldArrayの使用-----
  //---追加---
  const handleAppendVillain = () => {
    const newIndex = fields.length;
    append({ villainPos: "", villainHand: "" });
    setSelectedCards((prev) => {
      return {
        ...prev,
        villainHands: { ...prev.villainHands, [newIndex]: [] },
      };
    });
  };
  //---削除---
  const handleRemoveVillain = (index: number) => {
    remove(index);
    setSelectedCards((prev) => {
      const nextVillainHands: Record<number, string[]> = {};
      Object.entries(prev.villainHands).forEach(([k, v]) => {
        const i = Number(k);
        if (i < index) nextVillainHands[i] = v;
        if (i > index) nextVillainHands[i - 1] = v;
      });
      return { ...prev, villainHands: nextVillainHands };
    });
  };

  //-----------アクション記入欄----------
  const onAddAction = (targetAction: Actions, targetButton: string) => {
    if (targetButton === "\n") {
      setValue(targetAction, getValues(targetAction) + targetButton);
    } else {
      setValue(targetAction, getValues(targetAction) + targetButton + " ");
    }
  };
  const onDeleteAction = (targetAction: Actions) => {
    setValue(targetAction, "");
  };

  return (
    <>
      <form
        className="p-1 my-3 flex-1 text-xs w-full items-center justify-center"
        onSubmit={handleSubmit(submit)}
      >
        <div className="mb-3 text-sm font-semibold">ハンド新規作成フォーム</div>
        <div className="overflow-y-auto overscroll-contain h-[50vh]">
          <div className="flex items-center justify-between w-full gap-5 mb-2">
            <div className="w-[70%]">
              <div>(blind)</div>
              <div className="flex gap-2">
                <div className="flex items-center justify-center">SB</div>
                <div>
                  <input
                    className="border rounded-xl w-full p-2 h-7"
                    type="number"
                    placeholder="600"
                    {...register("blindSB")}
                  />
                </div>
                <div className="flex items-center justify-center">BB</div>
                <div>
                  <input
                    className="border rounded-xl w-full p-2 h-7"
                    type="number"
                    placeholder="1200"
                    {...register("blindBB")}
                  />
                </div>
              </div>
            </div>
            <div className="">
              <div>(ES)</div>
              <input
                className="border rounded-xl w-full p-2 h-7"
                placeholder="65000"
                type="number"
                {...register("stack")}
              />
            </div>
          </div>
          <div className=" mt-3">
            <div className="flex items-center justify-between gap-3">
              <div className="w-full">
                <div>(Heroポジション)</div>
                <select
                  className="border w-full pl-2 rounded-xl h-7"
                  {...register("heroPos", { required: "選択してください。" })}
                >
                  {positions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                {errors.heroPos && (
                  <p className="text-xs text-red-500">
                    {errors.heroPos.message}
                  </p>
                )}
              </div>
              {/*--------Heroハンド詳細--------*/}
              <div className="w-full">
                <div>(Heroハンド)</div>
                {renderCardSlots("heroHand")}
                {errors.heroHand && (
                  <p className="text-xs text-red-500">
                    {errors.heroHand.message}
                  </p>
                )}
              </div>
              <input
                type="hidden"
                {...register("heroHand", { required: "選択してください" })}
              />
              <div className="m-2">
                <div className="flex items-center justify-center">勝敗</div>
                <select
                  className="border pl-1 h-7 rounded-xl"
                  {...register("result", { required: "選択してください" })}
                >
                  <option value="">選択</option>
                  {results.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.result && (
                  <p className="text-xs text-red-500">
                    {errors.result.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex mt-3 gap-1">
            {/*-----FlopCard選択-----*/}
            <div className="w-full">
              <div className="w-[40vw]">
                <div>(Flop)</div>
                {renderCardSlots("flop")}
              </div>
              <input type="hidden" {...register("flop")} />
            </div>
            {/*--------TurnCard選択--------*/}
            <div className="w-full">
              <div>(Turn)</div>
              {renderCardSlots("turn")}
              <input type="hidden" {...register("turn")} />
            </div>
            {/*-----RiverCard選択-----*/}
            <div className="w-full">
              <div>(River)</div>
              {renderCardSlots("river")}
              <input type="hidden" {...register("river")} />
            </div>
          </div>
          <div className="mt-3">
            <div className="">
              <div>(Preflop アクション)</div>
              <ActButton
                positions={positions}
                onAddAction={onAddAction}
                targetAction={"preflopAction"}
                onDeleteAction={onDeleteAction}
              />
              <textarea
                className="border rounded-xl p-2 w-full mt-1"
                rows={2}
                placeholder="UTG r2.5bb
BTN c"
                {...register("preflopAction")}
              />
            </div>
            <div className="mt-2">
              <div>(Flop アクション)</div>
              <ActButton
                positions={positions}
                onAddAction={onAddAction}
                targetAction={"flopAction"}
                onDeleteAction={onDeleteAction}
              />
              <textarea
                className="border rounded-xl p-2 w-full mt-1"
                rows={2}
                placeholder="××"
                {...register("flopAction")}
              />
            </div>
            <div className="mt-2">
              <div>(Turn アクション)</div>
              <ActButton
                positions={positions}
                onAddAction={onAddAction}
                targetAction={"turnAction"}
                onDeleteAction={onDeleteAction}
              />
              <textarea
                className="border rounded-xl p-2 w-full mt-1"
                rows={2}
                placeholder="hero ×/c 
BTN 3bb"
                {...register("turnAction")}
              />
            </div>
            <div className="mt-2">
              <div>(River アクション)</div>
              <ActButton
                positions={positions}
                onAddAction={onAddAction}
                targetAction={"riverAction"}
                onDeleteAction={onDeleteAction}
              />
              <textarea
                className="border rounded-xl p-2 w-full mt-1"
                rows={2}
                placeholder="hero c/f
BTN 5bb"
                {...register("riverAction")}
              />
            </div>
          </div>
          <div>
            <div className="text-left mt-3 text-break p-2">メモ（任意）</div>
            <textarea
              className="items-left w-full border rounded-xl p-2"
              rows={4}
              {...register("memo")}
            />
          </div>
          <div className="flex text-left mt-3 p-2">
            <div className="flex items-center mr-2">ショーダウン</div>
            <button
              type="button"
              className="text-break p-1 border rounded-xl cursor-pointer"
              onClick={handleAppendVillain}
            >
              ＋追加
            </button>
          </div>
          {/*--------villainハンド詳細--------*/}
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="w-full">
                  <div>(Villain{index + 1}ポジション)</div>
                  <select
                    className="border w-full pl-2 rounded-xl flex items-center justify-center h-7"
                    {...register(`villains.${index}.villainPos`)}
                  >
                    {positions.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <div>(villain{index + 1}ハンド)</div>
                  {renderVillainCardSlots(index)}
                  <input
                    type="hidden"
                    {...register(`villains.${index}.villainHand`)}
                  />
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="border rounded-xl px-2 py-1 text-xs cursor-pointer"
                    onClick={() => handleRemoveVillain(index)}
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
          <div className="p-2">
            <button
              type="submit"
              className="ring rounded-xl w-full mt-6 mb-2 pt-2 pb-2 min-w-0 bg-green-300 cursor-pointer"
            >
              登録する
            </button>
          </div>
        </div>
      </form>
      {/*--------ハンドセレクトモーダル-------- */}
      {/*---heroHand用--- */}
      {selectedModal === "heroHand" && (
        <HandSelectModal
          onClose={closeModal}
          onAddSelectedCard={handleAddHeroHand}
          disableCards={disableCards}
        />
      )}
      {/*---villainHand用--- */}
      {selectedModal !== null &&
        typeof selectedModal === "object" &&
        selectedModal.type === "villainHand" && (
          <HandSelectModal
            onClose={closeModal}
            onAddSelectedCard={(card) =>
              addVillainCard(selectedModal.index, card)
            }
            disableCards={disableCards}
          />
        )}
      {/*---FlopCard用--- */}
      {selectedModal === "flop" && (
        <HandSelectModal
          onClose={closeModal}
          onAddSelectedCard={handleAddFlopCard}
          disableCards={disableCards}
        />
      )}
      {/*---TurnCard用--- */}
      {selectedModal === "turn" && (
        <HandSelectModal
          onClose={closeModal}
          onAddSelectedCard={handleAddTurnCard}
          disableCards={disableCards}
        />
      )}
      {/*---RiverCard用--- */}
      {selectedModal === "river" && (
        <HandSelectModal
          onClose={closeModal}
          onAddSelectedCard={handleAddRiverCard}
          disableCards={disableCards}
        />
      )}
    </>
  );
};
