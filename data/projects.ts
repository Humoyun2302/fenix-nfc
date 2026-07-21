export type Project = {
  name: string;
  category: "hospitality" | "business" | "events";
  description: "nova" | "volt" | "artline";
  visual: string;
  mark: string;
};

export const projects: Project[] = [
  { name: "NOVA Hotels", category: "hospitality", description: "nova", visual: "project-orange", mark: "N" },
  { name: "VOLT Team", category: "business", description: "volt", visual: "project-violet", mark: "V" },
  { name: "ARTLINE Forum", category: "events", description: "artline", visual: "project-rose", mark: "A" },
];
