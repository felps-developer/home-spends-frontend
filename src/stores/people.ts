import { create } from 'zustand';
import type { Person } from '@/types/person';

/**
 * Store Zustand para gerenciar o estado de pessoas.
 * Equivalente ao Pinia store do projeto Vue.
 */
interface PeopleStore {
  people: Person[];
  currentPerson: Person | null;
  setPeople: (people: Person[]) => void;
  setCurrentPerson: (person: Person | null) => void;
}

export const usePeopleStore = create<PeopleStore>((set) => ({
  people: [],
  currentPerson: null,
  setPeople: (people) => set({ people }),
  setCurrentPerson: (person) => set({ currentPerson: person }),
}));

