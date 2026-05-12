// app/UserDashboard.js - PROFESSIONAL VERSION WITH DROPDOWN & DATE PICKER
import { CommonActions } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../core/api/apiClient";
import { useAuth } from "../core/auth/AuthContext";

const { width, height } = Dimensions.get("window");

export default function UserDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsModal, setJobDetailsModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [viewAppModal, setViewAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Date Picker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Error States
  const [errors, setErrors] = useState({});

  const [applicationForm, setApplicationForm] = useState({
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
  });

  const loadJobs = async () => {
    try {
      const result = await apiClient.get("/jobs", false);
      if (result.success) {
        let jobsData = [];
        if (Array.isArray(result.data)) {
          jobsData = result.data;
        } else if (result.data?.data && Array.isArray(result.data.data)) {
          jobsData = result.data.data;
        } else {
          jobsData = [];
        }
        setJobs(jobsData);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setJobs([]);
    }
  };

  const loadApplications = async () => {
    try {
      const result = await apiClient.get("/applications/my", true);
      if (result.success) {
        let appsData = [];
        if (Array.isArray(result.data)) {
          appsData = result.data;
        } else if (
          result.data?.applications &&
          Array.isArray(result.data.applications)
        ) {
          appsData = result.data.applications;
        } else if (result.data?.data && Array.isArray(result.data.data)) {
          appsData = result.data.data;
        } else {
          appsData = [];
        }
        setApplications(appsData);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setApplications([]);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadJobs(), loadApplications()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadJobs(), loadApplications()]);
    setRefreshing(false);
  };

  useEffect(() => {
    const checkUserAndLoad = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (!token || !storedUser) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
        return;
      }
      await loadAll();
    };
    checkUserAndLoad();
  }, []);

  // Date Helpers
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onDateChange = (event, selectedDate, field) => {
    if (Platform.OS === "android") {
      if (field === "dob") setShowDatePicker(false);
      if (field === "startDate") setShowStartDatePicker(false);
      if (field === "endDate") setShowEndDatePicker(false);
    }

    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      setApplicationForm({ ...applicationForm, [field]: formattedDate });
      // Clear error for this field
      if (errors[field]) {
        setErrors({ ...errors, [field]: null });
      }
    }
  };

  // Validation Functions
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validateYear = (year) => {
    if (!year) return true;
    const num = parseInt(year);
    return !isNaN(num) && num >= 1900 && num <= new Date().getFullYear();
  };

  const validatePercentage = (perc) => {
    if (!perc) return true;
    const num = parseFloat(perc);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!applicationForm.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      if (!applicationForm.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(applicationForm.email)) {
        newErrors.email = "Enter a valid email address";
      }
      if (!applicationForm.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(applicationForm.phone)) {
        newErrors.phone = "Enter a valid 10-digit phone number";
      }
      if (!applicationForm.dob) {
        newErrors.dob = "Date of birth is required";
      }
      if (!applicationForm.gender) {
        newErrors.gender = "Gender is required";
      }
    }

    if (currentStep === 2) {
      if (!applicationForm.address.trim()) {
        newErrors.address = "Address is required";
      }
      if (!applicationForm.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!applicationForm.country.trim()) {
        newErrors.country = "Country is required";
      }
      if (applicationForm.pincode && !/^\d{6}$/.test(applicationForm.pincode)) {
        newErrors.pincode = "Enter a valid 6-digit pincode";
      }
      if (
        applicationForm.aadhaar &&
        !/^\d{12}$/.test(applicationForm.aadhaar)
      ) {
        newErrors.aadhaar = "Enter a valid 12-digit Aadhaar number";
      }
      if (
        applicationForm.pan &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(applicationForm.pan)
      ) {
        newErrors.pan = "Enter a valid PAN card number";
      }
    }

    if (currentStep === 3) {
      if (!applicationForm.tenthBoard.trim()) {
        newErrors.tenthBoard = "10th Board is required";
      }
      if (!applicationForm.tenthPercentage) {
        newErrors.tenthPercentage = "10th Percentage is required";
      } else if (!validatePercentage(applicationForm.tenthPercentage)) {
        newErrors.tenthPercentage = "Percentage must be between 0-100";
      }
      if (!applicationForm.tenthYear) {
        newErrors.tenthYear = "10th Year is required";
      } else if (!validateYear(applicationForm.tenthYear)) {
        newErrors.tenthYear = "Enter a valid year (1900-present)";
      }
    }

    if (currentStep === 4) {
      if (
        applicationForm.startDate &&
        !applicationForm.startDate.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        newErrors.startDate = "Enter valid start date (YYYY-MM-DD)";
      }
      if (
        applicationForm.endDate &&
        !applicationForm.endDate.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        newErrors.endDate = "Enter valid end date (YYYY-MM-DD)";
      }
      if (!applicationForm.skills.trim()) {
        newErrors.skills = "Skills are required (comma separated)";
      }
    }

    if (currentStep === 5) {
      if (!applicationForm.acceptTerms) {
        newErrors.acceptTerms = "You must accept the terms and conditions";
      }
      if (!applicationForm.confirmInformation) {
        newErrors.confirmInformation = "You must confirm the information";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const viewJobDetails = (job) => {
    setSelectedJob(job);
    setJobDetailsModal(true);
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setApplicationForm({
      fullName: user?.name || "",
      email: user?.email || "",
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
    });
    setErrors({});
    setCurrentStep(1);
    setApplyModal(true);
  };

  const submitApplication = async () => {
    if (!validateStep()) return;

    setApplying(true);
    try {
      const userStr = await AsyncStorage.getItem("user");
      let userId = null;
      if (userStr) {
        const userData = JSON.parse(userStr);
        userId = userData?._id || userData?.id || userData?.userId;
      }
      if (!userId && user) {
        userId = user?._id || user?.id || user?.userId;
      }

      if (!userId) {
        Alert.alert("Error", "Please login again");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
        return;
      }

      const formData = new FormData();

      formData.append("userId", userId);
      formData.append("jobId", selectedJob._id);
      formData.append("fullName", applicationForm.fullName || "");
      formData.append("email", applicationForm.email || "");
      formData.append("phone", applicationForm.phone || "");
      formData.append("dob", applicationForm.dob || "");
      formData.append("gender", applicationForm.gender || "");
      formData.append("address", applicationForm.address || "");
      formData.append("city", applicationForm.city || "");
      formData.append("state", applicationForm.state || "");
      formData.append("country", applicationForm.country || "");
      formData.append("pincode", applicationForm.pincode || "");
      formData.append("aadhaar", applicationForm.aadhaar || "");
      formData.append("pan", applicationForm.pan || "");
      formData.append("uan", applicationForm.uan || "");
      formData.append("tenthBoard", applicationForm.tenthBoard || "");
      formData.append(
        "tenthPercentage",
        applicationForm.tenthPercentage || "0"
      );
      formData.append("tenthYear", applicationForm.tenthYear || "0");
      formData.append("twelfthBoard", applicationForm.twelfthBoard || "");
      formData.append(
        "twelfthPercentage",
        applicationForm.twelfthPercentage || "0"
      );
      formData.append("twelfthYear", applicationForm.twelfthYear || "0");
      formData.append(
        "graduationCollege",
        applicationForm.graduationCollege || ""
      );
      formData.append(
        "graduationDegree",
        applicationForm.graduationDegree || ""
      );
      formData.append(
        "graduationPercentage",
        applicationForm.graduationPercentage || "0"
      );
      formData.append("graduationYear", applicationForm.graduationYear || "0");
      formData.append(
        "postGraduationCollege",
        applicationForm.postGraduationCollege || ""
      );
      formData.append(
        "postGraduationDegree",
        applicationForm.postGraduationDegree || ""
      );
      formData.append(
        "postGraduationPercentage",
        applicationForm.postGraduationPercentage || "0"
      );
      formData.append(
        "postGraduationYear",
        applicationForm.postGraduationYear || "0"
      );
      formData.append("experienceYears", applicationForm.experienceYears || "");
      formData.append("companyName", applicationForm.companyName || "");
      formData.append("companyRole", applicationForm.companyRole || "");
      formData.append("startDate", applicationForm.startDate || "");
      formData.append("endDate", applicationForm.endDate || "");
      formData.append("previousCompany", applicationForm.previousCompany || "");
      formData.append("previousRole", applicationForm.previousRole || "");

      const skillsArray = applicationForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const topSkillsArray = applicationForm.topSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      formData.append("skills", JSON.stringify(skillsArray));
      formData.append("topSkills", JSON.stringify(topSkillsArray));

      formData.append("github", applicationForm.github || "");
      formData.append("linkedin", applicationForm.linkedin || "");
      formData.append("portfolio", applicationForm.portfolio || "");
      formData.append("coverLetter", applicationForm.coverLetter || "");
      formData.append(
        "acceptTerms",
        applicationForm.acceptTerms ? "true" : "false"
      );
      formData.append(
        "confirmInformation",
        applicationForm.confirmInformation ? "true" : "false"
      );
      formData.append("status", "Applied");
      formData.append("aiScore", "0");

      const result = await apiClient.post(
        "/applications/apply",
        formData,
        true,
        true
      );

      if (result.success) {
        Alert.alert("Success", "Application submitted successfully!");
        setApplyModal(false);
        await loadApplications();
      } else {
        Alert.alert(
          "Error",
          result.message || result.error || "Failed to submit"
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleLogoutPress = () => setLogoutModalVisible(true);

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    setLoading(true);
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await logout();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      navigation.replace("Login");
    }
  };

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeApps = Array.isArray(applications) ? applications : [];

  const filteredJobs = safeJobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const stats = {
    totalApplications: safeApps.length,
    pending: safeApps.filter((a) => a.status?.toLowerCase() === "applied")
      .length,
    shortlisted: safeApps.filter(
      (a) => a.status?.toLowerCase() === "shortlisted"
    ).length,
    hired: safeApps.filter((a) => a.status?.toLowerCase() === "hired").length,
  };

  // Render Step 1 - Personal Information with Dropdown & Date Picker
  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Full Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholder="Enter your full name"
          placeholderTextColor="#666"
          value={applicationForm.fullName}
          onChangeText={(t) => {
            setApplicationForm({ ...applicationForm, fullName: t });
            if (errors.fullName) setErrors({ ...errors, fullName: null });
          }}
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
          value={applicationForm.email}
          onChangeText={(t) => {
            setApplicationForm({ ...applicationForm, email: t });
            if (errors.email) setErrors({ ...errors, email: null });
          }}
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
          value={applicationForm.phone}
          onChangeText={(t) => {
            setApplicationForm({ ...applicationForm, phone: t });
            if (errors.phone) setErrors({ ...errors, phone: null });
          }}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>
      // Replace Date Picker section with this:
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Date of Birth <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[styles.datePickerButton, errors.dob && styles.inputError]}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}>
          <Text
            style={
              applicationForm.dob ? styles.dateText : styles.placeholderText
            }>
            {applicationForm.dob || "Select Date of Birth"}
          </Text>
        </TouchableOpacity>
        {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={
            applicationForm.dob
              ? new Date(applicationForm.dob)
              : new Date(2000, 0, 1)
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              const formattedDate = formatDate(date);
              setApplicationForm({ ...applicationForm, dob: formattedDate });
              if (errors.dob) setErrors({ ...errors, dob: null });
            }
          }}
          maximumDate={new Date()}
        />
      )}
     
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Gender <Text style={styles.required}>*</Text>
        </Text>
        <View
          style={[styles.pickerWrapper, errors.gender && styles.inputError]}>
          <Picker
            selectedValue={applicationForm.gender}
            onValueChange={(itemValue) => {
              setApplicationForm({ ...applicationForm, gender: itemValue });
              if (errors.gender) setErrors({ ...errors, gender: null });
            }}
            style={styles.picker}
            dropdownIconColor="#9B8EFF"
            mode="dropdown">
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

  // Similar renderStep2, renderStep3, renderStep4, renderStep5 with error handling...
  // (Keep your existing renderStep functions but add error displays)

  const renderStep = () => {
    if (currentStep === 1) return renderStep1();
    // Add other steps similarly...
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0D1A" />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === "jobs" && styles.navItemActive]}
          onPress={() => setActiveTab("jobs")}>
          <Text
            style={[
              styles.navText,
              activeTab === "jobs" && styles.navTextActive,
            ]}>
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "applications" && styles.navItemActive,
          ]}
          onPress={() => setActiveTab("applications")}>
          <Text
            style={[
              styles.navText,
              activeTab === "applications" && styles.navTextActive,
            ]}>
            Applied
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "profile" && styles.navItemActive,
          ]}
          onPress={() => setActiveTab("profile")}>
          <Text
            style={[
              styles.navText,
              activeTab === "profile" && styles.navTextActive,
            ]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
          />
        }>
        {activeTab === "applications" && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: "#3B82F6" }]}>
                {stats.totalApplications}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
                {stats.pending}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: "#10B981" }]}>
                {stats.shortlisted}
              </Text>
              <Text style={styles.statLabel}>Shortlisted</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: "#8B5CF6" }]}>
                {stats.hired}
              </Text>
              <Text style={styles.statLabel}>Hired</Text>
            </View>
          </View>
        )}

        {activeTab === "jobs" && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Search jobs by title or company..."
              placeholderTextColor="#666"
              value={jobSearch}
              onChangeText={setJobSearch}
            />
          </View>
        )}

        {activeTab === "jobs" && (
          <>
            {filteredJobs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No jobs found</Text>
              </View>
            ) : (
              filteredJobs.map((job) => (
                <View key={job._id} style={styles.jobCard}>
                  <Text style={styles.jobTitle}>
                    {job.title || job.profile}
                  </Text>
                  <Text style={styles.jobCompany}>{job.company}</Text>
                  <View style={styles.tagsRow}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {job.type || "Full Time"}
                      </Text>
                    </View>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {job.location || "Remote"}
                      </Text>
                    </View>
                    {job.salary && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{job.salary}</Text>
                      </View>
                    )}
                  </View>
                  {job.skillsRequired?.length > 0 && (
                    <View style={styles.skillsRow}>
                      {job.skillsRequired.slice(0, 3).map((skill, i) => (
                        <View key={i} style={styles.skillTag}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.detailsBtn}
                      onPress={() => viewJobDetails(job)}>
                      <Text style={styles.detailsBtnText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.applyBtn}
                      onPress={() => openApplyModal(job)}>
                      <Text style={styles.applyBtnText}>Apply Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {activeTab === "applications" && (
          <>
            {safeApps.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No applications yet</Text>
                <Text style={styles.emptyText}>
                  Apply for jobs to see them here
                </Text>
              </View>
            ) : (
              safeApps.map((app) => (
                <TouchableOpacity
                  key={app._id}
                  style={styles.appCard}
                  onPress={() => {
                    setSelectedApp(app);
                    setViewAppModal(true);
                  }}>
                  <Text style={styles.appJobTitle}>
                    {app.jobId?.title || "Unknown Position"}
                  </Text>
                  <Text style={styles.appCompany}>
                    {app.jobId?.company || "Unknown Company"}
                  </Text>
                  <Text style={styles.appDate}>
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </Text>
                  <View style={styles.appStatusRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: "#F59E0B20" },
                      ]}>
                      <Text style={[styles.statusText, { color: "#F59E0B" }]}>
                        {app.status || "Applied"}
                      </Text>
                    </View>
                    <Text style={styles.appScore}>
                      Match: {app.aiScore || 0}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {activeTab === "profile" && (
          <View>
            <View style={styles.profileTop}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {user?.name?.[0] || "U"}
                </Text>
              </View>
              <Text style={styles.profileName}>{user?.name || "User"}</Text>
              <Text style={styles.profileEmail}>
                {user?.email || "user@example.com"}
              </Text>
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>Job Seeker Account</Text>
              </View>
            </View>
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <TouchableOpacity style={styles.menuItem}>
                <View>
                  <Text style={styles.menuTitle}>Personal Information</Text>
                  <Text style={styles.menuDesc}>
                    Update your personal details
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <View>
                  <Text style={styles.menuTitle}>Resume & Documents</Text>
                  <Text style={styles.menuDesc}>
                    Upload and manage your resume
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <View>
                  <Text style={styles.menuTitle}>Notifications</Text>
                  <Text style={styles.menuDesc}>
                    Manage notification preferences
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogoutPress}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={
            applicationForm.dob
              ? new Date(applicationForm.dob)
              : new Date(2000, 0, 1)
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => onDateChange(event, date, "dob")}
          maximumDate={new Date()}
        />
      )}

      {/* Logout Modal */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Confirm Logout</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.cancelConfirmBtn]}
                onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.cancelConfirmText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.logoutConfirmBtn]}
                onPress={confirmLogout}>
                <Text style={styles.logoutConfirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Job Details Modal */}
      <Modal visible={jobDetailsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Job Details</Text>
              <TouchableOpacity onPress={() => setJobDetailsModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {selectedJob && (
                <>
                  <Text style={styles.modalJobTitle}>
                    {selectedJob.title || selectedJob.profile}
                  </Text>
                  <Text style={styles.modalJobCompany}>
                    {selectedJob.company}
                  </Text>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailText}>
                      {selectedJob.location || "Remote"}
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Salary</Text>
                    <Text style={styles.detailText}>
                      {selectedJob.salary || "Negotiable"}
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Job Type</Text>
                    <Text style={styles.detailText}>
                      {selectedJob.type || "Full Time"}
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Experience</Text>
                    <Text style={styles.detailText}>
                      {selectedJob.experienceRequired || "Fresher"}
                    </Text>
                  </View>
                  {selectedJob.skillsRequired?.length > 0 && (
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Skills Required</Text>
                      <View style={styles.skillsRow}>
                        {selectedJob.skillsRequired.map((skill, i) => (
                          <View key={i} style={styles.skillTag}>
                            <Text style={styles.skillText}>{skill}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailText}>
                      {selectedJob.description || "No description provided"}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={() => {
                  setJobDetailsModal(false);
                  openApplyModal(selectedJob);
                }}>
                <Text style={styles.modalApplyBtnText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Apply Modal */}
      <Modal visible={applyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: height * 0.9 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Apply for {selectedJob?.title}
              </Text>
              <TouchableOpacity onPress={() => setApplyModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderStep()}
            </ScrollView>
            <View style={styles.modalFooter}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={styles.prevBtn}
                  onPress={() => setCurrentStep(currentStep - 1)}>
                  <Text style={styles.prevBtnText}>Previous</Text>
                </TouchableOpacity>
              )}
              {currentStep < 5 ? (
                <TouchableOpacity
                  style={styles.nextBtn}
                  onPress={() => {
                    if (validateStep()) setCurrentStep(currentStep + 1);
                  }}>
                  <Text style={styles.nextBtnText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={submitApplication}
                  disabled={applying}>
                  <Text style={styles.submitBtnText}>
                    {applying ? "Submitting..." : "Submit Application"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* View Application Modal */}
      <Modal visible={viewAppModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: height * 0.85 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Application Details</Text>
              <TouchableOpacity onPress={() => setViewAppModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {selectedApp && (
                <>
                  <Text style={styles.appDetailName}>
                    {selectedApp.fullName || selectedApp.name}
                  </Text>
                  <Text style={styles.appDetailEmail}>{selectedApp.email}</Text>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Job Position</Text>
                    <Text style={styles.detailText}>
                      {selectedApp.jobId?.title || "Unknown"}
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: "#F59E0B20",
                          alignSelf: "flex-start",
                        },
                      ]}>
                      <Text style={[styles.statusText, { color: "#F59E0B" }]}>
                        {selectedApp.status || "Applied"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Match Score</Text>
                    <Text style={styles.detailText}>
                      {selectedApp.aiScore || 0}%
                    </Text>
                  </View>
                  {selectedApp.phone && (
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Phone</Text>
                      <Text style={styles.detailText}>{selectedApp.phone}</Text>
                    </View>
                  )}
                  {selectedApp.coverLetter && (
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Cover Letter</Text>
                      <Text style={styles.detailText}>
                        {selectedApp.coverLetter}
                      </Text>
                    </View>
                  )}
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Applied On</Text>
                    <Text style={styles.detailText}>
                      {new Date(selectedApp.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0D1A" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0D1A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  welcomeText: { fontSize: 14, color: "#888" },
  userName: { fontSize: 24, fontWeight: "bold", color: "#fff", marginTop: 4 },
  userEmail: { fontSize: 13, color: "#666", marginTop: 2 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#131629",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E2240",
    alignItems: "center",
  },
  statNumber: { fontSize: 28, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 4 },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#0F1225",
    borderTopWidth: 1,
    borderTopColor: "#1E2240",
    borderBottomWidth: 1,
    borderBottomColor: "#1E2240",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  navItemActive: { backgroundColor: "#7C3AED20" },
  navText: { fontSize: 14, color: "#888", fontWeight: "500" },
  navTextActive: { color: "#7C3AED", fontWeight: "bold" },
  searchContainer: {
    backgroundColor: "#131629",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  searchInput: { paddingVertical: 12, color: "#fff", fontSize: 14 },
  jobCard: {
    backgroundColor: "#131629",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E2240",
    gap: 8,
  },
  jobTitle: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  jobCompany: { fontSize: 13, color: "#888", marginTop: 2 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2E50",
  },
  tagText: { fontSize: 11, color: "#AAA" },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  skillTag: {
    backgroundColor: "#7C3AED20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: { fontSize: 11, color: "#9B8EFF" },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  detailsBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#7C3AED",
    alignItems: "center",
  },
  detailsBtnText: { color: "#7C3AED", fontWeight: "600" },
  applyBtn: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  applyBtnText: { color: "#fff", fontWeight: "600" },
  appCard: {
    backgroundColor: "#131629",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  appJobTitle: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  appCompany: { fontSize: 13, color: "#888", marginTop: 2 },
  appDate: { fontSize: 12, color: "#666", marginTop: 4 },
  appStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  appScore: { fontSize: 12, color: "#7C3AED", fontWeight: "600" },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 16, color: "#888" },
  emptyText: { fontSize: 14, color: "#666", marginTop: 8 },
  profileTop: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 24,
    gap: 8,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A1D35",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2A2E50",
  },
  profileAvatarText: { fontSize: 32, fontWeight: "bold", color: "#9B8EFF" },
  profileName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  profileEmail: { fontSize: 14, color: "#888" },
  profileBadge: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2A2E50",
  },
  profileBadgeText: { fontSize: 14, color: "#9B8EFF" },
  profileSection: { paddingHorizontal: 16, marginTop: 8, marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#131629",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  menuTitle: { fontSize: 15, fontWeight: "600", color: "#fff" },
  menuDesc: { fontSize: 12, color: "#888", marginTop: 2 },
  arrow: { fontSize: 18, color: "#666" },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#131629",
    borderRadius: 24,
    width: width * 0.95,
    maxHeight: height * 0.9,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2240",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  modalClose: { fontSize: 24, color: "#888", fontWeight: "bold" },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#1E2240",
  },
  modalApplyBtn: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalApplyBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalJobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  modalJobCompany: { fontSize: 15, color: "#888", marginBottom: 16 },

  // New Styles for Professional Form
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#DDD", marginBottom: 8 },
  required: { color: "#EF4444" },
  input: {
    backgroundColor: "#1E2240",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2A2E50",
  },
  inputError: { borderColor: "#EF4444", borderWidth: 1 },
  errorText: { fontSize: 12, color: "#EF4444", marginTop: 4 },
  datePickerButton: {
    backgroundColor: "#1E2240",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2A2E50",
  },
  dateText: { color: "#fff", fontSize: 14 },
  placeholderText: { color: "#666", fontSize: 14 },
  pickerContainer: {
    backgroundColor: "#1E2240",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2E50",
    overflow: "hidden",
  },
  picker: { color: "#fff", height: 50 },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7C3AED",
    marginBottom: 20,
    marginTop: 8,
  },
  subStepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9B8EFF",
    marginTop: 16,
    marginBottom: 12,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  prevBtn: {
    flex: 1,
    backgroundColor: "#1E2240",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  prevBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  nextBtn: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  submitBtn: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  detailBox: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2240",
  },
  detailLabel: {
    fontSize: 12,
    color: "#7C3AED",
    marginBottom: 4,
    fontWeight: "600",
  },
  detailText: { fontSize: 14, color: "#DDD" },
  appDetailName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  appDetailEmail: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#7C3AED",
    backgroundColor: "transparent",
  },
  checkboxChecked: { backgroundColor: "#7C3AED" },
  checkboxLabel: { fontSize: 13, color: "#DDD", flex: 1 },
  confirmModal: {
    backgroundColor: "#131629",
    borderRadius: 20,
    padding: 24,
    width: width - 60,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  confirmText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
    textAlign: "center",
  },
  confirmButtons: { flexDirection: "row", gap: 12 },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelConfirmBtn: { backgroundColor: "#1E2240" },
  logoutConfirmBtn: { backgroundColor: "#EF4444" },
  cancelConfirmText: { color: "#888", fontWeight: "600" },
  logoutConfirmText: { color: "#fff", fontWeight: "600" },
});
