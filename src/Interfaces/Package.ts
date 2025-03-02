export interface Package {
  typeId: string | number;
  typeRankName: string;
  // packageDescription: string;
  price: number;
}

export interface CurrentPackage {
  rankID: number; // fk của user (IN DB is RankID)
  accountID: number;
  dayToRentRankAt: string | Date; // ISO date
  typeID: number;  //fk currentPackageID(IN DB is TypeofRank)

}
