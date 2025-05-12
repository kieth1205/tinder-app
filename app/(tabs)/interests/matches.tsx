import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '@/constants/category';
import { useFocusEffect, useRouter } from 'expo-router';
import TinderCard from 'react-tinder-card';
import { Direction, mapDirectionToSwipeDirection } from '..';
import useVipStatus from '@/hooks/useVipStatus';
import { useGetInterestMatches } from '@/hooks/use-get-matches';
import swipeService from '@/services/swipeService';
import { TinderCard as TinderCardCustom } from "@/components/features";

const alreadyRemoved: string[] = [];

const InterestMatchesScreen = () => {
  const router = useRouter();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { interestId } = route.params as { interestId: string };

  const [interest, setInterest] = useState<any>(null);

  const { data: matchesData, isLoading, refetch, error } = useGetInterestMatches(interestId);

  const [characters, setCharacters] = useState<any[]>([]);
  const [highlightedButton, setHighlightedButton] = useState<Direction | null>(null);

  const { isVip, refreshVipStatus } = useVipStatus();

  useFocusEffect(
    React.useCallback(() => {
      refreshVipStatus();
      refetch();
    }, [refreshVipStatus, refetch])
  );

  // Cập nhật danh sách người dùng khi matchesData thay đổi
  useEffect(() => {
    if (matchesData) {
      setCharacters(matchesData);
    }
  }, [matchesData]);

  // Tạo refs dựa trên số lượng người dùng
  const childRefs = useMemo(() => {
    return Array(characters.length)
      .fill(0)
      .map(() => React.createRef());
  }, [characters.length]);

  const swiped = async (direction: Direction, nameToDelete: string) => {
    // Kiểm tra nếu người dùng không phải VIP và đang cố gắng super like
    if (direction === "up" && !isVip) {
      Alert.alert(
        "Tính năng dành cho VIP",
        "Bạn cần nâng cấp tài khoản VIP để sử dụng tính năng Super Like.",
        [{ text: "Đã hiểu", style: "default" }]
      );
      return;
    }

    alreadyRemoved.push(nameToDelete);
    setHighlightedButton(direction); // Highlight button based on swipe direction

    // Tìm người dùng có tên này để lấy ID
    const user = characters.find((character) => character.name === nameToDelete);
    if (user && user.id) {
      try {
        // Gọi API swipe với hướng vuốt tương ứng
        const apiDirection = mapDirectionToSwipeDirection(direction);
        const response = await swipeService.createSwipe(user.id, apiDirection);

        // Nếu có match thì hiển thị thông báo
        if (response.match) {
          Alert.alert(
            "Đã Match! 🎉",
            `Bạn và ${nameToDelete} đã thích nhau.`,
            [{ text: "Được", style: "default" }]
          );
        }
      } catch (error) {
        console.error("Error while swiping:", error);
      }
    } else {
      console.warn("User ID not found for:", nameToDelete);
    }
  };

  const outOfFrame = (name: string) => {
    setCharacters((prevChars) => prevChars.filter(character => character.name !== name));
    setHighlightedButton(null);
  };

  const swipe = (dir: Direction) => {
    // Kiểm tra nếu người dùng không phải VIP và đang cố gắng super like
    if (dir === "up" && !isVip) {
      Alert.alert(
        "Tính năng dành cho VIP",
        "Bạn cần nâng cấp tài khoản VIP để sử dụng tính năng Super Like.",
        [{ text: "Đã hiểu", style: "default" }]
      );
      return;
    }

    const cardsLeft = characters.filter(
      (person) => !alreadyRemoved.includes(person.name)
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name;
      const index = characters.findIndex((person) => person.name === toBeRemoved);
      if (index !== -1 && childRefs[index] && childRefs[index].current) {
        alreadyRemoved.push(toBeRemoved);
        (childRefs[index].current as any).swipe(dir);
      }
    }
  };

  const onSwipeWillStart = (dir: Direction) => {
    // Kiểm tra nếu người dùng không phải VIP và đang cố gắng super like
    if (dir === "up" && !isVip) {
      // Không cập nhật highlightedButton cho super like nếu không phải VIP
      return;
    }
    setHighlightedButton(dir);
  };

  useEffect(() => {
    // Tìm kiếm thông tin sở thích từ danh sách để hiển thị tiêu đề
    for (const category of CATEGORIES) {
      const found = category.interests.find(item => item.id === interestId);
      if (found) {
        setInterest(found);
        break;
      }
    }
  }, [interestId]);

  const handleGoBack = () => {
    router.push('/(tabs)/interests/index');
  };

  const allSwiped = matchesData && matchesData.length > 0 && matchesData.every(character => alreadyRemoved.includes(character.name));

  if (allSwiped) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Bạn đã quẹt hết tất cả người dùng</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              alreadyRemoved.length = 0;
              refetch();
            }}
          >
            <Text style={styles.refreshButtonText}>Tải lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.titleText}>
            {interest ? interest.label : 'Người dùng theo sở thích'}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6864" />
          <Text style={styles.loadingText}>Đang tải danh sách người dùng...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6864" />
          <Text style={styles.errorText}>{error?.message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              refetch();
            }}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : matchesData?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>Không tìm thấy người dùng nào với sở thích này.</Text>
          <Text style={styles.emptySubtext}>Hãy thử tìm kiếm với sở thích khác.</Text>
        </View>
      ) : (
        <>
          <View style={styles.cardContainer}>
            {characters.map((character, index) => (
              <TinderCard
                ref={childRefs[index] as any}
                key={character.id}
                onSwipe={(dir) => swiped(dir as Direction, character.name)}
                onCardLeftScreen={() => outOfFrame(character.name)}
                onSwipeRequirementFulfilled={(dir) => {
                  onSwipeWillStart(dir as Direction);
                }}
                onSwipeRequirementUnfulfilled={() => setHighlightedButton(null)} // Đặt lại nếu vuốt bị hủy
              >
                <TinderCardCustom character={character} />
              </TinderCard>
            ))}
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                styles.dislikeButton,
                highlightedButton === "left" && styles.activeIcon, // Làm nổi bật nếu vuốt sang trái
                highlightedButton === "right" && { opacity: 0 }, // Ẩn khi vuốt sang phải
                highlightedButton === "up" && { opacity: 0 }, // Ẩn khi vuốt lên trên
              ]}
              onPress={() => swipe("left")}
            >
              <Ionicons name="close" size={36} color="white" />
            </TouchableOpacity>
            {
              isVip && (
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    styles.superLikeButton,
                    highlightedButton === "up" && styles.activeIcon, // Làm nổi bật nếu vuốt lên trên
                    highlightedButton === "right" && { opacity: 0 }, // Ẩn khi vuốt sang phải
                    highlightedButton === "left" && { opacity: 0 }, // Ẩn khi vuốt sang trái
                  ]}
                  onPress={() => swipe("up")}
                >
                  <Ionicons name="star" size={36} color="white" />
                </TouchableOpacity>
              )
            }
            <TouchableOpacity
              style={[
                styles.iconButton,
                styles.likeButton,
                highlightedButton === "right" && styles.activeIcon, // Làm nổi bật nếu vuốt sang phải
                highlightedButton === "left" && { opacity: 0 }, // Ẩn khi vuốt sang trái
                highlightedButton === "up" && { opacity: 0 }, // Ẩn khi vuốt lên trên
              ]}
              onPress={() => swipe("right")}
            >
              <Ionicons name="heart" size={36} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  userList: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDistance: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#bbb',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6864',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 20,
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
  },
  cardContainer: {
    width: "100%",
    height: 550,
  },
  card: {
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
    height: 500,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: "cover",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  cardTitle: {
    position: "absolute",
    bottom: 0,
    margin: 10,
    color: "#fff",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 20,
    backgroundColor: "transparent",
  },
  iconButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  dislikeButton: {
    backgroundColor: "#FF6B6B",
  },
  likeButton: {
    backgroundColor: "#2ECC71",
  },
  superLikeButton: {
    backgroundColor: "#3498DB",
  },
  infoText: {
    height: 28,
    justifyContent: "center",
    display: "flex",
    marginTop: 10,
  },
  activeIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default InterestMatchesScreen;
