// app/components/Pagination.jsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import colors from '../constants/colors';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentPage === 0 && styles.disabledButton]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageInfo}>
        {currentPage + 1} / {totalPages}
      </Text>
      <TouchableOpacity
        style={[styles.button, currentPage === totalPages - 1 && styles.disabledButton]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  button: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default Pagination;