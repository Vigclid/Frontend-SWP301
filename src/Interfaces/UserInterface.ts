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
  accountId:string,
  roleID:string,
  password:string,
  email:string,
  status:boolean
}

export interface Creator {
  accountId: string | "0",
  CreatorId: string | "0",
  coins: string | number,
  userName: string | "",
  profilePicture: string | "",
  backgroundPicture: string | "",
  firstName: string | "",
  lastName: string | "",
  address: string | "",
  phone: string | "0",
  lastLogDate: string | undefined,
  CreateAt: string | undefined,
  DateOfBirth :string | undefined,
  allowCommission: boolean | false,
  biography: string | "",
  followCounts: number | 0,
  followerCount: number | 0,
  email:string,
  RankID:number,
  RoleID: number
} // This is the Object Creator, having all the infomation.
