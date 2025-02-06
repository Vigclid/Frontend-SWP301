
export interface Package {
    packageID: string | number;
    packageName: string;
    packageDescription: string;
    packagePrice: number;
}

export interface CurrentPackage {
    currentPackageID: number;
    creatorID: number; // from table creator FK
    packageID: number; // from table package FK
    Date: string | Date; // ISO date
}

