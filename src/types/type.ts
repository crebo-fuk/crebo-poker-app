export type RecordItems = {
  id: string;
  date: string;
  name: string;
  buyIn: number;
  buyOut: number;
  tableSize: 6 | 9;
};

export type FormValues = {
  date: string;
  name: string;
  buyIn: string;
  buyOut: string;
  tableSize: 6 | 9;
};

export type VillainFormValue = {
  villainPos: string;
  villainHand: string;
};

export type HandFormValue = {
  heroPos: string;
  heroHand: string;
  profitBB: number;
  villains: VillainFormValue[];
  memo: string;
  preflop: string;
  flop: string;
  turn: string;
  river: string;
  blindSB: number;
  blindBB: number;
  stack: number;
  result: "WIN" | "LOSE" | "CHOP";
  preflopAction: string;
  flopAction: string;
  turnAction: string;
  riverAction: string;
};

export type HandItem = {
  id: string;
  tournamentId: string;
  heroPos: string;
  heroHand: string;
  profitBB: number;
  villains: VillainFormValue[];
  memo: string;
  preflop: string;
  flop: string;
  turn: string;
  river: string;
  blindSB: number;
  blindBB: number;
  stack: number;
  result: "WIN" | "LOSE" | "CHOP";
  preflopAction: string;
  flopAction: string;
  turnAction: string;
  riverAction: string;
};

export type FxRatesApiResponse = {
  rates: { JPY: number };
};

export type Rank =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

export type Suit = "s" | "h" | "d" | "c";

export type Card = {
  rank: Rank;
  suit: Suit;
};

export type SelectedModal =
  | "heroHand"
  | { type: "villainHand"; index: number }
  | "flop"
  | "turn"
  | "river"
  | null;

export type Target = "heroHand" | "flop" | "turn" | "river";

export type Actions =
  | "preflopAction"
  | "flopAction"
  | "turnAction"
  | "riverAction";
