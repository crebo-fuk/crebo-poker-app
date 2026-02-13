import type { Actions } from "../types/type";

type Props = {
  positions: string[];
  onAddAction: (action: Actions, targetButton: string) => void;
  targetAction: Actions;
};

export const ActButton = ({ positions, onAddAction, targetAction }: Props) => {
  const betButtons = ["2.5bb", "3.0bb", "3.5bb", "4.0bb"];
  const actions = ["r", "c", "b", "×", "f"];

  return (
    <div>
      <div className="flex gap-1">
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
    </div>
  );
};
