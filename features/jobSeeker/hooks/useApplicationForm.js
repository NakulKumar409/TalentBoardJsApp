// features/jobSeeker/hooks/useApplicationForm.js
import { useState } from "react";
import { validateStep, formatDate, INITIAL_FORM_DATA } from "../utils/helpers";

export const useApplicationForm = (user, selectedJob) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    fullName: user?.name || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const updateFormField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const onDateChange = (event, selectedDate, field) => {
    if (Platform.OS === "android") {
      if (field === "dob") setShowDatePicker(false);
      if (field === "startDate") setShowStartDatePicker(false);
      if (field === "endDate") setShowEndDatePicker(false);
    }
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      updateFormField(field, formattedDate);
    }
  };

  const validateCurrentStep = () => {
    const newErrors = validateStep(currentStep, formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      fullName: user?.name || "",
      email: user?.email || "",
    });
    setErrors({});
    setCurrentStep(1);
  };

  return {
    formData,
    setFormData: updateFormField,
    errors,
    currentStep,
    showDatePicker,
    showStartDatePicker,
    showEndDatePicker,
    setShowDatePicker,
    setShowStartDatePicker,
    setShowEndDatePicker,
    onDateChange,
    validateCurrentStep,
    nextStep,
    prevStep,
    resetForm,
  };
};
