export interface Package {
  typeId: string | number;
  typeRankName: string;
  // packageDescription: string;
  price: number;
}

export interface CurrentPackage {
  rankID: number; // fk của rank  (IN DB is RankID)
  accountID: number;
  typeID: number; //fk type of rank(IN DB is TypeofRank)
  dayToRentRankAt: string | Date; // ISO date
}
