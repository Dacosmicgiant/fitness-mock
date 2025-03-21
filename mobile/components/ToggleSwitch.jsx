// app/components/ToggleSwitch.jsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

const ToggleSwitch = ({ label, value, onToggle }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onToggle(!value)}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.switch, value && styles.switchOn]}>
        <View style={[styles.knob, value && styles.knobOn]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  label: {
    fontSize: 14,
    color: colors.gray,
  },
  switch: {
    width: 50,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    padding: 2,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: colors.primary,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    transform: [{ translateX: 0 }],
  },
  knobOn: {
    transform: [{ translateX: 26 }],
  },
});

export default ToggleSwitch;