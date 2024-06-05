export const convertTimestampToMonthYear =(timestamp: string): string =>{
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}
export const defaultUser: UserResponse = {
    aboutMe: "",
    follow: [],
    image: "",
    joinDate: "",
    login: "",
    password: "",
    posts: [],
    roles: [],
    username: "",
    _id: ""
  };