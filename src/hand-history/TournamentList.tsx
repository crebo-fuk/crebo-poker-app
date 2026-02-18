import type { RecordItems } from "../types/type";

type Props = {
  tournaments: RecordItems[];
  onSelectTournament: (id: string) => void;
};

export const TournamentList = ({ tournaments, onSelectTournament }: Props) => {
  return (
    <div className="h-[90vh]">
      <div className="text-xl font-bold p-3">トーナメント一覧(選択)</div>
      <div className="h-[65vh] overflow-y-auto overscroll-contain">
        {tournaments.map((tournament: RecordItems) => (
          <button
            className="flex items-center justify-between border rounded-xl p-1 mt-3 w-full cursor-pointer bg-gray-200"
            onClick={() => onSelectTournament(tournament.id)}
            key={tournament.id}
          >
            <div className="text-xs">{tournament.date}</div>
            <div className="text-sm font-semibold">{tournament.name}</div>
            <div className="text-sm">{tournament.tableSize}Max</div>
          </button>
        ))}
      </div>
    </div>
  );
};
