import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@/constants/category';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

export default function InterestsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollY = new Animated.Value(0);

  const renderIcon = (interest: any) => {
    if (!interest.iconType || !interest.iconName) return null;

    switch (interest.iconType) {
      case 'ionicons':
        return <Ionicons name={interest.iconName} size={46} color="white" style={styles.icon} />;
      case 'material':
        return <MaterialCommunityIcons name={interest.iconName} size={46} color="white" style={styles.icon} />;
      case 'fa5':
        return <FontAwesome5 name={interest.iconName} size={46} color="white" style={styles.icon} />;
      default:
        return null;
    }
  };

  const handleInterestSelect = (interestId: string) => {
    router.push({
      pathname: '/(tabs)/interests/matches',
      params: {
        interestId,
      }
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  // Scale animation for cards
  const getCardScale = (index: number) => {
    const delay = index * 100;
    const scale = new Animated.Value(0.8);
    
    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      delay,
      useNativeDriver: true,
    }).start();

    return scale;
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Interests</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Interest cards */}
      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {CATEGORIES.map((category, categoryIndex) => (
          <View key={category.id} style={styles.categoryContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{category.title}</Text>
              <Text style={styles.subtitle}>{category.subtitle}</Text>
            </View>

            <View style={styles.interestsGrid}>
              {category.interests.map((interest, interestIndex) => {
                if (!interest.label) return null;
                
                const scale = getCardScale(interestIndex);
                
                return (
                  <Animated.View 
                    key={interest.id} 
                    style={[{ transform: [{ scale }] }]}
                  >
                    <TouchableOpacity
                      style={styles.cardWrapper}
                      activeOpacity={0.8}
                      onPress={() => handleInterestSelect(interest.id)}
                    >
                      <LinearGradient
                        colors={[interest.color, interest.color + '99']} // Add transparency to end color
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                      >
                        <View style={styles.cardContent}>
                          <View style={styles.iconContainer}>
                            {renderIcon(interest)}
                          </View>
                          <Text style={styles.interestLabel}>{interest.label}</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Darker background for more modern look
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40, // Placeholder for balance
  },
  categoryContainer: {
    marginBottom: 28,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  card: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: 0,
  },
  interestLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  countBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
