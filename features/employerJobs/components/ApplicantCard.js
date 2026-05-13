// features/employerJobs/components/ApplicantCard.js
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Linking,
  Alert,
  Dimensions,
} from "react-native";
import { styles } from "../styles/employerStyles";
import { getStatusColor, getStatusLabel } from "../utils/helpers";

const { width, height } = Dimensions.get("window");

export const ApplicantCard = ({
  app,
  jobTitle,
  onViewDetails,
  onStatusUpdate,
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLinkPress = async (url, type) => {
    if (!url || url === "") {
      Alert.alert("Not Available", `${type} link not provided`);
      return;
    }
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    const supported = await Linking.canOpenURL(formattedUrl);
    if (supported) {
      await Linking.openURL(formattedUrl);
    } else {
      Alert.alert("Error", `Cannot open ${type} link`);
    }
  };

  const InfoRow = ({ label, value }) => (
    <View style={styles.fullInfoItem}>
      <Text style={styles.fullInfoLabel}>{label}</Text>
      <Text style={styles.fullInfoValue}>{value || "N/A"}</Text>
    </View>
  );

  return (
    <>
      {/* Card Preview - Mobile Optimized */}
      <View style={styles.appCard}>
        <View style={styles.appCardHeader}>
          <View style={styles.appCardAvatar}>
            <Text style={styles.appCardAvatarText}>
              {(app.fullName || app.name || "C")[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.appCardInfo}>
            <Text style={styles.appName} numberOfLines={1}>
              {app.fullName || app.name || "Candidate"}
            </Text>
            <Text style={styles.appRole} numberOfLines={1}>
              {jobTitle}
            </Text>
            <Text style={styles.appEmail} numberOfLines={1}>
              {app.email}
            </Text>
          </View>
        </View>

        <View style={styles.appCardDivider} />

        <View style={styles.appCardRow}>
          <Ionicons name="call-outline" size={14} color="#888" />
          <Text style={styles.appPhone} numberOfLines={1}>
            {app.phone || "Phone not provided"}
          </Text>
        </View>

        {app.coverLetter ? (
          <View style={styles.coverBox}>
            <Text style={styles.coverLabel}>Cover Letter</Text>
            <Text style={styles.coverText} numberOfLines={2}>
              {app.coverLetter}
            </Text>
          </View>
        ) : null}

        <View style={styles.appCardFooter}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(app.status) + "20" },
            ]}>
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(app.status) },
              ]}>
              {getStatusLabel(app.status)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => setShowFullDetails(true)}>
            <Text style={styles.viewBtnText}>View Full Details</Text>
          </TouchableOpacity>
        </View>

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
                  style={[
                    styles.statusActionText,
                    { color: getStatusColor(s) },
                  ]}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {/* Full Details Modal - Mobile Optimized */}
      <Modal
        visible={showFullDetails}
        animationType="slide"
        transparent={false}
        presentationStyle="fullScreen">
        <View style={styles.modalContainer}>
          {/* Header - Fixed at top */}
          <View style={styles.fullDetailHeader}>
            <TouchableOpacity
              onPress={() => setShowFullDetails(false)}
              style={styles.fullDetailBackBtn}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.fullDetailTitle}>Application</Text>
            <TouchableOpacity
              onPress={() => setShowFullDetails(false)}
              style={styles.fullDetailCloseBtn}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.fullDetailScrollContent}>
            {/* Profile Header */}
            <View style={styles.fullProfileHeader}>
              <View style={styles.fullProfileAvatar}>
                <Text style={styles.fullProfileAvatarText}>
                  {(app.fullName || app.name || "C")[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.fullProfileInfo}>
                <Text style={styles.fullProfileName}>
                  {app.fullName || app.name}
                </Text>
                <Text style={styles.fullProfileEmail}>{app.email}</Text>
                <View style={styles.fullProfileStatus}>
                  <View
                    style={[
                      styles.statusBadgeSmall,
                      { backgroundColor: getStatusColor(app.status) + "20" },
                    ]}>
                    <Text
                      style={[
                        styles.statusTextSmall,
                        { color: getStatusColor(app.status) },
                      ]}>
                      {getStatusLabel(app.status)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Job Details */}
            {app.jobId && (
              <View style={styles.fullSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons
                    name="briefcase-outline"
                    size={18}
                    color="#7C3AED"
                  />
                  <Text style={styles.fullSectionTitle}>Job Details</Text>
                </View>
                <View style={styles.fullInfoGrid}>
                  <InfoRow label="Position" value={app.jobId.title} />
                  <InfoRow label="Company" value={app.jobId.company} />
                  <InfoRow label="Location" value={app.jobId.location} />
                  <InfoRow label="Salary" value={app.jobId.salary} />
                  <InfoRow label="Job Type" value={app.jobId.type} />
                </View>
              </View>
            )}

            {/* Personal Information */}
            <View style={styles.fullSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="person-outline" size={18} color="#7C3AED" />
                <Text style={styles.fullSectionTitle}>
                  Personal Information
                </Text>
              </View>
              <View style={styles.fullInfoGrid}>
                <InfoRow label="Full Name" value={app.fullName || app.name} />
                <InfoRow label="Email" value={app.email} />
                <InfoRow label="Phone" value={app.phone} />
                <InfoRow label="Date of Birth" value={formatDate(app.dob)} />
                <InfoRow label="Gender" value={app.gender} />
              </View>
            </View>

            {/* Address */}
            <View style={styles.fullSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="location-outline" size={18} color="#7C3AED" />
                <Text style={styles.fullSectionTitle}>Address</Text>
              </View>
              <View style={styles.fullInfoGrid}>
                <InfoRow label="Address" value={app.address} />
                <InfoRow label="City" value={app.city} />
                <InfoRow label="State" value={app.state} />
                <InfoRow label="Country" value={app.country} />
                <InfoRow label="Pincode" value={app.pincode} />
              </View>
            </View>

            {/* ID Proofs */}
            {(app.aadhaar || app.pan || app.uan) && (
              <View style={styles.fullSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="card-outline" size={18} color="#7C3AED" />
                  <Text style={styles.fullSectionTitle}>Government IDs</Text>
                </View>
                <View style={styles.fullInfoGrid}>
                  <InfoRow label="Aadhaar Number" value={app.aadhaar} />
                  <InfoRow label="PAN Number" value={app.pan} />
                  <InfoRow label="UAN Number" value={app.uan} />
                </View>
              </View>
            )}

            {/* Education */}
            <View style={styles.fullSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="school-outline" size={18} color="#7C3AED" />
                <Text style={styles.fullSectionTitle}>Education</Text>
              </View>

              <Text style={styles.fullSubTitle}>10th Standard</Text>
              <View style={styles.fullInfoGrid}>
                <InfoRow label="Board" value={app.tenthBoard} />
                <InfoRow
                  label="Percentage"
                  value={app.tenthPercentage ? `${app.tenthPercentage}%` : null}
                />
                <InfoRow label="Year" value={app.tenthYear} />
              </View>

              <Text style={styles.fullSubTitle}>12th Standard</Text>
              <View style={styles.fullInfoGrid}>
                <InfoRow label="Board" value={app.twelfthBoard} />
                <InfoRow
                  label="Percentage"
                  value={
                    app.twelfthPercentage ? `${app.twelfthPercentage}%` : null
                  }
                />
                <InfoRow label="Year" value={app.twelfthYear} />
              </View>

              <Text style={styles.fullSubTitle}>Graduation</Text>
              <View style={styles.fullInfoGrid}>
                <InfoRow label="College" value={app.graduationCollege} />
                <InfoRow label="Degree" value={app.graduationDegree} />
                <InfoRow
                  label="Percentage"
                  value={
                    app.graduationPercentage
                      ? `${app.graduationPercentage}%`
                      : null
                  }
                />
                <InfoRow label="Year" value={app.graduationYear} />
              </View>

              {(app.postGraduationCollege || app.postGraduationDegree) && (
                <>
                  <Text style={styles.fullSubTitle}>Post Graduation</Text>
                  <View style={styles.fullInfoGrid}>
                    <InfoRow
                      label="College"
                      value={app.postGraduationCollege}
                    />
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
                  </View>
                </>
              )}
            </View>

            {/* Work Experience */}
            {(app.experienceYears ||
              app.companyName ||
              app.previousCompany) && (
              <View style={styles.fullSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="business-outline" size={18} color="#7C3AED" />
                  <Text style={styles.fullSectionTitle}>Experience</Text>
                </View>
                <View style={styles.fullInfoGrid}>
                  <InfoRow
                    label="Total Experience"
                    value={
                      app.experienceYears
                        ? `${app.experienceYears} years`
                        : null
                    }
                  />

                  {app.companyName && (
                    <>
                      <InfoRow
                        label="Current Company"
                        value={app.companyName}
                      />
                      <InfoRow label="Role" value={app.companyRole} />
                      <InfoRow
                        label="Start Date"
                        value={formatDate(app.startDate)}
                      />
                      <InfoRow
                        label="End Date"
                        value={formatDate(app.endDate)}
                      />
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
              </View>
            )}

            {/* Skills */}
            <View style={styles.fullSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="code-outline" size={18} color="#7C3AED" />
                <Text style={styles.fullSectionTitle}>Skills</Text>
              </View>

              {app.skills && app.skills.length > 0 && (
                <View style={styles.fullSkillsWrapper}>
                  <Text style={styles.fullSkillsLabel}>Technical Skills:</Text>
                  <View style={styles.fullSkillsList}>
                    {app.skills.map((skill, i) => (
                      <View key={i} style={styles.fullSkillChip}>
                        <Text style={styles.fullSkillChipText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {app.topSkills && app.topSkills.length > 0 && (
                <View style={styles.fullSkillsWrapper}>
                  <Text style={styles.fullSkillsLabel}>Top Skills:</Text>
                  <View style={styles.fullSkillsList}>
                    {app.topSkills.map((skill, i) => (
                      <View
                        key={i}
                        style={[styles.fullSkillChip, styles.fullSkillChipTop]}>
                        <Text
                          style={[
                            styles.fullSkillChipText,
                            styles.fullSkillChipTopText,
                          ]}>
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Professional Links */}
            {(app.github || app.linkedin || app.portfolio) && (
              <View style={styles.fullSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="link-outline" size={18} color="#7C3AED" />
                  <Text style={styles.fullSectionTitle}>Links</Text>
                </View>
                <View style={styles.fullInfoGrid}>
                  {app.github && (
                    <TouchableOpacity
                      onPress={() => handleLinkPress(app.github, "GitHub")}>
                      <View style={styles.fullInfoItem}>
                        <Text style={styles.fullInfoLabel}>GitHub</Text>
                        <Text style={styles.fullInfoLink} numberOfLines={1}>
                          {app.github}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {app.linkedin && (
                    <TouchableOpacity
                      onPress={() => handleLinkPress(app.linkedin, "LinkedIn")}>
                      <View style={styles.fullInfoItem}>
                        <Text style={styles.fullInfoLabel}>LinkedIn</Text>
                        <Text style={styles.fullInfoLink} numberOfLines={1}>
                          {app.linkedin}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {app.portfolio && (
                    <TouchableOpacity
                      onPress={() =>
                        handleLinkPress(app.portfolio, "Portfolio")
                      }>
                      <View style={styles.fullInfoItem}>
                        <Text style={styles.fullInfoLabel}>Portfolio</Text>
                        <Text style={styles.fullInfoLink} numberOfLines={1}>
                          {app.portfolio}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Cover Letter */}
            {app.coverLetter && (
              <View style={styles.fullSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#7C3AED"
                  />
                  <Text style={styles.fullSectionTitle}>Cover Letter</Text>
                </View>
                <View style={styles.fullCoverBox}>
                  <Text style={styles.fullCoverText}>{app.coverLetter}</Text>
                </View>
              </View>
            )}

            {/* Declaration */}
            <View style={styles.fullSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#7C3AED"
                />
                <Text style={styles.fullSectionTitle}>Declaration</Text>
              </View>
              <View style={styles.fullInfoGrid}>
                <InfoRow
                  label="Terms Accepted"
                  value={app.acceptTerms ? "Yes" : "No"}
                />
                <InfoRow
                  label="Info Confirmed"
                  value={app.confirmInformation ? "Yes" : "No"}
                />
              </View>
            </View>

            {/* Application Info */}
            <View style={styles.fullSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#7C3AED"
                />
                <Text style={styles.fullSectionTitle}>Application Info</Text>
              </View>
              <View style={styles.fullInfoGrid}>
                <InfoRow
                  label="Applied On"
                  value={formatDateTime(app.createdAt)}
                />
                <InfoRow
                  label="Last Updated"
                  value={formatDateTime(app.updatedAt)}
                />
                <View style={styles.fullInfoItem}>
                  <Text style={styles.fullInfoLabel}>AI Score</Text>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.fullInfoScore}>
                      {app.aiScore || 0}%
                    </Text>
                    <View style={styles.scoreBar}>
                      <View
                        style={[
                          styles.scoreFill,
                          { width: `${app.aiScore || 0}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Status Update */}
            <View style={styles.fullSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="refresh-outline" size={18} color="#7C3AED" />
                <Text style={styles.fullSectionTitle}>Update Status</Text>
              </View>
              <View style={styles.fullStatusButtons}>
                {["reviewed", "shortlisted", "hired", "rejected"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.fullStatusBtn,
                      { backgroundColor: getStatusColor(s) },
                      app.status?.toLowerCase() === s &&
                        styles.fullStatusBtnActive,
                    ]}
                    onPress={() => {
                      onStatusUpdate(app._id, s);
                      setShowFullDetails(false);
                    }}>
                    <Text style={styles.fullStatusBtnText}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};
