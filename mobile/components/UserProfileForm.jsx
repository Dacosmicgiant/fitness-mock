// app/components/UserProfileForm.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

const UserProfileForm = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSubmit = () => {
    onUpdate({ name, email });
  };

  return (
    <View style={styles.form}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: colors.white,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
export default UserProfileForm;