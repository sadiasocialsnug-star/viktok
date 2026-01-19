
export interface VideoData {
  id: string;
  url: string;
  author: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  aiCaption?: string;
  avatar: string;
}

export interface UserState {
  likedVideos: Set<string>;
  following: Set<string>;
}
