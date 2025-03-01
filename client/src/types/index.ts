export interface User {
  _id: string;
  handle: string;
  walletAddress: string;
  profilePicture: string;
  role: 'user' | 'shiller';
  followers?: string[] | number;
  following?: string[];
  shills?: number;
  points?: number;
  currentStreak?: number;
  token?: string;
}

export interface FollowRequest {
  _id: string;
  requester: User;
  recipient: User | string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Shill {
  _id: string;
  creator: User | string;
  tokenAddress: string;
  reason: string;
  createdAt: string;
  active: boolean;
  status: 'pending' | 'accepted' | 'declined';
  profitCount: number;
  lossCount: number;
}

export interface ShillResult {
  _id: string;
  shill: string;
  user: string;
  result: 'profit' | 'loss';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
