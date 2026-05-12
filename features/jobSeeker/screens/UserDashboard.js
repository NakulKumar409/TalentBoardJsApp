// features/jobSeeker/screens/UserDashboard.js
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  TextInput,
  ActivityIndicator,
  TouchableOpacity, // ← YEH ADD KARO (missing)
  Text, // ← YEH ADD KARO (missing)
  Alert, // ← YEH ADD KARO (missing)
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { useAuth } from "../../../core/auth/AuthContext";
import { styles } from "../styles/userStyles";
import { calculateStats, filterJobs, buildFormPayload } from "../utils/helpers";
import { useJobs } from "../hooks/useJobs";
import { useApplications } from "../hooks/useApplications";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { StatsGrid } from "../components/StatsGrid";
import { JobCard } from "../components/JobCard";
import { ApplicationCard } from "../components/ApplicationCard";
import { ProfileSection } from "../components/ProfileSection"; // ← SAHI PATH
import { JobDetailsModal } from "../components/JobDetailsModal"; // ← SAHI PATH
import { ApplicationFormModal } from "../components/ApplicationFormModal"; // ← SAHI NAME
import { ViewAppModal } from "../components/ViewAppModal";
import { LogoutModal } from "../components/LogoutModal";

export default function UserDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { jobs, loadJobs } = useJobs();
  const { applications, loadApplications, submitApplication } =
    useApplications();

  const [activeTab, setActiveTab] = useState("jobs");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsModal, setJobDetailsModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [viewAppModal, setViewAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const {
    formData,
    setFormData,
    errors,
    currentStep,
    showDatePicker,
    setShowDatePicker,
    showStartDatePicker, // ← ADD THIS
    setShowStartDatePicker, // ← ADD THIS
    showEndDatePicker, // ← ADD THIS
    setShowEndDatePicker, // ← ADD THIS
    onDateChange,
    validateCurrentStep,
    nextStep,
    prevStep,
    resetForm,
  } = useApplicationForm(user, selectedJob);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadJobs(), loadApplications()]);
    setLoading(false);
  };

  useEffect(() => {
    const checkUserAndLoad = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (!token || !storedUser) {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
        );
      } else {
        await loadAll();
      }
    };
    checkUserAndLoad();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadJobs(), loadApplications()]);
    setRefreshing(false);
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    resetForm();
    setApplyModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!validateCurrentStep()) return;
    setApplying(true);
    try {
      const userStr = await AsyncStorage.getItem("user");
      let userId = null;
      if (userStr) {
        const userData = JSON.parse(userStr);
        userId = userData?._id || userData?.id || userData?.userId;
      }
      if (!userId && user) userId = user?._id || user?.id || user?.userId;
      if (!userId) {
        Alert.alert("Error", "Please login again");
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
        );
        return;
      }

      const payload = buildFormPayload(formData, userId, selectedJob._id);
      const result = await submitApplication(payload);
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
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    setLoading(true);
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await logout();
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
      );
    } catch (error) {
      navigation.replace("Login");
    }
  };

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeApps = Array.isArray(applications) ? applications : [];
  const stats = calculateStats(safeApps);
  const filteredJobs = filterJobs(safeJobs, jobSearch);

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
        {["jobs", "applications", "profile"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.navItem, activeTab === tab && styles.navItemActive]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.navText,
                activeTab === tab && styles.navTextActive,
              ]}>
              {tab === "jobs"
                ? "Jobs"
                : tab === "applications"
                ? "Applied"
                : "Profile"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
          />
        }>
        {activeTab === "applications" && <StatsGrid stats={stats} />}

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

        {activeTab === "jobs" &&
          filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onViewDetails={() => {
                setSelectedJob(job);
                setJobDetailsModal(true);
              }}
              onApply={() => openApplyModal(job)}
            />
          ))}

        {activeTab === "applications" &&
          safeApps.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              onPress={() => {
                setSelectedApp(app);
                setViewAppModal(true);
              }}
            />
          ))}

        {activeTab === "profile" && (
          <ProfileSection
            user={user}
            onLogoutPress={() => setLogoutModalVisible(true)}
          />
        )}
      </ScrollView>

      <JobDetailsModal
        visible={jobDetailsModal}
        job={selectedJob}
        onClose={() => setJobDetailsModal(false)}
        onApply={() => {
          setJobDetailsModal(false);
          openApplyModal(selectedJob);
        }}
      />

      <ApplicationFormModal
        visible={applyModal}
        job={selectedJob}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        currentStep={currentStep}
        onClose={() => setApplyModal(false)}
        onNext={nextStep}
        onPrev={prevStep}
        onSubmit={handleSubmitApplication}
        applying={applying}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        showStartDatePicker={showStartDatePicker}
        setShowStartDatePicker={setShowStartDatePicker}
        showEndDatePicker={showEndDatePicker}
        setShowEndDatePicker={setShowEndDatePicker}
        onDateChange={onDateChange}
      />

      <ViewAppModal
        visible={viewAppModal}
        app={selectedApp}
        onClose={() => setViewAppModal(false)}
      />

      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />
    </View>
  );
}
