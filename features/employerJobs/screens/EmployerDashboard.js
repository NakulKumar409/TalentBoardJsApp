// features/employerJobs/screens/EmployerDashboard.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../core/auth/AuthContext";
import { CommonActions } from "@react-navigation/native";
import { styles } from "../styles/employerStyles";
import {
  getStatusColor,
  getStatusLabel,
  calculateStats,
  filterJobs,
  filterApplications,
  getJobTitle,
  resetFormData,
} from "../utils/helpers";
import { useEmployerJobs } from "../hooks/useEmployerJobs";
import { useEmployerApplications } from "../hooks/useEmployerApplications";
import { StatsGrid } from "../components/StatsGrid";
import { JobCard } from "../components/JobCard";
import { ApplicantCard } from "../components/ApplicantCard";
import { JobFormModal } from "../components/JobFormModal";
import { ViewAppModal } from "../components/ViewAppModal";
import { LogoutModal } from "../components/LogoutModal";

export default function EmployerDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { jobs, loadJobs, createJob, updateJob, deleteJob } = useEmployerJobs();
  const { applications, loadApplications, updateStatus } =
    useEmployerApplications();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewAppModal, setViewAppModal] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [appFilter, setAppFilter] = useState("All");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [formData, setFormData] = useState(resetFormData());

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadJobs(), loadApplications()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadJobs(), loadApplications()]);
    setRefreshing(false);
  };

  const handleCreateJob = async () => {
    if (!formData.title || !formData.profile || !formData.company) {
      Alert.alert("Error", "Please fill Title, Profile and Company");
      return;
    }
    const payload = {
      title: formData.title,
      profile: formData.profile,
      company: formData.company,
      location: formData.location,
      salary: formData.salary,
      type: formData.type,
      skillsRequired: formData.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experienceRequired: formData.experienceRequired,
      description: formData.description,
    };
    const result = await createJob(payload);
    if (result.success) {
      Alert.alert("Success", "Job created!");
      setModalVisible(false);
      setFormData(resetFormData());
    } else Alert.alert("Error", result.error);
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;
    const payload = {
      title: formData.title,
      profile: formData.profile,
      company: formData.company,
      location: formData.location,
      salary: formData.salary,
      type: formData.type,
      skillsRequired: formData.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experienceRequired: formData.experienceRequired,
      description: formData.description,
    };
    const result = await updateJob(selectedJob._id, payload);
    if (result.success) {
      Alert.alert("Success", "Job updated!");
      setModalVisible(false);
      setIsEditing(false);
      setSelectedJob(null);
      setFormData(resetFormData());
    } else Alert.alert("Error", result.error);
  };

  const handleDeleteJob = (jobId) => {
    Alert.alert("Confirm", "Delete this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const result = await deleteJob(jobId);
          Alert.alert(
            result.success ? "Success" : "Error",
            result.success ? "Job deleted!" : result.error
          );
        },
      },
    ]);
  };

  const handleStatusUpdate = async (appId, status) => {
    const result = await updateStatus(appId, status);
    Alert.alert(
      result.success ? "Success" : "Error",
      result.success ? `Application ${status}` : result.error
    );
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setIsEditing(true);
    setFormData({
      title: job.title || "",
      profile: job.profile || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      type: job.type || "Full Time",
      skillsRequired: (job.skillsRequired || []).join(", "),
      experienceRequired: job.experienceRequired || "",
      description: job.description || "",
    });
    setModalVisible(true);
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
  const stats = calculateStats(safeJobs, safeApps);
  const filteredJobs = filterJobs(safeJobs, jobSearch);
  const filteredApps = filterApplications(safeApps, appSearch, appFilter);

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
          <Text style={styles.userName}>{user?.name || "Employer"}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
          />
        }>
        <StatsGrid stats={stats} />

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => {
            setIsEditing(false);
            setSelectedJob(null);
            setFormData(resetFormData());
            setModalVisible(true);
          }}>
          <Text style={styles.createBtnText}>Post New Job</Text>
        </TouchableOpacity>

        <View style={styles.bottomNav}>
          {["dashboard", "jobs", "alljobs", "applicants", "profile"].map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.navItem,
                  activeTab === tab && styles.navItemActive,
                ]}
                onPress={() => setActiveTab(tab)}>
                <Text
                  style={[
                    styles.navText,
                    activeTab === tab && styles.navTextActive,
                  ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {(activeTab === "jobs" || activeTab === "alljobs") && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs..."
              placeholderTextColor="#666"
              value={jobSearch}
              onChangeText={setJobSearch}
            />
          </View>
        )}

        {activeTab === "applicants" && (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search applicants..."
                placeholderTextColor="#666"
                value={appSearch}
                onChangeText={setAppSearch}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}>
              {[
                "All",
                "Applied",
                "Reviewed",
                "Shortlisted",
                "Rejected",
                "Hired",
              ].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterBtn,
                    appFilter === f && styles.filterBtnActive,
                  ]}
                  onPress={() => setAppFilter(f)}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      appFilter === f && styles.filterBtnTextActive,
                    ]}>
                    {f} (
                    {f === "All"
                      ? safeApps.length
                      : safeApps.filter((a) => a.status === f).length}
                    )
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {activeTab === "dashboard" && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Jobs</Text>
              <TouchableOpacity onPress={() => setActiveTab("jobs")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {safeJobs.slice(0, 3).map((job) => (
              <JobCard key={job._id} job={job} showActions={false} />
            ))}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Applications</Text>
              <TouchableOpacity onPress={() => setActiveTab("applicants")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {safeApps.slice(0, 3).map((app) => (
              <ApplicantCard
                key={app._id}
                app={app}
                jobTitle={getJobTitle(safeJobs, app.jobId)}
                onViewDetails={() => {
                  setSelectedApp(app);
                  setViewAppModal(true);
                }}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </>
        )}

        {(activeTab === "jobs" || activeTab === "alljobs") &&
          filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              showActions={activeTab === "jobs"}
              onEdit={() => openEditModal(job)}
              onDelete={() => handleDeleteJob(job._id)}
            />
          ))}

        {activeTab === "applicants" &&
          filteredApps.map((app) => (
            <ApplicantCard
              key={app._id}
              app={app}
              jobTitle={getJobTitle(safeJobs, app.jobId)}
              onViewDetails={() => {
                setSelectedApp(app);
                setViewAppModal(true);
              }}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}

        {activeTab === "profile" && (
          <View>
            <View style={styles.profileTop}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {user?.name?.[0] || "E"}
                </Text>
              </View>
              <Text style={styles.profileName}>{user?.name || "Employer"}</Text>
              <Text style={styles.profileEmail}>
                {user?.email || "employer@example.com"}
              </Text>
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>Employer Account</Text>
              </View>
            </View>
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <TouchableOpacity style={styles.menuItem}>
                <View>
                  <Text style={styles.menuTitle}>Company Profile</Text>
                  <Text style={styles.menuDesc}>
                    Update your company information
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <View>
                  <Text style={styles.menuTitle}>Billing</Text>
                  <Text style={styles.menuDesc}>Manage your subscription</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <View>
                  <Text style={styles.menuTitle}>Notifications</Text>
                  <Text style={styles.menuDesc}>Manage preferences</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setLogoutModalVisible(true)}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <JobFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setIsEditing(false);
          setSelectedJob(null);
          setFormData(resetFormData());
        }}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        onSubmit={isEditing ? handleUpdateJob : handleCreateJob}
      />
      <ViewAppModal
        visible={viewAppModal}
        onClose={() => setViewAppModal(false)}
        selectedApp={selectedApp}
      />
      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />
    </View>
  );
}
