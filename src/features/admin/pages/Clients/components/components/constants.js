export const FillerIdentity = {
  Mom: "Mom",
  Dad: "Dad",
  Other: "Other",
};

export const RelationShip = {
  Mother: "Mother",
  Father: "Father",
  Sister: "Sister",
  Brother: "Brother",
};

export const ConsultantType = {
  Pediatrician: "Pediatrician",
  RMD: "Rehab Medical Doctor",
  Psychologist: "Psychologist",
  Psychiatrist: "Psychiatrist",
  Other: "Other",
};

export const Role = {
  Admin: "Admin",
  Client: "Client",
  Therapist: "Therapist",
};

export const Gender = {
  Male: "Male",
  Female: "Female",
};

export const Language = {
  Indonesian: "Indonesian",
  English: "English",
  Mandarin: "Mandarin",
  Other: "Other",
};

export const Education = {
  havenot: "haven’t gone to school",
  Preschool: "Pre School",
  Kindergarten: "Kindergarten",
  LowerSchool: "Lower School",
  MiddleSchool: "Middle School",
  HighSchool: "High School",
  Other: "Other",
};

// Helper functions to get arrays of values and keys
export const getEnumValues = (enumObj) => Object.values(enumObj);
export const getEnumKeys = (enumObj) => Object.keys(enumObj);

// Helper function to check if a value is valid for an enum
export const isValidEnumValue = (enumObj, value) =>
  Object.values(enumObj).includes(value);
