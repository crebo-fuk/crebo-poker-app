type Props = {
  onClose: () => void;
};

export const HandSelectModal = ({ onClose }: Props) => {
  const suit = ["s", "h", "d", "c"];
  const rank = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];
  const cardList = rank.map((r) => suit.map((s) => `${r}${s}`)).flat();
  console.log(cardList);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose()} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
        <h2 className="font-bold mb-4">HandSelect</h2>
        <>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</>
        <button
          type="button"
          className="border rounded px-3 py-1"
          onClick={() => onClose()}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};
