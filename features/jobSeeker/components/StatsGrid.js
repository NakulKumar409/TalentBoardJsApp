// features/jobSeeker/components/StatsGrid.js
import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/userStyles";

export const StatsGrid = ({ stats }) => {
  const items = [
    { label: "Total", value: stats?.totalApplications || 0, color: "#3B82F6" },
    { label: "Pending", value: stats?.pending || 0, color: "#F59E0B" },
    { label: "Shortlisted", value: stats?.shortlisted || 0, color: "#10B981" },
    { label: "Hired", value: stats?.hired || 0, color: "#8B5CF6" },
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
