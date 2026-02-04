import type { RecordItems, FormValues } from "../types/type";
import { useForm } from "react-hook-form";

// ==============入力フォーム==============
type Props = { onAdd: (newRecord: RecordItems) => void };

export const RecordForm = ({ onAdd }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      name: "",
      buyIn: "",
      buyOut: "",
      tableSize: undefined,
    },
  });
  const onSubmit = (values: FormValues) => {
    const buyInNum = Number(values.buyIn);
    const buyOutNum = Number(values.buyOut);
    const date = values.date.trim();
    const name = values.name.trim();
    const tableSize = values.tableSize;
    if (!date || !name) return;
    if (Number.isNaN(buyInNum) || Number.isNaN(buyOutNum)) return;

    const newRecord: RecordItems = {
      id: crypto.randomUUID(),
      date: date,
      name: name,
      buyIn: buyInNum,
      buyOut: buyOutNum,
      tableSize: tableSize,
    };
    onAdd(newRecord);
    reset();
  };
  const numTableSize: number[] = [6, 9];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-3">
      <p className="text-left">日付</p>
      <input
        type="date"
        className="text-left border rounded-xl p-1 w-full appearance-none"
        {...register("date", { required: "入力してください" })}
      />
      <p className="text-left mt-1">トーナメント名</p>
      <input
        className="text-left border rounded-xl p-1 w-full"
        {...register("name", { required: "入力してください" })}
      />
      {errors.name && (
        <p className="text-sm text-red-500">{errors.name.message}</p>
      )}
      <p className="text-left mt-1">テーブル人数</p>
      <select
        className="w-full border rounded-xl pl-3 p-1"
        {...register("tableSize", {
          valueAsNumber: true,
          required: "選択してください",
        })}
      >
        <option value="">選択してください</option>
        {numTableSize.map((n) => (
          <option key={n} value={n}>
            {n}人
          </option>
        ))}
      </select>
      {errors.tableSize && (
        <p className="text-sm text-red-500">{errors.tableSize.message}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="text-left">
          <p className="text-left mt-1">Buy-in (USD)</p>
          <input
            type="number"
            className="ring rounded-xl p-1 w-full"
            {...register("buyIn")}
          />
        </div>
        <div className="text-left">
          <p className="mt-1">Buy-out (USD)</p>
          <input
            type="number"
            className="text-left ring rounded-xl p-1 w-full"
            {...register("buyOut")}
          />
        </div>
      </div>
      <button
        type="submit"
        className="ring rounded-xl min-w-full p-1 mt-5 bg-green-300 cursor-pointer"
      >
        登録する
      </button>
    </form>
  );
};
