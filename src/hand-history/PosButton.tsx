import type { Actions } from "../types/type";

type Props = {
  positions: string[];
  onAddAction: (targetAction: Actions, targetButton: string) => void;
  onDeleteAction: (targetAction: Actions) => void;
  targetAction: Actions;
};

export const ActButton = ({
  positions,
  onAddAction,
  onDeleteAction,
  targetAction,
}: Props) => {
  const betButtons = ["2.5bb", "3.0bb", "3.5bb", "4.0bb"];
  const actions = ["r", "c", "b", "×", "f"];

  return (
    <div>
      <div className="flex gap-1 mt-1">
        {positions.map((pos) => {
          return (
            <button
              key={pos}
              type="button"
              className="border rounded w-9.5 h-5"
              onClick={() => onAddAction(targetAction, pos)}
            >
              {pos}
            </button>
          );
        })}
      </div>
      <div className="flex gap-1 mt-1">
        {actions.map((action) => {
          return (
            <button
              key={action}
              type="button"
              className="border rounded w-9.5 h-5"
              onClick={() => onAddAction(targetAction, action)}
            >
              {action}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1 mt-1">
          {betButtons.map((bet) => {
            return (
              <button
                key={bet}
                type="button"
                className="border rounded w-9.5 h-5"
                onClick={() => onAddAction(targetAction, bet)}
              >
                {bet}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">
          <button
            type="button"
            className="border rounded w-9.5 h-5"
            onClick={() => onAddAction(targetAction, "\n")}
          >
            改行
          </button>
        </div>
        <div className="flex gap-1 mt-1">
          <button
            type="button"
            className="border rounded w-17 h-5 bg-red-200"
            onClick={() => onDeleteAction(targetAction)}
          >
            一括消去
          </button>
        </div>
      </div>
    </div>
  );
};
