import type { HandFormValue } from "../types/type";
import { useForm } from "react-hook-form";
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
  const [isHeroHandModal, setIsHeroHandModal] = useState(false);
  const [isVillainHandModal, setIsVillainHandModal] = useState(false);
  const [selectedHeroHand, setSelectedHeroHand] = useState<string[]>([]);
  const [selectedVillainHand, setSelectedVillainHand] = useState<string[]>([]);
  const closeHeroHandModal = () => {
    setIsHeroHandModal(false);
  };
  const closeVillainHandModal = () => {
    setIsVillainHandModal(false);
  };
  const handleAddHeroHand = (card: string) => {
    setSelectedHeroHand((prev) => {
      if (prev.length === 2) return prev;
      const next = [...prev, card];
      if (next.length === 2) setValue("heroHand", next.join(""));
      return next;
    });
  };
  const handleAddVillainHand = (card: string) => {
    setSelectedVillainHand((prev) => {
      if (prev.length === 2) return prev;
      const next = [...prev, card];
      if (next.length === 2) setValue("villainHand", next.join(""));
      return next;
    });
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
                    {...register("blindSB", {
                      valueAsNumber: true,
                      required: "入力してください",
                    })}
                  />
                  {errors.blindSB && (
                    <p className="text-xs text-red-500">
                      {errors.blindSB.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center">BB</div>
                <div>
                  <input
                    className="border rounded-xl w-full p-2 h-7"
                    type="number"
                    placeholder="1200"
                    {...register("blindBB", {
                      valueAsNumber: true,
                      required: "入力してください",
                    })}
                  />
                  {errors.blindBB && (
                    <p className="text-xs text-red-500">
                      {errors.blindBB.message}
                    </p>
                  )}
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
                  {...register("heroPos")}
                >
                  {positions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <div>(Heroハンド)</div>
                <div className="flex items-center justify-center gap-3">
                  <div>
                    {selectedHeroHand.length === 0 && (
                      <button
                        type="button"
                        className="border w-7 h-10 rounded"
                        onClick={() => setIsHeroHandModal(true)}
                      >
                        ＋
                      </button>
                    )}
                    {selectedHeroHand.length >= 1 && (
                      <button
                        type="button"
                        className="border w-7 h-10 rounded bg-gray-200"
                        onClick={() => {
                          setIsHeroHandModal(true);
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
                        onClick={() => setIsHeroHandModal(true)}
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
                        setIsHeroHandModal(true);
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
              </div>
              <input type="hidden" {...register("heroHand")} />
            </div>
          </div>
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
              <p className="text-xs text-red-500">{errors.result.message}</p>
            )}
          </div>
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
                      onClick={() => setIsVillainHandModal(true)}
                    >
                      ＋
                    </button>
                  )}
                  {selectedVillainHand.length >= 1 && (
                    <button
                      type="button"
                      className="border w-7 h-10 rounded bg-gray-200"
                      onClick={() => {
                        setIsVillainHandModal(true);
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
                      onClick={() => setIsVillainHandModal(true)}
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
                      setIsVillainHandModal(true);
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

          <div className="grid grid-cols-3 mt-3 gap-1">
            <div className="w-full">
              <div>(Flop)</div>
              <input
                className="border rounded-xl h-7 pl-2 w-full min-w-0"
                type="text"
                placeholder="KsJsJd"
                {...register("flop", {
                  maxLength: { value: 6, message: "Flopは6文字(3枚)までです" },
                })}
              />
              {errors.flop && (
                <p className="text-sm text-red-500">{errors.flop.message}</p>
              )}
            </div>
            <div className="w-full">
              <div>(Turn)</div>
              <input
                className="border rounded-xl h-7 pl-2 w-full"
                type="text"
                placeholder="3h"
                {...register("turn", {
                  maxLength: { value: 2, message: "Turnは2文字(1枚)までです" },
                })}
              />
              {errors.turn && (
                <p className="text-sm text-red-500">{errors.turn.message}</p>
              )}
            </div>
            <div className="w-full">
              <div>(River)</div>
              <input
                className="border rounded-xl h-7 pl-2 w-full"
                type="text"
                placeholder="9h"
                {...register("river", {
                  maxLength: { value: 2, message: "Riverは2文字(1枚)までです" },
                })}
              />
              {errors.river && (
                <p className="text-sm text-red-500">{errors.river.message}</p>
              )}
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
      {/*-----ハンドセレクトモーダル----- */}
      {/*---heroHand用--- */}
      {isHeroHandModal && (
        <HandSelectModal
          onClose={closeHeroHandModal}
          onAddSelectedHand={handleAddHeroHand}
        />
      )}
      {/*---villainHand用--- */}
      {isVillainHandModal && (
        <HandSelectModal
          onClose={closeVillainHandModal}
          onAddSelectedHand={handleAddVillainHand}
        />
      )}
    </>
  );
};
