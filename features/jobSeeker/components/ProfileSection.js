// features/jobSeeker/components/ProfileSection.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/userStyles";

export const ProfileSection = ({ user, onLogoutPress }) => {
  const menuItems = [
    { title: "Personal Information", desc: "Update your personal details" },
    { title: "Resume & Documents", desc: "Upload and manage your resume" },
    { title: "Notifications", desc: "Manage notification preferences" },
  ];

  return (
    <View>
      <View style={styles.profileTop}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{user?.name?.[0] || "U"}</Text>
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
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
