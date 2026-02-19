import type { HandItem } from "../types/type";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

type Props = {
  hands: HandItem[];
};

export const PosStats = ({ hands }: Props) => {
  const [selectedPosMax, setSelectedPosMax] = useState<"6" | "9" | null>(null);
  const positions9Max: string[] = [
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
  const positions6Max: string[] = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
  return (
    <div>
      <h2 className="text-lg font-bold text-center mt-2 mb-3">
        ポジション別収支
      </h2>
      <div className="flex gap-3 items-center justify-center">
        <button
          className={`border px-2 py-1 ${selectedPosMax === "6" && "bg-gray-300"}`}
          onClick={() => setSelectedPosMax("6")}
        >
          6Max
        </button>
        <button
          className={`border px-2 py-1 ${selectedPosMax === "9" && "bg-gray-300"}`}
          onClick={() => setSelectedPosMax("9")}
        >
          9Max
        </button>
      </div>
      {selectedPosMax === "6" && (
        <div className="mt-3">
          <Table
            sx={{
              "& .MuiTableCell-root": {
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          >
            <TableHead>
              <TableCell>Position</TableCell>
              <TableCell>Hands</TableCell>
              <TableCell>Total BB</TableCell>
              <TableCell>Avg BB</TableCell>
              <TableCell>BB/100</TableCell>
            </TableHead>
            <TableBody>
              {positions6Max.map((p) => {
                return (
                  <TableRow key={p} hover sx={{ cursor: "pointer" }}>
                    <TableCell>{p}</TableCell>
                    <TableCell>150</TableCell>
                    <TableCell>+12</TableCell>
                    <TableCell>+1</TableCell>
                    <TableCell>12</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedPosMax === "9" && (
        <div className="mt-3">
          <Table
            sx={{
              "& .MuiTableCell-root": {
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          >
            <TableHead>
              <TableCell>Position</TableCell>
              <TableCell>Hands</TableCell>
              <TableCell>Total BB</TableCell>
              <TableCell>Avg BB</TableCell>
              <TableCell>BB/100</TableCell>
            </TableHead>
            <TableBody>
              {positions9Max.map((p) => {
                return (
                  <TableRow key={p} hover sx={{ cursor: "pointer" }}>
                    <TableCell>{p}</TableCell>
                    <TableCell>150</TableCell>
                    <TableCell>+12</TableCell>
                    <TableCell>+1</TableCell>
                    <TableCell>12</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
