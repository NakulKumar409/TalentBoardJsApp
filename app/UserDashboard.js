import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../core/api/apiClient";
import { useAuth } from "../core/auth/AuthContext";

export default function UserDashboard({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
          <Text style={styles.userName}>{user?.name || "User"}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>DeepSeek AI</Text>
        <Text style={styles.heroText}>
          Artificial General Intelligence with advanced AI features
        </Text>
        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>Get Started →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Available Jobs ({jobs.length})</Text>
        {jobs.map((job) => (
          <TouchableOpacity key={job._id} style={styles.jobItem}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobCompany}>
              {job.company} • {job.location || "Remote"}
            </Text>
            <Text style={styles.jobSalary}>{job.salary}</Text>
            {job.skillsRequired && (
              <View style={styles.skillsContainer}>
                {job.skillsRequired.slice(0, 3).map((skill, i) => (
                  <View key={i} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
        {jobs.length === 0 && (
          <Text style={styles.noJobs}>No jobs available at the moment</Text>
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
          <Text style={styles.discoverButtonText}>Learn More →</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
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
  heroText: { fontSize: 14, color: "#bbb", marginBottom: 16, lineHeight: 20 },
  heroButton: {
    backgroundColor: "#00B4D8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroButtonText: { color: "#fff", fontWeight: "bold" },
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
  jobTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  jobCompany: { fontSize: 14, color: "#aaa", marginTop: 4 },
  jobSalary: {
    fontSize: 14,
    color: "#00B4D8",
    marginTop: 4,
    fontWeight: "bold",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#00B4D822",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: { color: "#00B4D8", fontSize: 12 },
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
});
