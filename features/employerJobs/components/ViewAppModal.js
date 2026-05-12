// features/employerJobs/components/ViewAppModal.js
import React from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../styles/employerStyles";
import { getStatusColor, getStatusLabel } from "../utils/helpers";

export const ViewAppModal = ({ visible, onClose, selectedApp }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: "85%" }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Application Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {selectedApp && (
              <>
                <View style={styles.appDetailHeader}>
                  <View style={styles.appDetailAvatar}>
                    <Text style={styles.appDetailAvatarText}>
                      {(selectedApp.fullName || selectedApp.name || "?")[0]}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.appDetailName}>
                      {selectedApp.fullName || selectedApp.name}
                    </Text>
                    <Text style={styles.appDetailEmail}>
                      {selectedApp.email}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Contact</Text>
                  <Text style={styles.detailText}>
                    Email: {selectedApp.email}
                  </Text>
                  {selectedApp.phone && (
                    <Text style={styles.detailText}>
                      Phone: {selectedApp.phone}
                    </Text>
                  )}
                </View>
                {selectedApp.coverLetter && (
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Cover Letter</Text>
                    <View style={styles.coverFull}>
                      <Text style={styles.coverFullText}>
                        {selectedApp.coverLetter}
                      </Text>
                    </View>
                  </View>
                )}
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        alignSelf: "flex-start",
                        backgroundColor:
                          getStatusColor(selectedApp.status) + "20",
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(selectedApp.status) },
                      ]}>
                      {getStatusLabel(selectedApp.status)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
