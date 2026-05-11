// UserDashboard.js - Complete fixed version

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useAuth } from "../core/auth/AuthContext";
import apiClient from "../core/api/apiClient";

// Icons (same as EmployerDashboard)
const Icon = {
  Briefcase: () => <Text style={{ fontSize: 20 }}>💼</Text>,
  Users: () => <Text style={{ fontSize: 20 }}>👥</Text>,
  User: () => <Text style={{ fontSize: 20 }}>👤</Text>,
  Search: () => <Text style={{ fontSize: 16 }}>🔍</Text>,
  Clock: () => <Text style={{ fontSize: 14 }}>⏰</Text>,
  FileText: () => <Text style={{ fontSize: 16 }}>📄</Text>,
  MapPin: () => <Text style={{ fontSize: 12 }}>📍</Text>,
  DollarSign: () => <Text style={{ fontSize: 12 }}>$</Text>,
  Calendar: () => <Text style={{ fontSize: 14 }}>📅</Text>,
  LogOut: () => <Text style={{ fontSize: 20 }}>🚪</Text>,
  Building: () => <Text style={{ fontSize: 20 }}>🏢</Text>,
  ChevronRight: () => <Text style={{ fontSize: 16 }}>›</Text>,
  Bell: () => <Text style={{ fontSize: 20 }}>🔔</Text>,
  CreditCard: () => <Text style={{ fontSize: 20 }}>💳</Text>,
  HelpCircle: () => <Text style={{ fontSize: 20 }}>❓</Text>,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0D1A" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0D1A",
  },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  welcomeText: { fontSize: 14, color: "#888", marginBottom: 4 },
  userName: { fontSize: 26, fontWeight: "700", color: "#fff" },
  searchWrap: { marginHorizontal: 20, marginBottom: 16 },
  searchInput: {
    backgroundColor: "#131629",
    borderWidth: 1,
    borderColor: "#1E2240",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 44,
    color: "#fff",
    fontSize: 15,
  },
  searchIcon: { position: "absolute", left: 14, top: "50%", zIndex: 1 },
  jobCard: {
    backgroundColor: "#131629",
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  jobTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  jobCompany: { fontSize: 14, color: "#888", marginTop: 2 },
  jobMeta: { flexDirection: "row", gap: 16, marginTop: 10 },
  metaText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#888",
  },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 24,
    fontSize: 12,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#2A2E50",
    color: "#CCD",
  },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "#7C3AED15",
    color: "#9B8EFF",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  seeAll: { fontSize: 14, color: "#7C3AED", fontWeight: "500" },
  emptyText: { textAlign: "center", color: "#666", paddingTop: 60 },
  profileTop: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 28,
    alignItems: "center",
  },
  profileAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#1A1D35",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2A2E50",
    marginBottom: 10,
  },
  profileAvatarText: { fontSize: 36, fontWeight: "700", color: "#9B8EFF" },
  profileName: { fontSize: 22, fontWeight: "700", color: "#fff" },
  profileEmail: { fontSize: 15, color: "#888" },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2A2E50",
    marginTop: 8,
  },
  profileBadgeText: { fontSize: 15, color: "#9B8EFF" },
  profileSection: { paddingHorizontal: 20 },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  profileItem: {
    backgroundColor: "#131629",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  profileItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1A1D35",
    alignItems: "center",
    justifyContent: "center",
  },
  profileItemText: { flex: 1 },
  profileItemTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  profileItemDesc: { fontSize: 13, color: "#888", marginTop: 4 },
  logoutItem: { borderColor: "#FF444430" },
  logoutText: { color: "#FF4444" },
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#0F1225",
    borderTopWidth: 1,
    borderTopColor: "#1E2240",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  navText: { fontSize: 12, fontWeight: "500", color: "#666" },
  navTextActive: { color: "#7C3AED" },
  appCard: {
    backgroundColor: "#131629",
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1E2240",
  },
  appCardRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E1E3A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22, color: "#7C3AED", fontWeight: "700" },
  appName: { fontSize: 16, fontWeight: "700", color: "#fff" },
  appRole: { fontSize: 14, color: "#888", marginTop: 2 },
  statusPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 24 },
  statusText: { fontSize: 13, fontWeight: "600" },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  dateText: { fontSize: 13, color: "#888" },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 20,
    marginBottom: 20,
  },
  pageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E2240",
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnActive: { backgroundColor: "#7C3AED" },
  pageBtnDisabled: { opacity: 0.5 },
  pageBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  pageInfo: { fontSize: 14, color: "#AAA" },
});

