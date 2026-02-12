import type { HandFormValue, SelectedModal, Target } from "../types/type";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { HandSelectModal } from "./HandSelectModal";

type Props = {
  onSubmit: (value: HandFormValue) => void;
  tableSize?: 6 | 9;
};

export const HandForm = ({ onSubmit, tableSize }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<HandFormValue>({
    defaultValues: {
      heroPos: "",
      heroHand: "",
      villainPos: "",
      villainHand: "",
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
    "",
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
  const positions6Max: string[] = ["", "UTG", "MP", "CO", "BTN", "SB", "BB"];
  const positions = tableSize === 9 ? positions9Max : positions6Max;

  const results = ["WIN", "LOSE", "CHOP"];

  const submit = (value: HandFormValue) => {
    onSubmit(value);
    reset();
  };

  //-----ハンドセレクトのModal作成-----
  const [selectedModal, setSelectedModal] = useState<SelectedModal>(null);
  const [selectedCard, setSelectedCard] = useState<Record<Target, string[]>>({
    heroHand: [],
    villainHand: [],
    flop: [],
    turn: [],
    river: [],
  });
  const maxLength: Record<Target, number> = {
    heroHand: 2,
    villainHand: 2,
    flop: 3,
    turn: 1,
    river: 1,
  };
  const closeModal = () => {
    setSelectedModal(null);
  };

  //-----ハンドセレクト関数・一本化-----
  const addCard = (target: Target, card: string) => {
    setSelectedCard((prev) => {
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
  const handleAddVillainHand = (card: string) => addCard("villainHand", card);
  const handleAddFlopCard = (card: string) => addCard("flop", card);
  const handleAddTurnCard = (card: string) => addCard("turn", card);
  const handleAddRiverCard = (card: string) => addCard("river", card);
  const disableCards = Object.values(selectedCard).flat();

  //-----VillainShowDown-----
  const { fields, append, remove } = useFieldArray({
    name: "villains",
    control,
  });

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
                  className="border w-full p-2 rounded-xl h-7"
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
                <div className="flex items-center justify-center gap-3">
                  <div>
                    {selectedHeroHand.length === 0 && (
                      <button
                        type="button"
                        className="border w-7 h-10 rounded"
                        onClick={() => setSelectedModal("heroHand")}
                      >
                        ＋
                      </button>
                    )}
                    {selectedHeroHand.length >= 1 && (
                      <button
                        type="button"
                        className="border w-7 h-10 rounded bg-gray-200"
                        onClick={() => {
                          setSelectedModal("heroHand");
                          setSelectedHeroHand([]);
                        }}
                      >
                        {selectedHeroHand[0]}
                      </button>
                    )}
                  </div>
                  {selectedHeroHand.length <= 1 && (
                    <div>
                      <button
                        type="button"
                        className="border w-7 h-10 rounded"
                        onClick={() => setSelectedModal("heroHand")}
                      >
                        ＋
                      </button>
                    </div>
                  )}
                  {selectedHeroHand.length === 2 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded bg-gray-200"
                      onClick={() => {
                        setSelectedModal("heroHand");
                        setSelectedHeroHand((prev) => {
                          if (prev.length <= 1) return prev;
                          const next = [prev[0]];
                          return next;
                        });
                      }}
                    >
                      {selectedHeroHand[1]}
                    </button>
                  )}
                </div>
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
                <div className="flex items-center justify-center gap-3">
                  {selectedFlopCard.length === 0 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded"
                      onClick={() => setSelectedModal("flop")}
                    >
                      ＋
                    </button>
                  )}
                  {selectedFlopCard.length >= 1 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded bg-gray-200"
                      onClick={() => {
                        setSelectedModal("flop");
                        setSelectedFlopCard([]);
                      }}
                    >
                      {selectedFlopCard[0]}
                    </button>
                  )}
                  {selectedFlopCard.length <= 1 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded"
                      onClick={() => setSelectedModal("flop")}
                    >
                      ＋
                    </button>
                  )}
                  {selectedFlopCard.length >= 2 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded bg-gray-200"
                      onClick={() => {
                        setSelectedModal("flop");
                        setSelectedFlopCard((prev) => {
                          const next = [prev[0]];
                          return next;
                        });
                      }}
                    >
                      {selectedFlopCard[1]}
                    </button>
                  )}
                  {selectedFlopCard.length <= 2 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded"
                      onClick={() => setSelectedModal("flop")}
                    >
                      ＋
                    </button>
                  )}
                  {selectedFlopCard.length === 3 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded bg-gray-200"
                      onClick={() => {
                        setSelectedModal("flop");
                        setSelectedFlopCard((prev) => {
                          const next = [prev[0], prev[1]];
                          return next;
                        });
                      }}
                    >
                      {selectedFlopCard[2]}
                    </button>
                  )}
                </div>
              </div>
              <input type="hidden" {...register("flop")} />
            </div>
            {/*--------TurnCard選択--------*/}
            <div className="w-full">
              <div>(Turn)</div>
              {selectedTurnCard === "" && (
                <button
                  type="button"
                  className="border w-7 h-10 rounded"
                  onClick={() => setSelectedModal("turn")}
                >
                  ＋
                </button>
              )}
              {selectedTurnCard !== "" && (
                <button
                  type="button"
                  className="border w-7 h-10 rounded bg-gray-200"
                  onClick={() => {
                    setSelectedModal("turn");
                    setSelectedTurnCard("");
                  }}
                >
                  {selectedTurnCard}
                </button>
              )}
              <input type="hidden" {...register("turn")} />
            </div>
            {/*-----RiverCard選択-----*/}
            <div className="w-full">
              <div>(River)</div>
              {selectedRiverCard === "" && (
                <button
                  type="button"
                  className="border w-7 h-10 rounded"
                  onClick={() => setSelectedModal("river")}
                >
                  ＋
                </button>
              )}
              {selectedRiverCard !== "" && (
                <button
                  type="button"
                  className="border w-7 h-10 rounded bg-gray-200"
                  onClick={() => {
                    setSelectedModal("river");
                    setSelectedRiverCard("");
                  }}
                >
                  {selectedRiverCard}
                </button>
              )}
              <input type="hidden" {...register("river")} />
            </div>
          </div>
          <div className="mt-3">
            <div className="">
              <div>Preflop アクション</div>
              <textarea
                className="border rounded-xl p-2 w-full"
                rows={2}
                placeholder="UTG r2.5bb
