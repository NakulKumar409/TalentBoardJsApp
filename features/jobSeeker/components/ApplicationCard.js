// features/jobSeeker/components/ApplicationCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/userStyles";

export const ApplicationCard = ({ app, onPress }) => {
  return (
    <TouchableOpacity style={styles.appCard} onPress={onPress}>
      <Text style={styles.appJobTitle}>
        {app.jobId?.title || "Unknown Position"}
      </Text>
      <Text style={styles.appCompany}>
        {app.jobId?.company || "Unknown Company"}
      </Text>
      <Text style={styles.appDate}>
        Applied: {new Date(app.createdAt).toLocaleDateString()}
      </Text>
      <View style={styles.appStatusRow}>
        <View style={[styles.statusBadge, { backgroundColor: "#F59E0B20" }]}>
          <Text style={[styles.statusText, { color: "#F59E0B" }]}>
            {app.status || "Applied"}
          </Text>
        </View>
        <Text style={styles.appScore}>Match: {app.aiScore || 0}%</Text>
      </View>
    </TouchableOpacity>
  );
};
