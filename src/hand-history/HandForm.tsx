import type { HandFormValue } from "../types/type";
import { useForm } from "react-hook-form";

type Props = {
  onSubmit: (value: HandFormValue) => void;
  tableSize?: 6 | 9;
};

export const HandForm = ({ onSubmit, tableSize }: Props) => {
  const {
    register,
    handleSubmit,
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
  return (
    <form
      className="p-1 my-3 flex-1 text-xs w-full items-center justify-center"
      onSubmit={handleSubmit(submit)}
    >
      <div className="mb-3">ハンド新規作成フォーム</div>
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
              <input
                className="border w-full p-2 rounded-xl h-7"
                type="text"
                maxLength={4}
                placeholder="AhQh"
                {...register("heroHand", {
                  minLength: {
                    value: 4,
                    message: "ハンドは4文字(2枚)で入力してください",
                  },
                })}
              />
              {errors.heroHand && (
                <p className="text-xs text-red-500">
                  {errors.heroHand.message}
                </p>
              )}
            </div>
          </div>
          <div className="m-2">
            <div className="text-red-500 flex items-center justify-center">
              V S
            </div>
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
              <input
                className="border w-full p-2 rounded-xl flex items-center justify-center h-7"
                type="text"
                maxLength={4}
                placeholder="ThTs"
                {...register("villainHand")}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 mt-3 gap-1">
          <div className="w-full">
            <div>(Flop)</div>
            <input
              className="border rounded-xl h-7 pl-2 w-full"
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
        <button
          type="submit"
          className="ring rounded-xl min-w-full p-2 mt-4 m-2 bg-green-300 cursor-pointer"
        >
          登録する
        </button>
      </div>
    </form>
  );
};
