export interface GoogleUser {
  email: string,
  email_verified: boolean
  family_name: string
  given_name: string
  locale: string
  name: string
  picture: string
  sub: GLfloat
} // This is the Object google return for us, having all user infomation in their Gmail account

export interface Account {
  accountId: string;
  userName: String;
  roleID: string;
  password: string;
  email: string;
  status: boolean;
}

export interface Creator {
  userId: number | undefined;
  accountId: number | "0";
  CreatorId: number | "0";
  coins: string | number;
  userName: string | "";
  profilePicture: string | "";
  backgroundPicture: string | "";
  firstName: string | "";
  lastName: string | "";
  address: string | "";
  phoneNumber: string | "0";
  lastLogin: string | undefined;
  CreateAt: string | undefined;
  dateOfBirth: string | undefined;
  allowCommission: boolean | false;
  biography: string | "";
  followCounts: number | 0;
  followerCount: number | 0;
  email: string;
  RankID: number;
  RoleID: number;
  vip: boolean;
  TypeOfRank: string;
  nameOfRank: string;
  amountArtworks: number;
} // This is the Object Creator, having all the infomation.
