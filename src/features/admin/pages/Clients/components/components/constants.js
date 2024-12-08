
export const RelationShip = {
    Mother: 'Mother',
    Father: 'Father',
    Sister: 'Sister',
    Brother: 'Brother',
  };
  
  export const ConsultantType = {
    Psychologist: 'Psychologist',
    Psychiatrist: 'Psychiatrist',
    Therapist: 'Therapist',
    Other: 'Other',
  };
  
  export const Role = {
    Admin: 'Admin',
    Client: 'Client',
    Therapist: 'Therapist',
  };
  
  export const Gender = {
    Male: 'Male',
    Female: 'Female',
  };
  
  export const Language = {
    Indonesian: 'Indonesian',
    English: 'English',
    Mandarin: 'Mandarin',
    Other: 'Other',
  };
  
  export const Education = {
    Preschool: 'Preschool',
    Kindergarten: 'Kindergarten',
    LowerSchool: 'LowerSchool',
    MiddleSchool: 'MiddleSchool',
    HighSchool: 'HighSchool',
    Other: 'Other',
  };
  
  // Helper functions to get arrays of values and keys
  export const getEnumValues = (enumObj) => Object.values(enumObj);
  export const getEnumKeys = (enumObj) => Object.keys(enumObj);
  
  // Helper function to check if a value is valid for an enum
  export const isValidEnumValue = (enumObj, value) => Object.values(enumObj).includes(value);