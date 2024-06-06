export default interface Post {
    authorName: string;
    comments: string[]; 
    creationDate: string; 
    description: string;
    like: string[]; 
    title: string;
    type: string;
    userId: string;
    _id: string;
    language: string | undefined;
  }