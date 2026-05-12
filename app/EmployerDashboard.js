import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../core/api/apiClient";
import { useAuth } from "../core/auth/AuthContext";
import { CommonActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Helper functions
const getStatusColor = (s) => {
  const status = (s || "Applied").toLowerCase();
  const colors = {
    applied: "#F59E0B",
    pending: "#F59E0B",
    reviewed: "#3B82F6",
    shortlisted: "#10B981",
    rejected: "#EF4444",
    hired: "#8B5CF6",
  };
  return colors[status] || "#888";
};

const getStatusLabel = (s) =>
  (s || "Applied").charAt(0).toUpperCase() + (s || "Applied").slice(1);

export default function EmployerDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
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

  const [formData, setFormData] = useState({
    title: "",
    profile: "",
    company: "",
    location: "",
    salary: "",
    type: "Full Time",
    skillsRequired: "",
    experienceRequired: "",
    description: "",
  });

  // Load Jobs
  const loadJobs = async () => {
    try {
      const result = await apiClient.get("/jobs", false);
      if (result.success) {
        let jobsData = [];
        if (Array.isArray(result.data)) jobsData = result.data;
        else if (result.data?.data && Array.isArray(result.data.data))
          jobsData = result.data.data;
        else jobsData = [];
        setJobs(jobsData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Load Applications
  const loadApplications = async () => {
    try {
      const result = await apiClient.get("/applications", true);
      if (result.success) {
        let appsData = [];
        if (Array.isArray(result.data)) appsData = result.data;
        else if (
          result.data?.applications &&
          Array.isArray(result.data.applications)
        )
          appsData = result.data.applications;
        else if (result.data?.data && Array.isArray(result.data.data))
          appsData = result.data.data;
        else appsData = [];
        setApplications(appsData);
      }
    } catch (error) {
      console.error("Error:", error);
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
    loadAll();
  }, []);

  // Create Job
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
    const result = await apiClient.post("/jobs/create", payload, true);
    if (result.success) {
      Alert.alert("Success", "Job created!");
      setModalVisible(false);
      resetForm();
      loadAll();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  // Update Job
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
    const result = await apiClient.put(
      `/jobs/${selectedJob._id}`,
      payload,
      true
    );
    if (result.success) {
      Alert.alert("Success", "Job updated!");
      setModalVisible(false);
      setIsEditing(false);
      setSelectedJob(null);
      resetForm();
      loadAll();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  // Delete Job
  const handleDeleteJob = (jobId) => {
    Alert.alert("Confirm", "Delete this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const result = await apiClient.delete(`/jobs/${jobId}`, true);
          if (result.success) {
            Alert.alert("Success", "Job deleted!");
            loadAll();
          } else {
            Alert.alert("Error", result.error);
          }
        },
      },
    ]);
  };

  // Update Status
  const handleStatusUpdate = async (appId, status) => {
    const result = await apiClient.put(
      `/applications/${appId}`,
      { status },
      true
    );
    if (result.success) {
      Alert.alert("Success", `Application ${status}`);
      loadApplications();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      profile: "",
      company: "",
      location: "",
      salary: "",
      type: "Full Time",
      skillsRequired: "",
      experienceRequired: "",
      description: "",
    });
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

  // FIXED LOGOUT FUNCTIONS
  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    setLoading(true);

    try {
      // Clear AsyncStorage directly
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      // Call logout from context
      await logout();

      // Reset navigation to Login screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.log("Logout error:", error);
      // Force navigate even if error
      navigation.replace("Login");
    }
  };

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeApps = Array.isArray(applications) ? applications : [];

  const stats = {
    totalJobs: safeJobs.length,
    applications: safeApps.length,
    pending: safeApps.filter(
      (a) =>
        a.status?.toLowerCase() === "applied" ||
        a.status?.toLowerCase() === "pending"
    ).length,
    shortlisted: safeApps.filter(
      (a) => a.status?.toLowerCase() === "shortlisted"
    ).length,
    hired: safeApps.filter((a) => a.status?.toLowerCase() === "hired").length,
  };

  const filteredJobs = safeJobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredApps = safeApps.filter((a) => {
    const matchSearch =
      (a.fullName || a.name || "")
        .toLowerCase()
        .includes(appSearch.toLowerCase()) ||
      a.email?.toLowerCase().includes(appSearch.toLowerCase());
    const matchFilter =
      appFilter === "All" ||
      a.status?.toLowerCase() === appFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const getJobTitle = (jobId) => {
    if (typeof jobId === "object" && jobId !== null)
      return jobId.title || "Unknown";
    const job = safeJobs.find((j) => j._id === jobId);
    return job?.title || "Unknown Position";
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

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || "Employer"}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>
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
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#7C3AED" }]}>
              {stats.totalJobs}
            </Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#3B82F6" }]}>
              {stats.applications}
            </Text>
            <Text style={styles.statLabel}>Applications</Text>
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
          <View style={[styles.statCard, styles.hiredCard]}>
            <Text style={[styles.statNumber, { color: "#8B5CF6" }]}>
              {stats.hired}
            </Text>
            <Text style={styles.statLabel}>Hired</Text>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => {
            setIsEditing(false);
            setSelectedJob(null);
            resetForm();
            setModalVisible(true);
          }}>
          <Text style={styles.createBtnText}>Post New Job</Text>
        </TouchableOpacity>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[
              styles.navItem,
              activeTab === "dashboard" && styles.navItemActive,
            ]}
            onPress={() => setActiveTab("dashboard")}>
            <Text
              style={[
                styles.navText,
                activeTab === "dashboard" && styles.navTextActive,
              ]}>
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navItem,
              activeTab === "jobs" && styles.navItemActive,
            ]}
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
              activeTab === "alljobs" && styles.navItemActive,
            ]}
            onPress={() => setActiveTab("alljobs")}>
            <Text
              style={[
                styles.navText,
                activeTab === "alljobs" && styles.navTextActive,
              ]}>
              All Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navItem,
              activeTab === "applicants" && styles.navItemActive,
            ]}
            onPress={() => setActiveTab("applicants")}>
            <Text
              style={[
                styles.navText,
                activeTab === "applicants" && styles.navTextActive,
              ]}>
              Applicants
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

        {/* Search */}
        {(activeTab === "jobs" || activeTab === "alljobs") && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs by title or company..."
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
                placeholder="Search by name or email..."
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

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Jobs</Text>
              <TouchableOpacity onPress={() => setActiveTab("jobs")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {safeJobs.slice(0, 3).map((job) => (
              <View key={job._id} style={styles.jobCard}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCompany}>{job.company}</Text>
                <Text style={styles.jobDetail}>
                  Location: {job.location || "Remote"} | Salary:{" "}
                  {job.salary || "Negotiable"}
                </Text>
              </View>
            ))}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Applications</Text>
              <TouchableOpacity onPress={() => setActiveTab("applicants")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {safeApps.slice(0, 3).map((app) => (
              <View key={app._id} style={styles.appCard}>
                <Text style={styles.appName}>
                  {app.fullName || app.name || "Candidate"}
                </Text>
                <Text style={styles.appRole}>{getJobTitle(app.jobId)}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(app.status) + "20",
                      alignSelf: "flex-start",
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(app.status) },
                    ]}>
                    {getStatusLabel(app.status)}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Jobs List */}
        {(activeTab === "jobs" || activeTab === "alljobs") && (
          <>
            {filteredJobs.map((job) => (
              <View key={job._id} style={styles.jobCard}>
                <Text style={styles.jobTitle}>{job.title}</Text>
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
                    {job.skillsRequired.slice(0, 3).map((s, i) => (
                      <View key={i} style={styles.skillTag}>
                        <Text style={styles.skillText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {activeTab === "jobs" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => openEditModal(job)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteJob(job._id)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
            {filteredJobs.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No jobs found</Text>
              </View>
            )}
          </>
        )}

        {/* Applications List */}
        {activeTab === "applicants" && (
          <>
            {filteredApps.map((app) => (
              <View key={app._id} style={styles.appCard}>
                <Text style={styles.appName}>
                  {app.fullName || app.name || "Candidate"}
                </Text>
                <Text style={styles.appRole}>{getJobTitle(app.jobId)}</Text>
                <Text style={styles.appEmail}>Email: {app.email}</Text>
                {app.phone && (
                  <Text style={styles.appPhone}>Phone: {app.phone}</Text>
                )}
                {app.coverLetter && (
                  <View style={styles.coverBox}>
                    <Text style={styles.coverText} numberOfLines={2}>
                      "{app.coverLetter}"
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(app.status) + "20",
                      alignSelf: "flex-start",
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(app.status) },
                    ]}>
                    {getStatusLabel(app.status)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => {
                    setSelectedApp(app);
                    setViewAppModal(true);
                  }}>
                  <Text style={styles.viewBtnText}>View Details</Text>
                </TouchableOpacity>
                <View style={styles.statusActions}>
                  {["reviewed", "shortlisted", "hired", "rejected"]
                    .filter((s) => s !== app.status?.toLowerCase())
                    .map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.statusAction,
                          { backgroundColor: getStatusColor(s) + "20" },
                        ]}
                        onPress={() => handleStatusUpdate(app._id, s)}>
                        <Text
                          style={[
                            styles.statusActionText,
                            { color: getStatusColor(s) },
                          ]}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            ))}
            {filteredApps.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No applications found</Text>
              </View>
            )}
          </>
        )}

        {/* Profile Tab */}
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

              {/* Logout Button - Fixed */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogoutPress}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Custom Logout Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}>
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

      {/* Create/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? "Edit Job" : "Post New Job"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Job Title *"
                placeholderTextColor="#666"
                value={formData.title}
                onChangeText={(t) => setFormData({ ...formData, title: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Profile / Role *"
                placeholderTextColor="#666"
                value={formData.profile}
                onChangeText={(t) => setFormData({ ...formData, profile: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Company Name *"
                placeholderTextColor="#666"
                value={formData.company}
                onChangeText={(t) => setFormData({ ...formData, company: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#666"
                value={formData.location}
                onChangeText={(t) => setFormData({ ...formData, location: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Salary"
                placeholderTextColor="#666"
                value={formData.salary}
                onChangeText={(t) => setFormData({ ...formData, salary: t })}
              />
              <View style={styles.typeRow}>
                {["Full Time", "Part Time", "Contract", "Internship"].map(
                  (t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.typeChip,
                        formData.type === t && styles.typeChipActive,
                      ]}
                      onPress={() => setFormData({ ...formData, type: t })}>
                      <Text
                        style={[
                          styles.typeChipText,
                          formData.type === t && styles.typeChipTextActive,
                        ]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Skills (comma separated)"
                placeholderTextColor="#666"
                value={formData.skillsRequired}
                onChangeText={(t) =>
                  setFormData({ ...formData, skillsRequired: t })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Experience Required"
                placeholderTextColor="#666"
                value={formData.experienceRequired}
                onChangeText={(t) =>
                  setFormData({ ...formData, experienceRequired: t })
                }
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Job Description"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(t) =>
                  setFormData({ ...formData, description: t })
                }
              />
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={isEditing ? handleUpdateJob : handleCreateJob}>
                <Text style={styles.submitBtnText}>
                  {isEditing ? "Update Job" : "Post Job"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Application Modal */}
      <Modal visible={viewAppModal} animationType="slide" transparent={true}>
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
                  <View style={styles.appDetailHeader}>
                    <View style={styles.appDetailAvatar}>
                      <Text style={styles.appDetailAvatarText}>
                        {(selectedApp.fullName || selectedApp.name || "?")[0]}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.appDetailName}>
                        {selectedApp.fullName || selectedApp.name}
                      </Text>
                      <Text style={styles.appDetailEmail}>
                        {selectedApp.email}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Contact</Text>
                    <Text style={styles.detailText}>
                      Email: {selectedApp.email}
                    </Text>
                    {selectedApp.phone && (
                      <Text style={styles.detailText}>
                        Phone: {selectedApp.phone}
                      </Text>
                    )}
                  </View>
                  {selectedApp.coverLetter && (
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Cover Letter</Text>
                      <View style={styles.coverFull}>
                        <Text style={styles.coverFullText}>
                          {selectedApp.coverLetter}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          alignSelf: "flex-start",
                          backgroundColor:
                            getStatusColor(selectedApp.status) + "20",
                        },
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(selectedApp.status) },
                        ]}>
                        {getStatusLabel(selectedApp.status)}
                      </Text>
                    </View>
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
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: "#131629",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  hiredCard: {
    width: width - 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statNumber: { fontSize: 32, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 4 },

  createBtn: {
    backgroundColor: "#7C3AED",
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  createBtnText: { fontSize: 16, fontWeight: "bold", color: "#fff" },

  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#0F1225",
    borderTopWidth: 1,
    borderTopColor: "#1E2240",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 16,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  navItemActive: { backgroundColor: "#7C3AED20" },
  navText: { fontSize: 12, color: "#888", fontWeight: "500" },
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

  filterScroll: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#131629",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  filterBtnActive: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" },
  filterBtnText: { fontSize: 12, color: "#888" },
  filterBtnTextActive: { color: "#fff" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  seeAll: { fontSize: 13, color: "#7C3AED" },

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
  jobDetail: { fontSize: 12, color: "#888" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2E50",
  },
  tagText: { fontSize: 11, color: "#AAA" },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#7C3AED15",
  },
  skillText: { fontSize: 11, color: "#9B8EFF" },
  actionRow: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1E2240",
  },
  editText: { color: "#9B8EFF", fontSize: 13 },
  deleteText: { color: "#FF4444", fontSize: 13 },

  appCard: {
    backgroundColor: "#131629",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E2240",
    gap: 8,
  },
  appName: { fontSize: 15, fontWeight: "bold", color: "#fff" },
  appRole: { fontSize: 12, color: "#888", marginTop: 2 },
  appEmail: { fontSize: 12, color: "#888" },
  appPhone: { fontSize: 12, color: "#888" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  coverBox: { backgroundColor: "#1A1D35", padding: 10, borderRadius: 10 },
  coverText: { fontSize: 12, color: "#AAA", fontStyle: "italic" },
  viewBtn: {
    backgroundColor: "#1E2240",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  viewBtnText: { color: "#9B8EFF", fontSize: 13, fontWeight: "600" },
  statusActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  statusAction: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  statusActionText: { fontSize: 11, fontWeight: "600" },

  profileTop: {
    alignItems: "center",
    paddingTop: 40,
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

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 16, color: "#888" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#131629",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    padding: 20,
    width: width,
    alignSelf: "center",
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
  input: {
    backgroundColor: "#1E2240",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2E50",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#1E2240",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2E50",
  },
  typeChipActive: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" },
  typeChipText: { fontSize: 12, color: "#AAA" },
  typeChipTextActive: { color: "#fff" },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    paddingBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#FF444420",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: { color: "#FF4444", fontWeight: "bold" },
  submitBtn: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontWeight: "bold" },

  appDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  appDetailAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7C3AED20",
    justifyContent: "center",
    alignItems: "center",
  },
  appDetailAvatarText: { fontSize: 26, fontWeight: "bold", color: "#7C3AED" },
  appDetailName: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  appDetailEmail: { fontSize: 13, color: "#888", marginTop: 2 },
  detailBox: { marginBottom: 20 },
  detailLabel: {
    fontSize: 12,
    color: "#7C3AED",
    marginBottom: 8,
    fontWeight: "600",
  },
  detailText: { fontSize: 14, color: "#DDD", marginBottom: 4 },
  coverFull: { backgroundColor: "#1E2240", padding: 14, borderRadius: 12 },
  coverFullText: { fontSize: 14, color: "#CCC", fontStyle: "italic" },

  // Custom Logout Modal Styles
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
  confirmButtons: {
    flexDirection: "row",
    gap: 12,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelConfirmBtn: {
    backgroundColor: "#1E2240",
  },
  logoutConfirmBtn: {
    backgroundColor: "#EF4444",
  },
  cancelConfirmText: {
    color: "#888",
    fontWeight: "600",
  },
  logoutConfirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
