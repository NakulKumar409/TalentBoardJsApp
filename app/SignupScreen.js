import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useState } from "react";
import { useAuth } from "../core/auth/AuthContext";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // ✅ SIRF USER ROLE - KOI DROPDOWN NAHI
      const result = await signup({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        role: "user", // ✅ FIXED: Always "user"
      });

      console.log("Signup result:", result);

      if (!result.success) {
        Alert.alert("Signup Failed", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.logoSection}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>DS</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join TalentBoard today</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign Up</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By signing up, you agree to our{" "}
            <Text style={styles.termsLink}>Terms</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0A0A0F",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: "#00B4D8",
    fontSize: 16,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00B4D8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
  },
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 24,
    padding: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#2A2A3E",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 16,
  },
  termsContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  termsText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
  termsLink: {
    color: "#00B4D8",
  },
  signupButton: {
    backgroundColor: "#00B4D8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#aaa",
    fontSize: 14,
  },
  footerLink: {
    color: "#00B4D8",
    fontSize: 14,
    fontWeight: "600",
  },
});
