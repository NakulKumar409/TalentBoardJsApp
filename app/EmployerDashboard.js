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
} from "react-native";
import { useState, useEffect } from "react";
import apiClient from "../core/api/apiClient";
import { useAuth } from "../core/auth/AuthContext";
export default function EmployerDashboard({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    profile: "",
    company: "",
    location: "",
    salary: "",
    type: "Full Time",
    skillsRequired: [],
    experienceRequired: "",
    description: "",
  });
  const { user, logout } = useAuth();

  const loadJobs = async () => {
    const result = await apiClient.get("/jobs", false);
    if (result.success) {
      setJobs(result.data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  const handleCreateJob = async () => {
    if (!formData.title || !formData.profile || !formData.company) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    const result = await apiClient.post("/jobs/create", formData, true);
    if (result.success) {
      Alert.alert("Success", "Job created successfully");
      setModalVisible(false);
      setFormData({
        title: "",
        profile: "",
        company: "",
        location: "",
        salary: "",
        type: "Full Time",
        skillsRequired: [],
        experienceRequired: "",
        description: "",
      });
      loadJobs();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    Alert.alert("Confirm", "Delete this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const result = await apiClient.delete(`/jobs/${jobId}`, true);
          if (result.success) {
            Alert.alert("Success", "Job deleted");
            loadJobs();
          } else {
            Alert.alert("Error", result.error);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B4D8" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#00B4D8"
        />
      }>
      <View style={styles.header}>
        <View style={styles.logoSmall}>
          <Text style={styles.logoSmallText}>DS</Text>
        </View>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>
            Admin • {user?.name || "Employer"}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.adminBadge}>
        <Text style={styles.adminBadgeText}>👑 Admin Access</Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>DeepSeek AI Enterprise</Text>
        <Text style={styles.heroText}>
          Manage your organization's AI infrastructure
        </Text>
        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.heroButtonText}>+ Create New Job</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{jobs.length}</Text>
          <Text style={styles.statLabel}>Total Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Applicants</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Shortlisted</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Manage Jobs ({jobs.length})</Text>
        {jobs.map((job) => (
          <View key={job._id} style={styles.jobItem}>
            <View style={styles.jobHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCompany}>
                  {job.company} • {job.location || "Remote"}
                </Text>
                <Text style={styles.jobSalary}>{job.salary}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteJob(job._id)}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {jobs.length === 0 && (
          <Text style={styles.noJobs}>
            No jobs created yet. Tap "Create New Job" to add.
          </Text>
        )}
      </View>

      <View style={styles.discoverCard}>
        <Text style={styles.discoverTitle}>
          Discover Intelligence with DeepSeek AI
        </Text>
        <Text style={styles.discoverText}>
          DeepSeek is artificial general intelligence with advanced AI features.
        </Text>
        <TouchableOpacity style={styles.discoverButton}>
          <Text style={styles.discoverButtonText}>Get Started →</Text>
        </TouchableOpacity>
      </View>

      {/* Create Job Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Job</Text>
            <ScrollView style={{ maxHeight: 500 }}>
              <TextInput
                style={styles.modalInput}
                placeholder="Job Title *"
                placeholderTextColor="#888"
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Profile *"
                placeholderTextColor="#888"
                value={formData.profile}
                onChangeText={(text) =>
                  setFormData({ ...formData, profile: text })
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Company *"
                placeholderTextColor="#888"
                value={formData.company}
                onChangeText={(text) =>
                  setFormData({ ...formData, company: text })
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Location"
                placeholderTextColor="#888"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Salary"
                placeholderTextColor="#888"
                value={formData.salary}
                onChangeText={(text) =>
                  setFormData({ ...formData, salary: text })
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Skills (comma separated)"
                placeholderTextColor="#888"
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    skillsRequired: text.split(",").map((s) => s.trim()),
                  })
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Experience Required"
                placeholderTextColor="#888"
                value={formData.experienceRequired}
                onChangeText={(text) =>
                  setFormData({ ...formData, experienceRequired: text })
                }
              />
              <TextInput
                style={[styles.modalInput, { height: 80 }]}
                placeholder="Description"
                placeholderTextColor="#888"
                multiline
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateJob}>
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F", padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0A0F",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
    gap: 12,
  },
  logoSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00B4D8",
    justifyContent: "center",
    alignItems: "center",
  },
  logoSmallText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  greeting: { fontSize: 12, color: "#aaa" },
  userName: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  logoutButton: {
    marginLeft: "auto",
    backgroundColor: "#FF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
  adminBadge: {
    backgroundColor: "#00B4D8",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  adminBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  heroCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  heroText: { fontSize: 14, color: "#bbb", marginBottom: 16 },
  heroButton: {
    backgroundColor: "#00B4D8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroButtonText: { color: "#fff", fontWeight: "bold" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#00B4D8" },
  statLabel: { fontSize: 12, color: "#aaa", marginTop: 4 },
  sectionCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  jobItem: {
    backgroundColor: "#2A2A3E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  jobCompany: { fontSize: 14, color: "#aaa", marginTop: 4 },
  jobSalary: {
    fontSize: 14,
    color: "#00B4D8",
    marginTop: 4,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF4444",
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButtonText: { fontSize: 16 },
  noJobs: { textAlign: "center", color: "#888", padding: 20 },
  discoverCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#00B4D833",
  },
  discoverTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  discoverText: { fontSize: 14, color: "#bbb", marginBottom: 16 },
  discoverButton: {
    alignSelf: "flex-start",
    backgroundColor: "#00B4D822",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00B4D8",
  },
  discoverButtonText: { color: "#00B4D8", fontWeight: "600" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    backgroundColor: "#1A1A2E",
    borderRadius: 24,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#2A2A3E",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 20 },
  modalButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center" },
  cancelButton: { backgroundColor: "#FF4444" },
  cancelButtonText: { color: "#fff", fontWeight: "bold" },
  createButton: { backgroundColor: "#00B4D8" },
  createButtonText: { color: "#fff", fontWeight: "bold" },
});
