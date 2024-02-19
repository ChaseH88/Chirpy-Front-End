export interface UserModelInterface {
  id: string;
  email: string;
  password: string;
  username: string;
  posts: PostModelInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostModelInterface {
  id: string;
  postedBy: UserModelInterface;
  content: string;
  likes: UserModelInterface[];
  dislikes: UserModelInterface[];
  comments: {
    user: UserModelInterface;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
