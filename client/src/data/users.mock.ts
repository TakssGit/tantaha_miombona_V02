import type {
  User
} from "../types/user";

export const usersMock: User[] = [
  {
    id: "1",
    username: "admin",
    fullName:
      "Administrateur principal",
    role: "ADMIN",
    active: true
  },
  {
    id: "2",
    username:
      "gestionnaire",
    fullName:
      "Responsable gestion",
    role:
      "GESTIONNAIRE",
    active: true
  },
  {
    id: "3",
    username: "qualite",
    fullName:
      "Agent qualité",
    role: "QUALITE",
    active: true
  },
  {
    id: "4",
    username:
      "production",
    fullName:
      "Responsable production",
    role: "PRODUCTION",
    active: true
  },
  {
    id: "5",
    username:
      "commercial",
    fullName:
      "Responsable commercial",
    role: "COMMERCIAL",
    active: true
  }
];
