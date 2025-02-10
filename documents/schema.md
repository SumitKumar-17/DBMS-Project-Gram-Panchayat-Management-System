# Database Schema Overview

This document provides an overview of the database schema used for managing various aspects related to citizens, agriculture, assets, education, environmental data, and more. The database is built using Prisma ORM with a PostgreSQL database.

## Models and Their Relationships

### 1. **AgricultureData**
The `AgricultureData` model stores information about agricultural activities, including crop type, area in hectares, estimated yield, and soil type.

- **Fields**: 
  - `record_id`: Primary key.
  - `crop_type`: Type of crop.
  - `area_hectares`: Area covered by crop (in hectares).
  - `season`: Season of cultivation.
  - `year`: Year of cultivation.
  - `estimated_yield`: Predicted yield.
  - `soil_type`: Type of soil used.

### 2. **Asset**
The `Asset` model stores asset details such as asset type, acquisition date, and its value.

- **Fields**:
  - `asset_id`: Primary key.
  - `asset_type`: Type of asset (e.g., machinery, land, etc.).
  - `name`: Name of the asset.
  - `acquisition_date`: Date of acquisition.
  - `value`: Value of the asset.
  - `status`: Current status of the asset.
  - `location`: Location where the asset is kept.

### 3. **Certificate**
The `Certificate` model stores information about various certificates issued to citizens.

- **Fields**:
  - `certificate_id`: Primary key.
  - `citizen_id`: Reference to the `Citizen` model.
  - `certificate_type`: Type of certificate (e.g., birth certificate, voter ID).
  - `issue_date`: Date of issue.
  - `valid_until`: Expiry date of the certificate.
  - `status`: Status of the certificate.
  - `issued_by`: Organization or individual that issued the certificate.

### 4. **Citizen**
The `Citizen` model contains personal details of the citizen, such as name, date of birth, contact details, and occupation.

- **Fields**:
  - `citizen_id`: Primary key.
  - `aadhar_no`: Unique Aadhar number for the citizen.
  - `first_name`, `last_name`: Names of the citizen.
  - `dob`: Date of birth.
  - `gender`: Gender of the citizen.
  - `phone`, `email`, `address`: Contact information.
  - `occupation`: Occupation of the citizen.
  - `registration_date`: Date when the citizen was registered.

- **Relationships**:
  - One-to-many relationships with `Education`, `Certificate`, `Household`, `PanchayatMember`, `SchemeBeneficiary`, and `TaxRecord`.

### 5. **Education**
The `Education` model stores the educational qualifications of a citizen.

- **Fields**:
  - `education_id`: Primary key.
  - `citizen_id`: Reference to the `Citizen` model.
  - `degree`: Degree obtained.
  - `institution`: Educational institution.
  - `year_of_passing`: Year of graduation.
  - `specialization`: Specialization in the field (optional).

### 6. **EnvironmentalData**
The `EnvironmentalData` model stores environmental records, including rainfall, groundwater levels, and waste collection status.

- **Fields**:
  - `record_id`: Primary key.
  - `recorded_date`: Date of data recording.
  - `rainfall_mm`: Amount of rainfall in mm.
  - `groundwater_level`: Groundwater level.
  - `waste_collection_status`: Status of waste collection.
  - `trees_planted`: Number of trees planted.

### 7. **Expenditure**
The `Expenditure` model stores details about various expenditures.

- **Fields**:
  - `expenditure_id`: Primary key.
  - `category`: Category of expenditure (e.g., public works, healthcare).
  - `amount`: Expenditure amount.
  - `expense_date`: Date of expense.
  - `purpose`: Purpose of the expenditure.
  - `approved_by`: Person who approved the expenditure.
  - `payment_mode`: Mode of payment.

### 8. **Household**
The `Household` model stores household information, with details about the head of the household and its members.

- **Fields**:
  - `household_id`: Primary key.
  - `head_citizen_id`: Reference to the `Citizen` model for the head of the household.
  - `house_no`: House number.
  - `category`: Household category (e.g., urban, rural).
  - `total_members`: Number of members in the household.
  - `last_census_date`: Date of the last census.

### 9. **Income**
The `Income` model stores information about the income sources of citizens.

- **Fields**:
  - `income_id`: Primary key.
  - `source`: Source of income (e.g., salary, business).
  - `amount`: Amount of income.
  - `receipt_date`: Date of receipt.
  - `financial_year`: The financial year the income is for.
  - `description`: Description of the income.

### 10. **PanchayatMember**
The `PanchayatMember` model stores information about members of the local panchayat.

- **Fields**:
  - `member_id`: Primary key.
  - `citizen_id`: Reference to the `Citizen` model.
  - `role`: Role of the panchayat member.
  - `term_start`: Start date of the term.
  - `term_end`: End date of the term.
  - `status`: Current status.
  - `committee_name`: Name of the committee.

### 11. **SchemeBeneficiary**
The `SchemeBeneficiary` model represents citizens who are beneficiaries of welfare schemes.

- **Fields**:
  - `beneficiary_id`: Primary key.
  - `scheme_id`: Reference to the `WelfareScheme` model.
  - `citizen_id`: Reference to the `Citizen` model.
  - `enrollment_date`: Date of enrollment.
  - `status`: Current status.
  - `benefit_amount`: Amount received.

### 12. **TaxRecord**
The `TaxRecord` model stores tax-related information for citizens.

- **Fields**:
  - `tax_id`: Primary key.
  - `citizen_id`: Reference to the `Citizen` model.
  - `tax_type`: Type of tax (e.g., income tax, property tax).
  - `amount`: Tax amount.
  - `due_date`: Due date for the payment.
  - `paid_date`: Date of payment (optional).
  - `payment_status`: Status of the payment (paid/unpaid).
  - `financial_year`: The financial year the tax pertains to.

### 13. **WelfareScheme**
The `WelfareScheme` model represents various government welfare schemes.

- **Fields**:
  - `scheme_id`: Primary key.
  - `scheme_name`: Name of the scheme.
  - `description`: Description of the scheme.
  - `start_date`: Start date.
  - `end_date`: End date.
  - `budget_allocated`: Budget allocated for the scheme.
  - `status`: Status of the scheme (e.g., active, completed).

---

## Conclusion

This database schema is designed to manage the various aspects of citizen records, government welfare schemes, and environmental data, ensuring efficient tracking and management of resources across different sectors.
