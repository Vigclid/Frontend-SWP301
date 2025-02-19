export interface Package {
  typeId: string | number;
  typeRankName: string;
  // packageDescription: string;
  price: number;
}

export interface CurrentPackage {
  currentPackageID: number;
  creatorID: number; // from table creator FK
  packageID: number; // from table package FK
  Date: string | Date; // ISO date
}
