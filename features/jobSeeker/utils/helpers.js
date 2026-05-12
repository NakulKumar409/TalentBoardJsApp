// features/jobSeeker/utils/helpers.js

export const INITIAL_FORM_DATA = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  aadhaar: "",
  pan: "",
  uan: "",
  tenthBoard: "",
  tenthPercentage: "",
  tenthYear: "",
  twelfthBoard: "",
  twelfthPercentage: "",
  twelfthYear: "",
  graduationCollege: "",
  graduationDegree: "",
  graduationPercentage: "",
  graduationYear: "",
  postGraduationCollege: "",
  postGraduationDegree: "",
  postGraduationPercentage: "",
  postGraduationYear: "",
  experienceYears: "",
  companyName: "",
  companyRole: "",
  startDate: "",
  endDate: "",
  previousCompany: "",
  previousRole: "",
  skills: "",
  topSkills: "",
  github: "",
  linkedin: "",
  portfolio: "",
  coverLetter: "",
  acceptTerms: false,
  confirmInformation: false,
};

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
export const validateYear = (year) =>
  !year ||
  (parseInt(year) >= 1900 && parseInt(year) <= new Date().getFullYear());
export const validatePercentage = (perc) =>
  !perc || (parseFloat(perc) >= 0 && parseFloat(perc) <= 100);

export const calculateStats = (applications) => ({
  totalApplications: applications.length,
  pending: applications.filter((a) => a.status?.toLowerCase() === "applied")
    .length,
  shortlisted: applications.filter(
    (a) => a.status?.toLowerCase() === "shortlisted"
  ).length,
  hired: applications.filter((a) => a.status?.toLowerCase() === "hired").length,
});

export const filterJobs = (jobs, search) => {
  return jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase())
  );
};

export const validateStep = (step, formData) => {
  const errors = {};

  if (step === 1) {
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(formData.email))
      errors.email = "Enter a valid email address";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone))
      errors.phone = "Enter a valid 10-digit phone number";
    if (!formData.dob) errors.dob = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
  }

  if (step === 2) {
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode))
      errors.pincode = "Enter a valid 6-digit pincode";
    if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar))
      errors.aadhaar = "Enter a valid 12-digit Aadhaar number";
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan))
      errors.pan = "Enter a valid PAN card number";
  }

  if (step === 3) {
    if (!formData.tenthBoard.trim())
      errors.tenthBoard = "10th Board is required";
    if (!formData.tenthPercentage)
      errors.tenthPercentage = "10th Percentage is required";
    else if (!validatePercentage(formData.tenthPercentage))
      errors.tenthPercentage = "Percentage must be between 0-100";
    if (!formData.tenthYear) errors.tenthYear = "10th Year is required";
    else if (!validateYear(formData.tenthYear))
      errors.tenthYear = "Enter a valid year (1900-present)";
  }

  if (step === 4) {
    if (!formData.skills.trim())
      errors.skills = "Skills are required (comma separated)";
  }

  if (step === 5) {
    if (!formData.acceptTerms)
      errors.acceptTerms = "You must accept the terms and conditions";
    if (!formData.confirmInformation)
      errors.confirmInformation = "You must confirm the information";
  }

  return errors;
};

export const buildFormPayload = (formData, userId, jobId) => {
  const payload = new FormData();
  payload.append("userId", userId);
  payload.append("jobId", jobId);

  Object.keys(formData).forEach((key) => {
    if (key === "skills" || key === "topSkills") {
      const arr = formData[key]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      payload.append(key, JSON.stringify(arr));
    } else if (typeof formData[key] === "boolean") {
      payload.append(key, formData[key] ? "true" : "false");
    } else {
      payload.append(key, formData[key] || "");
    }
  });
  payload.append("status", "Applied");
  payload.append("aiScore", "0");

  return payload;
};
