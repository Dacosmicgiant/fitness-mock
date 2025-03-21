// app/subscription.jsx
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import colors from '../constants/colors';
import useAuthStore from '../stores/authStore';
import SubscriptionCard from '../../components/SubscriptionCard';
import PaymentForm from '../components/PaymentForm';

const SubscriptionScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const plansResponse = await axios.get(
        'http://your-backend-url/api/subscriptions/plans', // Replace with your endpoint
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const subResponse = await axios.get(
        'http://your-backend-url/api/subscriptions/current', // Replace with your endpoint
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPlans(plansResponse.data);
      setCurrentSubscription(subResponse.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId) => {
    const plan = plans.find(p => p._id === planId);
    setSelectedPlan(plan);
  };

  const handlePayment = async (paymentDetails) => {
    try {
      const response = await axios.post(
        'http://your-backend-url/api/subscriptions/subscribe', // Replace with your endpoint
        paymentDetails,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setCurrentSubscription(response.data);
      setSelectedPlan(null);
      alert('Subscription successful!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription</Text>
      </View>
      <ScrollView style={styles.content}>
        {currentSubscription && (
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Current Subscription</Text>
            <Text style={styles.statusText}>
              Plan: {currentSubscription.planName} • Expires: {new Date(currentSubscription.expiresAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Plans</Text>
          {plans.map((plan) => (
            <SubscriptionCard
              key={plan._id}
              plan={plan}
              isActive={currentSubscription?.planId === plan._id}
              onSelect={handlePlanSelect}
            />
          ))}
        </View>

        {selectedPlan && (
          <PaymentForm plan={selectedPlan} onSubmit={handlePayment} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusSection: {
    marginBottom: 25,
  },
  plansSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    color: colors.gray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubscriptionScreen;