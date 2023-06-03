export interface Rounds {
  active: boolean;
  firstScore: number | null;
  secondScore: number | null;
  thirdScore: number | null;
  roundScore: number;
  totalScore: number | null;
  id: number;
  spare: boolean;
  strike: boolean;
  double: boolean;
  turkey: boolean;
  fourBagger: boolean;
  played: boolean;
  tenthFrameFirstStrike: boolean;
  tenthFrameSecondStrike: boolean;
  tenthFrameThirdStrike: boolean;
}

export interface Results {
  id: number;
  title: string;
  value: number | null;
}

export interface Players {
  name: string;
  id: number;
  hdcpFactor: number;
  hdcpScore: number | null;
  maxPossible: number | null;
  game: Rounds[];
}
