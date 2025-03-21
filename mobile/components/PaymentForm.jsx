// app/components/PaymentForm.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

const PaymentForm = ({ onSubmit, plan }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePayment = () => {
    // Basic validation
    if (!cardNumber || !expiry || !cvc) {
      alert('Please fill in all payment details');
      return;
    }
    onSubmit({ cardNumber, expiry, cvc, planId: plan._id });
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Payment Details for {plan.name}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
        />
      </View>
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Expiry</Text>
          <TextInput
            style={styles.input}
            value={expiry}
            onChangeText={setExpiry}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>CVC</Text>
          <TextInput
            style={styles.input}
            value={cvc}
            onChangeText={setCvc}
            placeholder="123"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay ${plan.price}</Text>
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
  title: {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PaymentForm;