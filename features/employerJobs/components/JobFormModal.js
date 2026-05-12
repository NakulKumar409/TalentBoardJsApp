// features/employerJobs/components/JobFormModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { styles } from "../styles/employerStyles";

export const JobFormModal = ({
  visible,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Job" : "Post New Job"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Job Title *"
              placeholderTextColor="#666"
              value={formData.title}
              onChangeText={(t) => setFormData({ ...formData, title: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Profile / Role *"
              placeholderTextColor="#666"
              value={formData.profile}
              onChangeText={(t) => setFormData({ ...formData, profile: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Name *"
              placeholderTextColor="#666"
              value={formData.company}
              onChangeText={(t) => setFormData({ ...formData, company: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#666"
              value={formData.location}
              onChangeText={(t) => setFormData({ ...formData, location: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Salary"
              placeholderTextColor="#666"
              value={formData.salary}
              onChangeText={(t) => setFormData({ ...formData, salary: t })}
            />
            <View style={styles.typeRow}>
              {["Full Time", "Part Time", "Contract", "Internship"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeChip,
                    formData.type === t && styles.typeChipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type: t })}>
                  <Text
                    style={[
                      styles.typeChipText,
                      formData.type === t && styles.typeChipTextActive,
                    ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Skills (comma separated)"
              placeholderTextColor="#666"
              value={formData.skillsRequired}
              onChangeText={(t) =>
                setFormData({ ...formData, skillsRequired: t })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Experience Required"
              placeholderTextColor="#666"
              value={formData.experienceRequired}
              onChangeText={(t) =>
                setFormData({ ...formData, experienceRequired: t })
              }
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Job Description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(t) => setFormData({ ...formData, description: t })}
            />
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
              <Text style={styles.submitBtnText}>
                {isEditing ? "Update Job" : "Post Job"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
