// features/jobSeeker/components/ApplicationFormModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../styles/userStyles";

// Only import DateTimePickerModal for mobile (not for web)
let DateTimePickerModal = null;
if (Platform.OS !== "web") {
  DateTimePickerModal = require("react-native-modal-datetime-picker").default;
}

// Helper function to format date
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ========== DATE PICKER INPUT (Works on Web + Mobile) ==========
const DatePickerInput = ({ label, value, onSelect, error, required }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  // FOR WEB
  if (Platform.OS === "web") {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onSelect(e.target.value)}
          style={{
            backgroundColor: "#1E2240",
            borderRadius: 12,
            padding: 14,
            color: "#fff",
            fontSize: 14,
            borderWidth: 1,
            borderColor: error ? "#EF4444" : "#2A2E50",
            width: "100%",
            outline: "none",
          }}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // FOR MOBILE
  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (selectedDate) => {
    if (selectedDate) {
      onSelect(formatDate(selectedDate));
    }
    hidePicker();
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.datePickerButton, error && styles.inputError]}
        onPress={showPicker}
        activeOpacity={0.7}>
        <Text style={value ? styles.dateText : styles.placeholderText}>
          {value || `Select ${label}`}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {DateTimePickerModal && (
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hidePicker}
          date={value ? new Date(value) : new Date(2000, 0, 1)}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

// ========== STEP 1: Personal Information ==========
const Step1 = ({ formData, setFormData, errors }) => (
  <>
    <Text style={styles.stepTitle}>📋 Step 1/5: Personal Information</Text>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Full Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.fullName && styles.inputError]}
        placeholder="Enter your full name"
        placeholderTextColor="#666"
        value={formData.fullName}
        onChangeText={(t) => setFormData("fullName", t)}
      />
      {errors.fullName && (
        <Text style={styles.errorText}>{errors.fullName}</Text>
      )}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Email Address <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="you@example.com"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(t) => setFormData("email", t)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Phone Number <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.phone && styles.inputError]}
        placeholder="10-digit mobile number"
        placeholderTextColor="#666"
        keyboardType="phone-pad"
        maxLength={10}
        value={formData.phone}
        onChangeText={(t) => setFormData("phone", t)}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
    </View>

    <DatePickerInput
      label="Date of Birth"
      value={formData.dob}
      onSelect={(date) => setFormData("dob", date)}
      error={errors.dob}
      required={true}
    />

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Gender <Text style={styles.required}>*</Text>
      </Text>
      <View
        style={[styles.pickerContainer, errors.gender && styles.inputError]}>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(v) => setFormData("gender", v)}
          style={styles.picker}
          dropdownIconColor="#9B8EFF">
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>
      {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
    </View>
  </>
);

// ========== STEP 2: Address & ID Proof ==========
const Step2 = ({ formData, setFormData, errors }) => (
  <>
    <Text style={styles.stepTitle}>📍 Step 2/5: Address & ID Proof</Text>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Address <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          errors.address && styles.inputError,
        ]}
        placeholder="Enter your address"
        placeholderTextColor="#666"
        multiline
        numberOfLines={2}
        value={formData.address}
        onChangeText={(t) => setFormData("address", t)}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        City <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.city && styles.inputError]}
        placeholder="City"
        placeholderTextColor="#666"
        value={formData.city}
        onChangeText={(t) => setFormData("city", t)}
      />
      {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>State</Text>
      <TextInput
        style={styles.input}
        placeholder="State"
        placeholderTextColor="#666"
        value={formData.state}
        onChangeText={(t) => setFormData("state", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Country <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.country && styles.inputError]}
        placeholder="Country"
        placeholderTextColor="#666"
        value={formData.country}
        onChangeText={(t) => setFormData("country", t)}
      />
      {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Pincode</Text>
      <TextInput
        style={[styles.input, errors.pincode && styles.inputError]}
        placeholder="6-digit pincode"
        placeholderTextColor="#666"
        keyboardType="numeric"
        maxLength={6}
        value={formData.pincode}
        onChangeText={(t) => setFormData("pincode", t)}
      />
      {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Aadhaar Number</Text>
      <TextInput
        style={[styles.input, errors.aadhaar && styles.inputError]}
        placeholder="12-digit Aadhaar number"
        placeholderTextColor="#666"
        keyboardType="numeric"
        maxLength={12}
        value={formData.aadhaar}
        onChangeText={(t) => setFormData("aadhaar", t)}
      />
      {errors.aadhaar && <Text style={styles.errorText}>{errors.aadhaar}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>PAN Number</Text>
      <TextInput
        style={[styles.input, errors.pan && styles.inputError]}
        placeholder="PAN card number"
        placeholderTextColor="#666"
        autoCapitalize="characters"
        value={formData.pan}
        onChangeText={(t) => setFormData("pan", t)}
      />
      {errors.pan && <Text style={styles.errorText}>{errors.pan}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>UAN (EPFO)</Text>
      <TextInput
        style={styles.input}
        placeholder="UAN number"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.uan}
        onChangeText={(t) => setFormData("uan", t)}
      />
    </View>
  </>
);

// ========== STEP 3: Education Details ==========
const Step3 = ({ formData, setFormData, errors }) => (
  <>
    <Text style={styles.stepTitle}>🎓 Step 3/5: Education Details</Text>

    <Text style={styles.subStepTitle}>10th / SSC</Text>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Board <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.tenthBoard && styles.inputError]}
        placeholder="Board name"
        placeholderTextColor="#666"
        value={formData.tenthBoard}
        onChangeText={(t) => setFormData("tenthBoard", t)}
      />
      {errors.tenthBoard && (
        <Text style={styles.errorText}>{errors.tenthBoard}</Text>
      )}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Percentage <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.tenthPercentage && styles.inputError]}
        placeholder="Percentage (0-100)"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.tenthPercentage}
        onChangeText={(t) => setFormData("tenthPercentage", t)}
      />
      {errors.tenthPercentage && (
        <Text style={styles.errorText}>{errors.tenthPercentage}</Text>
      )}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Year of Passing <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.tenthYear && styles.inputError]}
        placeholder="Year (e.g., 2015)"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.tenthYear}
        onChangeText={(t) => setFormData("tenthYear", t)}
      />
      {errors.tenthYear && (
        <Text style={styles.errorText}>{errors.tenthYear}</Text>
      )}
    </View>

    <Text style={styles.subStepTitle}>12th / HSC</Text>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Board</Text>
      <TextInput
        style={styles.input}
        placeholder="Board name"
        placeholderTextColor="#666"
        value={formData.twelfthBoard}
        onChangeText={(t) => setFormData("twelfthBoard", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Percentage</Text>
      <TextInput
        style={styles.input}
        placeholder="Percentage (0-100)"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.twelfthPercentage}
        onChangeText={(t) => setFormData("twelfthPercentage", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Year of Passing</Text>
      <TextInput
        style={styles.input}
        placeholder="Year (e.g., 2017)"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.twelfthYear}
        onChangeText={(t) => setFormData("twelfthYear", t)}
      />
    </View>

    <Text style={styles.subStepTitle}>Graduation</Text>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>College Name</Text>
      <TextInput
        style={styles.input}
        placeholder="College/University name"
        placeholderTextColor="#666"
        value={formData.graduationCollege}
        onChangeText={(t) => setFormData("graduationCollege", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Degree</Text>
      <TextInput
        style={styles.input}
        placeholder="Degree (e.g., B.Tech, B.Sc)"
        placeholderTextColor="#666"
        value={formData.graduationDegree}
        onChangeText={(t) => setFormData("graduationDegree", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Percentage/CGPA</Text>
      <TextInput
        style={styles.input}
        placeholder="Percentage or CGPA"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.graduationPercentage}
        onChangeText={(t) => setFormData("graduationPercentage", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Year of Passing</Text>
      <TextInput
        style={styles.input}
        placeholder="Year (e.g., 2021)"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.graduationYear}
        onChangeText={(t) => setFormData("graduationYear", t)}
      />
    </View>

    <Text style={styles.subStepTitle}>Post Graduation (Optional)</Text>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>College Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Post graduation college"
        placeholderTextColor="#666"
        value={formData.postGraduationCollege}
        onChangeText={(t) => setFormData("postGraduationCollege", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Degree</Text>
      <TextInput
        style={styles.input}
        placeholder="Degree (e.g., M.Tech, MBA)"
        placeholderTextColor="#666"
        value={formData.postGraduationDegree}
        onChangeText={(t) => setFormData("postGraduationDegree", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Percentage/CGPA</Text>
      <TextInput
        style={styles.input}
        placeholder="Percentage or CGPA"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.postGraduationPercentage}
        onChangeText={(t) => setFormData("postGraduationPercentage", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Year of Passing</Text>
      <TextInput
        style={styles.input}
        placeholder="Year"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.postGraduationYear}
        onChangeText={(t) => setFormData("postGraduationYear", t)}
      />
    </View>
  </>
);

// ========== STEP 4: Experience & Skills ==========
const Step4 = ({ formData, setFormData, errors }) => (
  <>
    <Text style={styles.stepTitle}>💼 Step 4/5: Experience & Skills</Text>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Total Experience (Years)</Text>
      <TextInput
        style={styles.input}
        placeholder="Years of experience"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.experienceYears}
        onChangeText={(t) => setFormData("experienceYears", t)}
      />
    </View>

    <Text style={styles.subStepTitle}>Current Employment</Text>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Current company name"
        placeholderTextColor="#666"
        value={formData.companyName}
        onChangeText={(t) => setFormData("companyName", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Role / Designation</Text>
      <TextInput
        style={styles.input}
        placeholder="Your role"
        placeholderTextColor="#666"
        value={formData.companyRole}
        onChangeText={(t) => setFormData("companyRole", t)}
      />
    </View>

    <DatePickerInput
      label="Start Date"
      value={formData.startDate}
      onSelect={(date) => setFormData("startDate", date)}
      error={null}
      required={false}
    />

    <DatePickerInput
      label="End Date"
      value={formData.endDate}
      onSelect={(date) => setFormData("endDate", date)}
      error={null}
      required={false}
    />

    <Text style={styles.subStepTitle}>Previous Employment</Text>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Previous Company</Text>
      <TextInput
        style={styles.input}
        placeholder="Previous company name"
        placeholderTextColor="#666"
        value={formData.previousCompany}
        onChangeText={(t) => setFormData("previousCompany", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Previous Role</Text>
      <TextInput
        style={styles.input}
        placeholder="Previous role"
        placeholderTextColor="#666"
        value={formData.previousRole}
        onChangeText={(t) => setFormData("previousRole", t)}
      />
    </View>

    <Text style={styles.subStepTitle}>Skills</Text>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Skills <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          errors.skills && styles.inputError,
        ]}
        placeholder="Comma separated skills (e.g., React, Node.js, Python)"
        placeholderTextColor="#666"
        multiline
        numberOfLines={3}
        value={formData.skills}
        onChangeText={(t) => setFormData("skills", t)}
      />
      {errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Top Skills</Text>
      <TextInput
        style={styles.input}
        placeholder="Your strongest skills (comma separated)"
        placeholderTextColor="#666"
        value={formData.topSkills}
        onChangeText={(t) => setFormData("topSkills", t)}
      />
    </View>

    <Text style={styles.subStepTitle}>Social & Portfolio</Text>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>GitHub Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="https://github.com/username"
        placeholderTextColor="#666"
        autoCapitalize="none"
        value={formData.github}
        onChangeText={(t) => setFormData("github", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>LinkedIn Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="https://linkedin.com/in/username"
        placeholderTextColor="#666"
        autoCapitalize="none"
        value={formData.linkedin}
        onChangeText={(t) => setFormData("linkedin", t)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Portfolio Website</Text>
      <TextInput
        style={styles.input}
        placeholder="https://yourportfolio.com"
        placeholderTextColor="#666"
        autoCapitalize="none"
        value={formData.portfolio}
        onChangeText={(t) => setFormData("portfolio", t)}
      />
    </View>
  </>
);

// ========== STEP 5: Cover Letter & Declaration ==========
const Step5 = ({ formData, setFormData, errors }) => {
  return (
    <>
      <Text style={styles.stepTitle}>
        📝 Step 5/5: Cover Letter & Declaration
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cover Letter</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Why should we hire you? Tell us about yourself..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={5}
          value={formData.coverLetter}
          onChangeText={(text) => setFormData("coverLetter", text)}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.checkboxWrapper}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setFormData("acceptTerms", !formData.acceptTerms)}
          activeOpacity={0.7}>
          <View
            style={[
              styles.checkbox,
              formData.acceptTerms && styles.checkboxChecked,
            ]}>
            {formData.acceptTerms && (
              <Text style={styles.checkboxInner}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxText}>
            I accept the{" "}
            <Text style={styles.linkText}>terms and conditions</Text>{" "}
            <Text style={styles.required}>*</Text>
          </Text>
        </TouchableOpacity>
        {errors.acceptTerms && (
          <Text style={styles.errorText}>{errors.acceptTerms}</Text>
        )}
      </View>

      <View style={styles.checkboxWrapper}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() =>
            setFormData("confirmInformation", !formData.confirmInformation)
          }
          activeOpacity={0.7}>
          <View
            style={[
              styles.checkbox,
              formData.confirmInformation && styles.checkboxChecked,
            ]}>
            {formData.confirmInformation && (
              <Text style={styles.checkboxInner}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxText}>
            I confirm that all information provided is accurate{" "}
            <Text style={styles.required}>*</Text>
          </Text>
        </TouchableOpacity>
        {errors.confirmInformation && (
          <Text style={styles.errorText}>{errors.confirmInformation}</Text>
        )}
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Please check both boxes before submitting your application.
        </Text>
      </View>
    </>
  );
};

// ========== MAIN MODAL COMPONENT ==========
export const ApplicationFormModal = ({
  visible,
  job,
  formData,
  setFormData,
  errors,
  currentStep,
  onClose,
  onNext,
  onPrev,
  onSubmit,
  applying,
}) => {
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <Step4
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: "90%" }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply for {job?.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            {[1, 2, 3, 4, 5].map((step) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  currentStep === step && styles.progressDotActive,
                  currentStep > step && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {renderStep()}
          </ScrollView>

          <View style={styles.modalFooter}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.prevBtn} onPress={onPrev}>
                <Text style={styles.prevBtnText}>← Previous</Text>
              </TouchableOpacity>
            )}

            {currentStep < 5 ? (
              <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
                <Text style={styles.nextBtnText}>Next →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!formData.acceptTerms || !formData.confirmInformation) &&
                    styles.disabledBtn,
                ]}
                onPress={onSubmit}
                disabled={
                  applying ||
                  !formData.acceptTerms ||
                  !formData.confirmInformation
                }>
                <Text style={styles.submitBtnText}>
                  {applying ? "Submitting..." : "✓ Submit Application"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
