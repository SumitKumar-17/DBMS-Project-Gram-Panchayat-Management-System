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
}
