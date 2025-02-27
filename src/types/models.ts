export interface Vaccination {
  vaccination_id: number;
  citizen_id: number;
  vaccine_type: string;
  date_administered: string;
}

export interface LandRecord {
  land_id: number;
  citizen_id: number;
  area_acres: number;
  crop_type: string;
}

export interface WelfareScheme {
  scheme_id: number;
  name: string;
  description: string;
}

export interface SchemeEnrollment {
  enrollment_id: number;
  citizen_id: number;
  scheme_id: number;
  enrollment_date: string;
  welfare_schemes: WelfareScheme;
}

export interface Citizen {
  citizen_id: number;
  name: string;
  gender: string;
  dob: string;
  educational_qualification: string;
  household_id: number;
  email: string;
}

export interface CitizenDetails extends Citizen {
  vaccinations: Vaccination[];
  land_records: LandRecord[];
  scheme_enrollments: SchemeEnrollment[];
}
