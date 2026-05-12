// features/employerJobs/components/JobCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/employerStyles";

export const JobCard = ({ job, showActions, onEdit, onDelete }) => {
  return (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{job.title}</Text>
      <Text style={styles.jobCompany}>{job.company}</Text>
      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{job.type || "Full Time"}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{job.location || "Remote"}</Text>
        </View>
        {job.salary && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{job.salary}</Text>
          </View>
        )}
      </View>
      {job.skillsRequired?.length > 0 && (
        <View style={styles.skillsRow}>
          {job.skillsRequired.slice(0, 3).map((s, i) => (
            <View key={i} style={styles.skillTag}>
              <Text style={styles.skillText}>{s}</Text>
            </View>
          ))}
        </View>
      )}
      {showActions && (
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
