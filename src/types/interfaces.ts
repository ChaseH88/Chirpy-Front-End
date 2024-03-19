export interface UserModelInterface {
  id: string;
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  photo: string;
  posts: PostModelInterface[];
  followers: UserModelInterface[];
  following: UserModelInterface[];
  blocked: UserModelInterface[];
  images: ImageModelInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostModelInterface {
  id: string;
  postedBy: UserModelInterface;
  content: string;
  likes: UserModelInterface[];
  dislikes: UserModelInterface[];
  comments: CommentInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentInterface {
  id: string;
  user: UserModelInterface;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageModelInterface {
  id: string;
  fromId: UserModelInterface;
  toId: UserModelInterface;
  type: "PRIVATE" | "GROUP";
  content: string;
  likes: UserModelInterface[];
  dislikes: UserModelInterface[];
  createdAt: string;
  updatedAt: Date;
}

export interface ImageModelInterface {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  deleteUrl: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}
