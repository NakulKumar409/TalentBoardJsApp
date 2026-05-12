// features/jobSeeker/components/ViewAppModal.js
import React from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../styles/userStyles";

export const ViewAppModal = ({ visible, app, onClose }) => {
  if (!app) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: "85%" }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Application Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Text style={styles.appDetailName}>{app.fullName || app.name}</Text>
            <Text style={styles.appDetailEmail}>{app.email}</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Job Position</Text>
              <Text style={styles.detailText}>
                {app.jobId?.title || "Unknown"}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: "#F59E0B20", alignSelf: "flex-start" },
                ]}>
                <Text style={[styles.statusText, { color: "#F59E0B" }]}>
                  {app.status || "Applied"}
                </Text>
              </View>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Match Score</Text>
              <Text style={styles.detailText}>{app.aiScore || 0}%</Text>
            </View>
            {app.phone && (
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailText}>{app.phone}</Text>
              </View>
            )}
            {app.coverLetter && (
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Cover Letter</Text>
                <Text style={styles.detailText}>{app.coverLetter}</Text>
              </View>
            )}
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Applied On</Text>
              <Text style={styles.detailText}>
                {new Date(app.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
