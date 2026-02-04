import type { RecordItems } from "../types/type";
import { useState } from "react";

type Props = {
  record: RecordItems;
  onDelete: (record: RecordItems) => void;
  exchange: (money: number) => string;
  onUpdate: (record: RecordItems) => void;
};

//==============履歴一覧用==============
export const RecordItem = ({ record, onDelete, exchange, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftBuyOut, setDraftBuyOut] = useState<string>("");
  const [draftName, setDraftName] = useState<string>("");

  //===履歴編集用===
  const startEdit = () => {
    setIsEditing(true);
    setDraftBuyOut(String(record.buyOut));
    setDraftName(record.name);
  };

  //===履歴編集キャンセル用===
  const cancelEdit = () => {
    setIsEditing(false);
    setDraftBuyOut(String(record.buyOut));
    setDraftName(record.name);
  };

  //===履歴保存用===
  const saveBuyOut = () => {
    const buyOutNum = Number(draftBuyOut);
    const name = draftName.trim();
    if (Number.isNaN(buyOutNum) || buyOutNum < 0) return;
    if (!name) return;
    onUpdate({ ...record, name: name, buyOut: buyOutNum });
    setIsEditing(false);
  };

  const profit = record.buyOut - record.buyIn;
  const isITM: boolean = record.buyOut > 0;
  return (
    <div className="border rounded-xl mt-2 mr-1 p-2 text-left gap-3 flex w-full">
      {/* ==============トーナメント内容============== */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-3 items-center">
          <p className="text-xs">{record.date}</p>
          {isITM && (
            <p className="rounded text-xs ring ring-black px-1 py-0.5">ITM</p>
          )}
          <p className="text-xs">{record.tableSize}Max</p>
          {isEditing && <div className="text-xs text-blue-600">編集中...</div>}
        </div>
        {!isEditing ? (
          <p className="text-sm">{record.name}</p>
        ) : (
          <input
            className="border pl-1 rounded ml-1 mt-1 w-[30%]"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
        )}
        <div className="flex">
          <div className="text-left text-xs flex">
            <p>Buy-in:</p>
            <p className="pl-1 text-red-500">{exchange(record.buyIn)}</p>
          </div>
          <div className="text-left text-xs flex">
            <p>Buy-out:</p>
            {!isEditing ? (
              <p
                className={`pl-1 ${
                  record.buyOut > 0 ? "text-green-500" : "text-black"
                }`}
              >
                {exchange(record.buyOut)}
              </p>
            ) : (
              <input
                className="border pl-1 rounded ml-1 w-[20%]"
                inputMode="numeric"
                value={draftBuyOut}
                onChange={(e) => setDraftBuyOut(e.target.value)}
                placeholder="0"
              />
            )}
          </div>
          <div className="items-center">
            <div className="text-left text-xs flex">
              <p>収支:</p>
              <p
                className={`pl-1 ${
                  profit > 0
                    ? "text-green-500"
                    : profit < 0
                      ? "text-red-500"
                      : "text-black"
                }`}
              >
                {profit >= 0 ? "+" : ""}
                {exchange(profit)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        {!isEditing ? (
          <button
            type="button"
            className="text-sm border rounded px-2 py-1 cursor-pointer"
            onClick={startEdit}
          >
            編集
          </button>
        ) : (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="text-sm border rounded px-2 py-1 cursor-pointer"
              onClick={saveBuyOut}
            >
              保存
            </button>
            <button
              type="button"
              className="text-sm border rounded px-2 py-1 cursor-pointer"
              onClick={cancelEdit}
            >
              取消
            </button>
          </div>
        )}
      </div>
      {/* ==============削除ボタン============== */}
      <button
        type="button"
        className="text-xl leading-none cursor-pointer"
        onClick={() => onDelete(record)}
        disabled={isEditing} // 誤爆防止（好み）
      >
        ×
      </button>
    </div>
  );
};