const statusColor = (s) => {
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

const statusLabel = (s) =>
  (s || "Applied").charAt(0).toUpperCase() + (s || "Applied").slice(1);

export default function UserDashboard({ navigation }) {
  const [tab, setTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [appsPage, setAppsPage] = useState(1);
  const [appsTotalPages, setAppsTotalPages] = useState(1);
  const { user, logout } = useAuth();

  // SAFE data accessors - THIS IS THE KEY FIX
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeApplications = Array.isArray(applications) ? applications : [];

  const loadJobs = async (page = 1) => {
    try {
      const result = await apiClient.get(`/jobs?page=${page}&limit=10`, false);
      if (result.success) {
        // FIX: Handle both array and object responses (same as EmployerDashboard)
        let jobsData = [];
        if (Array.isArray(result.data)) {
          jobsData = result.data;
        } else if (result.data && Array.isArray(result.data.data)) {
          jobsData = result.data.data;
        } else if (result.data && typeof result.data === "object") {
          jobsData = Object.values(result.data).filter(
            (item) => item && typeof item === "object" && item._id
          );
        } else {
          jobsData = [];
        }
        setJobs(jobsData);
        setJobsTotalPages(result.pages || 1);
        setJobsPage(page);
      } else {
        setJobs([]);
        console.error("Failed to load jobs:", result.error);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      setJobs([]);
    }
  };

  const loadApplications = async (page = 1) => {
    try {
      const result = await apiClient.get(
        `/applications/my-applications?page=${page}&limit=10`,
        true
      );
      if (result.success) {
        let appsData = [];
        if (Array.isArray(result.data)) {
          appsData = result.data;
        } else if (result.data && Array.isArray(result.data.applications)) {
          appsData = result.data.applications;
        } else if (result.data && Array.isArray(result.data.data)) {
          appsData = result.data.data;
        } else if (result.data && typeof result.data === "object") {
          appsData = Object.values(result.data).filter(
            (item) => item && typeof item === "object" && item._id
          );
        } else {
          appsData = [];
        }
        setApplications(appsData);
        setAppsTotalPages(result.pages || 1);
        setAppsPage(page);
      } else {
        setApplications([]);
        console.error("Failed to load applications:", result.error);
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      setApplications([]);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadJobs(1), loadApplications(1)]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleLogout = async () => {
    await logout();
    if (navigation) navigation.replace("Login");
  };

  const filteredJobs = safeJobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
          onPress={() => page > 1 && onPageChange(page - 1)}
          disabled={page === 1}>
          <Text style={styles.pageBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>
          Page {page} of {totalPages}
        </Text>
        <TouchableOpacity
          style={[
            styles.pageBtn,
            page === totalPages && styles.pageBtnDisabled,
          ]}
          onPress={() => page < totalPages && onPageChange(page + 1)}
          disabled={page === totalPages}>
          <Text style={styles.pageBtnText}>→</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const renderJobs = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#7C3AED"
        />
      }>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Find Your Dream Job</Text>
        <Text style={styles.userName}>
          Hello, {user?.name?.split(" ")[0] || "User"}! 👋
        </Text>
      </View>
      <View style={styles.searchWrap}>
        <View style={styles.searchIcon}>
          <Icon.Search />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs by title or company..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {filteredJobs.length === 0 ? (
        <Text style={styles.emptyText}>No jobs found</Text>
      ) : (
        filteredJobs.map((job) => (
          <View key={job._id} style={styles.jobCard}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobCompany}>{job.company}</Text>
            <View style={styles.jobMeta}>
              <Text style={styles.metaText}>
                <Icon.MapPin /> {job.location || "Remote"}
              </Text>
              <Text style={styles.metaText}>
                <Icon.DollarSign /> {job.salary || "Negotiable"}
              </Text>
            </View>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>{job.type || "Full Time"}</Text>
              {job.experienceRequired && (
                <Text style={styles.badge}>{job.experienceRequired}</Text>
              )}
            </View>
            {job.skillsRequired?.length > 0 && (
              <View style={styles.skillsRow}>
                {job.skillsRequired.slice(0, 3).map((s, i) => (
                  <Text key={i} style={styles.skillBadge}>
                    {s}
                  </Text>
                ))}
                {job.skillsRequired.length > 3 && (
                  <Text style={styles.skillBadge}>
                    +{job.skillsRequired.length - 3}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))
      )}
      <Pagination
        page={jobsPage}
        totalPages={jobsTotalPages}
        onPageChange={(p) => {
          loadJobs(p);
          setJobsPage(p);
        }}
      />
    </ScrollView>
  );

  const renderApplications = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#7C3AED"
        />
      }>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Your Applications</Text>
        <Text style={styles.userName}>Track Status</Text>
      </View>
      {safeApplications.length === 0 ? (
        <Text style={styles.emptyText}>No applications found</Text>
      ) : (
        safeApplications.map((app) => (
          <View key={app._id} style={styles.appCard}>
            <View style={styles.appCardRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(app.jobId?.title || "J")[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.appName}>
                  {app.jobId?.title || "Job Position"}
                </Text>
                <Text style={styles.appRole}>
                  {app.jobId?.company || "Company"}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: statusColor(app.status) + "20" },
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    { color: statusColor(app.status) },
                  ]}>
                  {statusLabel(app.status)}
                </Text>
              </View>
            </View>
            <View style={styles.dateRow}>
              <Icon.Calendar />
              <Text style={styles.dateText}>
                Applied:{" "}
                {app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString()
                  : "Recent"}
              </Text>
            </View>
          </View>
        ))
      )}
      <Pagination
        page={appsPage}
        totalPages={appsTotalPages}
        onPageChange={(p) => {
          loadApplications(p);
          setAppsPage(p);
        }}
      />
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.profileTop}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{user?.name?.[0] || "U"}</Text>
        </View>
        <Text style={styles.profileName}>{user?.name || "User"}</Text>
        <Text style={styles.profileEmail}>
          {user?.email || "user@example.com"}
        </Text>
        <View style={styles.profileBadge}>
          <Icon.User />
          <Text style={styles.profileBadgeText}>Job Seeker</Text>
        </View>
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileSectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.profileItem}>
          <View style={styles.profileItemIcon}>
            <Icon.User />
          </View>
          <View style={styles.profileItemText}>
            <Text style={styles.profileItemTitle}>Personal Info</Text>
            <Text style={styles.profileItemDesc}>
              Update your profile information
            </Text>
          </View>
          <Icon.ChevronRight />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileItem}>
          <View style={styles.profileItemIcon}>
            <Icon.Bell />
          </View>
          <View style={styles.profileItemText}>
            <Text style={styles.profileItemTitle}>Notifications</Text>
            <Text style={styles.profileItemDesc}>
              Manage your notification preferences
            </Text>
          </View>
          <Icon.ChevronRight />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileItem}>
          <View style={styles.profileItemIcon}>
            <Icon.HelpCircle />
          </View>
          <View style={styles.profileItemText}>
            <Text style={styles.profileItemTitle}>Help & Support</Text>
            <Text style={styles.profileItemDesc}>
              Get help or contact support
            </Text>
          </View>
          <Icon.ChevronRight />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.profileItem, styles.logoutItem]}
          onPress={handleLogout}>
          <View
            style={[styles.profileItemIcon, { backgroundColor: "#FF444415" }]}>
            <Icon.LogOut />
          </View>
          <Text style={[styles.profileItemTitle, styles.logoutText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, marginBottom: 70 }}>
        {tab === "jobs" && renderJobs()}
        {tab === "applications" && renderApplications()}
        {tab === "profile" && renderProfile()}
      </View>

      <View style={styles.nav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setTab("jobs")}>
          <Icon.Briefcase />
          <Text
            style={[styles.navText, tab === "jobs" && styles.navTextActive]}>
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setTab("applications")}>
          <Icon.FileText />
          <Text
            style={[
              styles.navText,
              tab === "applications" && styles.navTextActive,
            ]}>
            Applications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setTab("profile")}>
          <Icon.User />
          <Text
            style={[styles.navText, tab === "profile" && styles.navTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
