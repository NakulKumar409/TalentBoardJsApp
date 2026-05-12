// features/employerJobs/components/ApplicantCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/employerStyles";
import { getStatusColor, getStatusLabel } from "../utils/helpers";

export const ApplicantCard = ({
  app,
  jobTitle,
  onViewDetails,
  onStatusUpdate,
}) => {
  return (
    <View style={styles.appCard}>
      <Text style={styles.appName}>
        {app.fullName || app.name || "Candidate"}
      </Text>
      <Text style={styles.appRole}>{jobTitle}</Text>
      <Text style={styles.appEmail}>Email: {app.email}</Text>
      {app.phone && <Text style={styles.appPhone}>Phone: {app.phone}</Text>}
      {app.coverLetter && (
        <View style={styles.coverBox}>
          <Text style={styles.coverText} numberOfLines={2}>
            "{app.coverLetter}"
          </Text>
        </View>
      )}
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: getStatusColor(app.status) + "20",
            alignSelf: "flex-start",
          },
        ]}>
        <Text
          style={[styles.statusText, { color: getStatusColor(app.status) }]}>
          {getStatusLabel(app.status)}
        </Text>
      </View>
      <TouchableOpacity style={styles.viewBtn} onPress={onViewDetails}>
        <Text style={styles.viewBtnText}>View Details</Text>
      </TouchableOpacity>
      <View style={styles.statusActions}>
        {["reviewed", "shortlisted", "hired", "rejected"]
          .filter((s) => s !== app.status?.toLowerCase())
          .map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusAction,
                { backgroundColor: getStatusColor(s) + "20" },
              ]}
              onPress={() => onStatusUpdate(app._id, s)}>
              <Text
                style={[styles.statusActionText, { color: getStatusColor(s) }]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};
