// features/jobSeeker/components/StatsGrid.js
import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/userStyles";

export const StatsGrid = ({ stats }) => {
  const items = [
    { label: "Total", value: stats.totalApplications, color: "#3B82F6" },
    { label: "Pending", value: stats.pending, color: "#F59E0B" },
    { label: "Shortlisted", value: stats.shortlisted, color: "#10B981" },
    { label: "Hired", value: stats.hired, color: "#8B5CF6" },
  ];

  return (
    <View style={styles.statsGrid}>
      {items.map((item, i) => (
        <View key={i} style={styles.statCard}>
          <Text style={[styles.statNumber, { color: item.color }]}>
            {item.value}
          </Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};
