export interface ProfileInterface {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
}

export interface UserInterface {
  id: number;
  username: string;
  originalUsername: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
  WonGames: number;
  LostGames: number;
  level: number;
  campus: string;
  recentGames: object[];
  friends: object[];
  blocked: number[];
  is_otp_enabled: boolean;
  is_otp_validated: boolean;
  otp_secret: string;
  is_profile_completed: boolean;
  achievements: string[];
  createdAt: string;
}
