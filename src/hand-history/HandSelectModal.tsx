type Props = {
  onClose: () => void;
};

export const HandSelectModal = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose()} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
        <h2 className="font-bold mb-4">Hand モーダル</h2>
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
