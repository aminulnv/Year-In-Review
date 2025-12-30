// Leaders and Heads of Department for Year in Review feedback
// This list should include all Leads and Heads of Department

import { teammates } from "./teammates";

export type Leader = {
  id: string;
  name: string;
  sprite: string;
  role?: string; // Optional role/title
};

// HOD and Leads for Yearly Feedback
export const leaders: Leader[] = [
  { id: "sheikh-mohammed-fahim", name: "Fahim", sprite: "https://i.postimg.cc/T3XgTCfW/Fahim.png", role: "HOD" },
  { id: "tashfeen-sara", name: "Tashfeen", sprite: "https://i.postimg.cc/5t47p87D/Tashfeen.png", role: "Lead" },
  { id: "mehedi-hasan-aunim", name: "Aunim", sprite: "https://i.postimg.cc/BbrDLCFk/Aunim.png", role: "Lead" },
  { id: "api-singha", name: "Abhi", sprite: "https://i.postimg.cc/7hG0ZR5S/Abhi.png", role: "Lead" },
  { id: "hm-saif-noor", name: "Saif", sprite: "https://i.postimg.cc/HWRNHcn7/Saif.png", role: "Lead" },
];

