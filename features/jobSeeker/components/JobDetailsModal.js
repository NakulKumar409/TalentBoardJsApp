// features/jobSeeker/components/JobDetailsModal.js
import React from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../styles/userStyles";

export const JobDetailsModal = ({ visible, job, onClose, onApply }) => {
  if (!job) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Job Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Text style={styles.modalJobTitle}>{job.title || job.profile}</Text>
            <Text style={styles.modalJobCompany}>{job.company}</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailText}>{job.location || "Remote"}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Salary</Text>
              <Text style={styles.detailText}>
                {job.salary || "Negotiable"}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Job Type</Text>
              <Text style={styles.detailText}>{job.type || "Full Time"}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Experience</Text>
              <Text style={styles.detailText}>
                {job.experienceRequired || "Fresher"}
              </Text>
            </View>
            {job.skillsRequired?.length > 0 && (
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Skills Required</Text>
                <View style={styles.skillsRow}>
                  {job.skillsRequired.map((skill, i) => (
                    <View key={i} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailText}>
                {job.description || "No description provided"}
              </Text>
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.modalApplyBtn} onPress={onApply}>
              <Text style={styles.modalApplyBtnText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
