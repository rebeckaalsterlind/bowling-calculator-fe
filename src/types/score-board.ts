export interface Rounds {
  active: boolean;
  firstScore: number | null;
  secondScore: number | null;
  roundScore: number;
  totalScore: number | null;
  id: number;
  spare: boolean;
  strike: boolean;
  double: boolean;
  turkey: boolean;
  fourBagger: boolean;
  played: boolean;
}

export interface Results {
  id: number;
  title: string;
  value: number | null;
}
