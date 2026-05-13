// features/jobSeeker/components/ViewAppModal.js
import React from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
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

export const ViewAppModal = ({ visible, app, onClose }) => {
  if (!app) return null;

  const job = app.jobId || {};

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN");
  };

  const InfoRow = ({ label, value }) => (
    <View style={styles.detailInfoRow}>
      <Text style={styles.detailInfoLabel}>{label}</Text>
      <Text style={styles.detailInfoValue}>{value || "N/A"}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.detailModalContainer}>
        {/* Header */}
        <View style={styles.detailModalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.detailModalBackText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailModalTitle}>Application Details</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.detailModalCloseText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailModalScroll}>
          {/* Job Header */}
          <View style={styles.detailJobHeader}>
            <Text style={styles.detailJobTitle}>
              {job.title || "Job Title"}
            </Text>
            <Text style={styles.detailJobCompany}>
              {job.company || "Company Name"}
            </Text>
            <View style={styles.detailJobMeta}>
              <Text style={styles.detailJobMetaText}>
                📍 {job.location || "N/A"}
              </Text>
              <Text style={styles.detailJobMetaText}>
                💰 {job.salary || "N/A"}
              </Text>
              <Text style={styles.detailJobMetaText}>
                ⏰ {job.type || "Full Time"}
              </Text>
            </View>
            <View
              style={[
                styles.detailStatusBadge,
                { backgroundColor: getStatusColor(app.status) + "20" },
              ]}>
              <Text
                style={[
                  styles.detailStatusText,
                  { color: getStatusColor(app.status) },
                ]}>
                {getStatusLabel(app.status)}
              </Text>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Personal Information</Text>
            <InfoRow label="Full Name" value={app.fullName} />
            <InfoRow label="Email" value={app.email} />
            <InfoRow label="Phone" value={app.phone} />
            <InfoRow label="Date of Birth" value={formatDate(app.dob)} />
            <InfoRow label="Gender" value={app.gender} />
          </View>

          {/* Address */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Address</Text>
            <InfoRow label="Address" value={app.address} />
            <InfoRow label="City" value={app.city} />
            <InfoRow label="State" value={app.state} />
            <InfoRow label="Country" value={app.country} />
            <InfoRow label="Pincode" value={app.pincode} />
          </View>

          {/* Government IDs */}
          {(app.aadhaar || app.pan || app.uan) && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Government IDs</Text>
              {app.aadhaar && (
                <InfoRow label="Aadhaar Number" value={app.aadhaar} />
              )}
              {app.pan && <InfoRow label="PAN Number" value={app.pan} />}
              {app.uan && <InfoRow label="UAN Number" value={app.uan} />}
            </View>
          )}

          {/* Education */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Education</Text>

            <Text style={styles.detailSubTitle}>10th Standard</Text>
            <InfoRow label="Board" value={app.tenthBoard} />
            <InfoRow
              label="Percentage"
              value={app.tenthPercentage ? `${app.tenthPercentage}%` : null}
            />
            <InfoRow label="Year" value={app.tenthYear} />

            <Text style={styles.detailSubTitle}>12th Standard</Text>
            <InfoRow label="Board" value={app.twelfthBoard} />
            <InfoRow
              label="Percentage"
              value={app.twelfthPercentage ? `${app.twelfthPercentage}%` : null}
            />
            <InfoRow label="Year" value={app.twelfthYear} />

            <Text style={styles.detailSubTitle}>Graduation</Text>
            <InfoRow label="College" value={app.graduationCollege} />
            <InfoRow label="Degree" value={app.graduationDegree} />
            <InfoRow
              label="Percentage"
              value={
                app.graduationPercentage ? `${app.graduationPercentage}%` : null
              }
            />
            <InfoRow label="Year" value={app.graduationYear} />

            {(app.postGraduationCollege || app.postGraduationDegree) && (
              <>
                <Text style={styles.detailSubTitle}>Post Graduation</Text>
                <InfoRow label="College" value={app.postGraduationCollege} />
                <InfoRow label="Degree" value={app.postGraduationDegree} />
                <InfoRow
                  label="Percentage"
                  value={
                    app.postGraduationPercentage
                      ? `${app.postGraduationPercentage}%`
                      : null
                  }
                />
                <InfoRow label="Year" value={app.postGraduationYear} />
              </>
            )}
          </View>

          {/* Work Experience */}
          {(app.experienceYears || app.companyName) && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Work Experience</Text>
              <InfoRow
                label="Total Experience"
                value={
                  app.experienceYears
                    ? `${app.experienceYears} years`
                    : "Fresher"
                }
              />
              {app.companyName && (
                <>
                  <InfoRow
                    label="Current/Last Company"
                    value={app.companyName}
                  />
                  <InfoRow label="Role" value={app.companyRole} />
                  <InfoRow
                    label="Start Date"
                    value={formatDate(app.startDate)}
                  />
                  <InfoRow label="End Date" value={formatDate(app.endDate)} />
                </>
              )}
              {app.previousCompany && (
                <>
                  <InfoRow
                    label="Previous Company"
                    value={app.previousCompany}
                  />
                  <InfoRow label="Previous Role" value={app.previousRole} />
                </>
              )}
            </View>
          )}

          {/* Skills */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Skills</Text>
            {app.skills && app.skills.length > 0 && (
              <View style={styles.detailSkillsContainer}>
                {app.skills.map((skill, i) => (
                  <View key={i} style={styles.detailSkillChip}>
                    <Text style={styles.detailSkillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Cover Letter */}
          {app.coverLetter && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Cover Letter</Text>
              <View style={styles.detailCoverBox}>
                <Text style={styles.detailCoverText}>{app.coverLetter}</Text>
              </View>
            </View>
          )}

          {/* Declaration */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Declaration</Text>
            <InfoRow
              label="Terms Accepted"
              value={app.acceptTerms ? "Yes" : "No"}
            />
            <InfoRow
              label="Info Confirmed"
              value={app.confirmInformation ? "Yes" : "No"}
            />
          </View>

          {/* Application Info */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              Application Information
            </Text>
            <InfoRow label="Applied On" value={formatDateTime(app.createdAt)} />
            <InfoRow
              label="Last Updated"
              value={formatDateTime(app.updatedAt)}
            />
            <InfoRow label="Application ID" value={app._id} />
            <InfoRow label="AI Match Score" value={`${app.aiScore || 0}%`} />
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};
