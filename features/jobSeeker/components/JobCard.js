// features/jobSeeker/components/JobCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/userStyles";

export const JobCard = ({ job, onViewDetails, onApply }) => {
  return (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{job.title || job.profile}</Text>
      <Text style={styles.jobCompany}>{job.company}</Text>
      <View style={styles.tagsRow}>
        <View style={styles.tag}><Text style={styles.tagText}>{job.type || "Full Time"}</Text></View>
        <View style={styles.tag}><Text style={styles.tagText}>{job.location || "Remote"}</Text></View>
        {job.salary && <View style={styles.tag}><Text style={styles.tagText}>{job.salary}</Text></View>}
      </View>
      {job.skillsRequired?.length > 0 && (
        <View style={styles.skillsRow}>
          {job.skillsRequired.slice(0, 3).map((skill, i) => (
            <View key={i} style={styles.skillTag}><Text style={styles.skillText}>{skill}</Text></View>
          ))}
        </View>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.detailsBtn} onPress={onViewDetails}>
          <Text style={styles.detailsBtnText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};