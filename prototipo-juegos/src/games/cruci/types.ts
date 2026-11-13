export interface CruciWord { id: number; r: number; c: number; dir: 'H' | 'V'; ans: string; clue: string }
export interface CruciData { size: number; words: CruciWord[] }
