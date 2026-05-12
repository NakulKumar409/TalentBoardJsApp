// features/employerJobs/components/StatsGrid.js
import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/employerStyles";

export const StatsGrid = ({ stats }) => {
  return (
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
  );
};