BTN c"
                {...register("preflopAction")}
              />
            </div>
            <div className="">
              <div>Flop アクション</div>
              <textarea
                className="border rounded-xl p-2 w-full"
                rows={2}
                placeholder="××"
                {...register("flopAction")}
              />
            </div>
            <div className="">
              <div>Turn アクション</div>
              <textarea
                className="border rounded-xl p-2 w-full"
                rows={2}
                placeholder="hero ×/c 
BTN 3bb"
                {...register("turnAction")}
              />
            </div>
            <div className="">
              <div>River アクション</div>
              <textarea
                className="border rounded-xl p-2 w-full"
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
            <button type="button" className="text-break p-1 border rounded-xl">
              ＋追加
            </button>
          </div>
          {/*--------villainハンド詳細--------*/}
          <div className="flex items-center justify-between gap-3">
            <div className="w-full">
              <div>(Villainポジション)</div>
              <select
                className="border w-full p-2 rounded-xl flex items-center justify-center h-7"
                {...register("villainPos")}
              >
                {positions.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <div>(villainハンド)</div>
              <div className="flex items-center justify-center gap-3">
                <div>
                  {selectedVillainHand.length === 0 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded"
                      onClick={() => setSelectedModal("villainHand")}
                    >
                      ＋
                    </button>
                  )}
                  {selectedVillainHand.length >= 1 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded bg-gray-200"
                      onClick={() => {
                        setSelectedModal("villainHand");
                        setSelectedVillainHand([]);
                      }}
                    >
                      {selectedVillainHand[0]}
                    </button>
                  )}
                </div>
                {selectedVillainHand.length <= 1 && (
                  <div>
                    <button
                      type="button"
                      className="border w-7 h-10 rounded"
                      onClick={() => setSelectedModal("villainHand")}
                    >
                      ＋
                    </button>
                  </div>
                )}
                {selectedVillainHand.length === 2 && (
                  <button
                    type="button"
                    className="border w-7 h-10 rounded bg-gray-200"
                    onClick={() => {
                      setSelectedModal("villainHand");
                      setSelectedVillainHand((prev) => {
                        if (prev.length <= 1) return prev;
                        const next = [prev[0]];
                        return next;
                      });
                    }}
                  >
                    {selectedVillainHand[1]}
                  </button>
                )}
              </div>
              <input type="hidden" {...register("villainHand")} />
            </div>
          </div>
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
      {selectedModal === "villainHand" && (
        <HandSelectModal
          onClose={closeModal}
          onAddSelectedCard={handleAddVillainHand}
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
