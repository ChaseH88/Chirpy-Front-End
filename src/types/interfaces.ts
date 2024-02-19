export interface UserModelInterface {
  email: string;
  password: string;
  username: string;
  posts: PostModelInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostModelInterface {
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
