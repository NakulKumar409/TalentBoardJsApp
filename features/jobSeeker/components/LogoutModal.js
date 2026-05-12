// features/jobSeeker/components/LogoutModal.js
import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { styles } from "../styles/userStyles";

export const LogoutModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.confirmModal}>
          <Text style={styles.confirmTitle}>Confirm Logout</Text>
          <Text style={styles.confirmText}>
            Are you sure you want to logout?
          </Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity
              style={[styles.confirmBtn, styles.cancelConfirmBtn]}
              onPress={onClose}>
              <Text style={styles.cancelConfirmText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, styles.logoutConfirmBtn]}
              onPress={onConfirm}>
              <Text style={styles.logoutConfirmText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
