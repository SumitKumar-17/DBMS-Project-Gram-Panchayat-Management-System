export interface DashboardStats {
  totalCitizens: number;
  genderDistribution: {
    male: number;
    female: number;
  };
  vaccinationStats: {
    totalVaccinations: number;
    vaccineTypes: { [key: string]: number };
  };
  landStats: {
    totalLand: number;
    cropDistribution: { [key: string]: number };
  };
  schemeStats: {
    totalEnrollments: number;
    schemeDistribution: { [key: string]: number };
  };
  householdStats: {
    totalHouseholds: number;
    averageIncome: number;
    incomeDistribution: {
      range: string;
      count: number;
    }[];
  };
  assetStats: {
    totalAssets: number;
    assetDistribution: {
      type: string;
      count: number;
    }[];
    recentInstallations: {
      type: string;
      location: string;
      installationDate: string;
    }[];
  };
}
