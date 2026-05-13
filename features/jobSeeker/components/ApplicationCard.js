// features/jobSeeker/components/ApplicationCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/userStyles";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "applied":
      return "#F59E0B";
    case "reviewed":
      return "#3B82F6";
    case "shortlisted":
      return "#10B981";
    case "hired":
      return "#8B5CF6";
    case "rejected":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

const getStatusLabel = (status) => {
  if (!status) return "Applied";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const ApplicationCard = ({ app, onPress }) => {
  const job = app.jobId || {};

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <TouchableOpacity
      style={styles.appCard}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={styles.appJobTitle}>{job.title || "Unknown Position"}</Text>
      <Text style={styles.appCompany}>{job.company || "Unknown Company"}</Text>
      <Text style={styles.appDate}>Applied: {formatDate(app.createdAt)}</Text>
      <View style={styles.appStatusRow}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(app.status) + "20" },
          ]}>
          <Text
            style={[styles.statusText, { color: getStatusColor(app.status) }]}>
            {getStatusLabel(app.status)}
          </Text>
        </View>
        <Text style={styles.appScore}>Match: {app.aiScore || 0}%</Text>
      </View>
    </TouchableOpacity>
  );
};
