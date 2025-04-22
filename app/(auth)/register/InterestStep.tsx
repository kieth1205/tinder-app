import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRegistration } from "@/context/RegistrationContext";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";
import { INTEREST } from "@/types";
import { STEPS, TOTAL_STEPS } from "./_layout";

// Define interest options with friendly display names
export const interests: { id: INTEREST, name: string }[] = [
  { id: "CHEO_THUYEN", name: "Chèo Thuyền" },
  { id: "LAN", name: "Lặn" },
  { id: "MO_TO_NUOC", name: "Mô Tô Nước" },
  { id: "TOUR_DI_BO", name: "Tour Đi Bộ" },
  { id: "TU_NHIEN", name: "Tự Nhiên" },
  { id: "SUOI_NUOC_NONG", name: "Suối Nước Nóng" },
  { id: "DAT_CHO_DI_DAO", name: "Đặt Chỗ Đi Dạo" },
  { id: "CHEO_CANO", name: "Chèo Cano" },
  { id: "TRUOT_VAN_TUYET", name: "Trượt Ván Tuyết" },
  { id: "PHUOT", name: "Phượt" },
  { id: "DU_LICH_COUCHSURFING", name: "Du Lịch Couchsurfing" },
  { id: "LAN_TU_DO", name: "Lặn Tự Do" },
  { id: "TRUOT_TUYET", name: "Trượt Tuyết" },
  { id: "DU_LICH", name: "Du Lịch" },
  { id: "CHEO_VAN_SUP", name: "Chèo Ván SUP" },
  { id: "LUOT_SONG", name: "Lướt Sóng" },
  { id: "BAR_BEN_BO_BIEN", name: "Bar Bên Bờ Biển" },
  { id: "DU_LUON", name: "Dù Lượn" },
  { id: "LEO_NUI_DA", name: "Leo Núi Đá" },
  { id: "THUYEN_BUOM", name: "Thuyền Buồm" },
  { id: "DI_BO_DUONG_TRUONG", name: "Đi Bộ Đường Trường" },
  { id: "NHUNG_NGON_NUI", name: "Những Ngọn Núi" },
  { id: "DU_LICH_BUI", name: "Du Lịch Bụi" },
  { id: "CAU_CA", name: "Câu Cá" },
  { id: "CAM_TRANG", name: "Cắm Trại" },
  { id: "HOAT_DONG_NGOAI_TROI", name: "Hoạt Động Ngoài Trời" },
  { id: "DI_PICNIC", name: "Đi Picnic" },
  { id: "THE_HE_9X", name: "Thế Hệ 9X" },
  { id: "SU_KIEN_COMIC_CON", name: "Sự Kiện Comic Con" },
  { id: "HARRY_POTTER", name: "Harry Potter" },
  { id: "NBA", name: "NBA" },
  { id: "MLB", name: "MLB" },
  { id: "POTTERHEAD", name: "Potterhead" },
  { id: "DUNGEONS_AND_DRAGONS", name: "Dungeons and Dragons" },
  { id: "MANGA", name: "Manga" },
  { id: "MARVEL", name: "Marvel" },
  { id: "DISNEY", name: "Disney" },
  { id: "THE_THAO_DIEN_TU", name: "Thể Thao Điện Tử" },
  { id: "PLAYSTATION", name: "PlayStation" },
  { id: "FORTNITE", name: "Fortnite" },
  { id: "XBOX", name: "Xbox" },
  { id: "LIEN_MINH_HUYEN_THOAI", name: "Liên Minh Huyền Thoại" },
  { id: "ROBLOX", name: "Roblox" },
  { id: "NINTENDO", name: "Nintendo" },
  { id: "AMONG_US", name: "Among Us" },
  { id: "ATARI", name: "Atari" },
  { id: "QUYEN_CUA_NHOM_LGBTQIA", name: "Quyền Của Nhóm LGBTQIA+" },
  { id: "CHOI_ESCAPE_ROOM", name: "Chơi Escape Room" },
  { id: "QUAN_BAR", name: "Quán Bar" },
  { id: "DO_SECONDHAND", name: "Đồ Secondhand" },
  { id: "BAO_TANG", name: "Bảo Tàng" },
  { id: "DI_QUAY", name: "Đi Quẩy" },
  { id: "XEM_PHIM_NGOAI_TROI", name: "Xem Phim Ngoài Trời" },
  { id: "LE_HOI", name: "Lễ Hội" },
  { id: "XE_PHAN_KHOI_LON", name: "Xe Phân Khối Lớn" },
  { id: "NHAC_KICH", name: "Nhạc Kịch" },
  { id: "TRAI_NGHIEM_QUAN_CA_PHE", name: "Trải Nghiệm Quán Cà Phê" },
  { id: "THUY_CUNG", name: "Thủy Cung" },
  { id: "MUA_SAM", name: "Mua Sắm" },
  { id: "TRIEN_LAM_TRUNG_BAY", name: "Triển Lãm Trưng Bày" },
  { id: "DI_CHILL_TAI_BAR", name: "Đi Chill Tại Bar" },
  { id: "TIEC_GIA_DINH", name: "Tiệc Gia Đình" },
  { id: "XE_HOI", name: "Xe Hơi" },
  { id: "NHAC_KICH_WEST_END", name: "Nhạc Kịch West End" },
  { id: "SAN_KHAU_BROADWAY", name: "Sân Khấu Broadway" },
  { id: "TRO_CAU_DO_TAI_QUAN_RUOU", name: "Trò Câu Đố Tại Quán Rượu" },
  { id: "QUAN_CAFE", name: "Quán Cafe" },
  { id: "HAPPY_HOUR", name: "Happy Hour" },
  { id: "HAI_DOC_THOAI", name: "Hài Độc Thoại" },
  { id: "KARAOKE", name: "Karaoke" },
  { id: "NHA_HAT", name: "Nhà Hát" },
  { id: "SHISHA", name: "Shisha" },
  { id: "ROLLERSKATING", name: "Rollerskating" },
  { id: "NHAC_LIVE", name: "Nhạc Live" },
  { id: "CHOI_BOWLING", name: "Chơi Bowling" },
  { id: "LIEN_HOAN_PHIM", name: "Liên Hoan Phim" },
  { id: "QUAN_RUOU", name: "Quán Rượu" },
  { id: "KHAM_PHA_QUAN_BAR", name: "Khám Phá Quán Bar" },
  { id: "TIEC_TUNG", name: "Tiệc Tùng" },
  { id: "DI_CHOI_DEM", name: "Đi Chơi Đêm" },
  { id: "LAI_XE_MAY", name: "Lái Xe Máy" },
  { id: "TRIEN_LAM_NGHE_THUAT", name: "Triển Lãm Nghệ Thuật" },
  { id: "HOA_NHAC", name: "Hòa Nhạc" },
  { id: "CAC_LE_HOI_TRONG_THANH_PHO", name: "Các Lễ Hội Trong Thành Phố" },
  { id: "DIEN_KINH", name: "Điền Kinh" },
  { id: "BONG_CHUYEN_BAI_BIEN", name: "Bóng Chuyền Bãi Biển" },
  { id: "JUDO", name: "Judo" },
  { id: "VO_MUAY_THAI", name: "Võ Muay Thái" },
  { id: "DI_DAO", name: "Đi Dạo" },
  { id: "THE_THAO_BAI_BIEN", name: "Thể Thao Bãi Biển" },
  { id: "LOP_THE_DUC_NHOM", name: "Lớp Thể Dục Nhóm" },
  { id: "TRUOT_PATIN", name: "Trượt Patin" },
  { id: "THE_THAO", name: "Thể Thao" },
  { id: "QUYEN_ANH", name: "Quyền Anh" },
  { id: "THE_DUC_DUNG_CU", name: "Thể Dục Dụng Cụ" },
  { id: "BONG_BAU_DUC", name: "Bóng Bầu Dục" },
  { id: "CAU_LONG", name: "Cầu Lông" },
  { id: "PILATES", name: "Pilates" },
  { id: "NAM_MON_POI_HOP", name: "Năm Môn Phối Hợp" },
  { id: "CHEERLEADING", name: "Cheerleading" },
  { id: "MUA_COT", name: "Múa Cột" },
  { id: "BONG_DA_MINI", name: "Bóng Đá Mini" },
  { id: "DUA_XE_O_TO", name: "Đua Xe Ô Tô" },
  { id: "DUA_MOTOR_THE_THAO", name: "Đua Motor Thể Thao" },
  { id: "DUA_XE_DAP", name: "Đua Xe Đạp" },
  { id: "BODY_COMBAT", name: "Body Combat" },
  { id: "JIU_JITSU", name: "Jiu Jitsu" },
  { id: "CHAY_BO", name: "Chạy Bộ" },
  { id: "TRUOT_VAN", name: "Trượt Ván" },
  { id: "BONG_DA", name: "Bóng Đá" },
  { id: "QUAN_VOT", name: "Quần Vợt" },
  { id: "TRUOT_BANG", name: "Trượt Băng" },
  { id: "HOCKEY", name: "Hockey" },
  { id: "BONG_RO", name: "Bóng Rổ" },
  { id: "TAP_GYM", name: "Tập Gym" },
  { id: "CRICKET", name: "Cricket" },
  { id: "NANG_TA", name: "Nâng Tạ" },
  { id: "DAU_VAT", name: "Đấu Vật" },
  { id: "CHAY_MARATHON", name: "Chạy Marathon" },
  { id: "VO_THUAT", name: "Võ Thuật" },
  { id: "BODY_JAM", name: "Body Jam" },
  { id: "PADEL", name: "Padel" },
  { id: "BODY_PUMP", name: "Body Pump" },
  { id: "BODY_STEP", name: "Body Step" },
  { id: "CUOI_NGUA", name: "Cưỡi Ngựa" },
  { id: "BONG_CHAY", name: "Bóng Chày" },
  { id: "TENNIS_BAI_BIEN", name: "Tennis Bãi Biển" },
  { id: "DUA_XE_MAY", name: "Đua Xe Máy" },
  { id: "THE_DUC_NGHE_THUAT", name: "Thể Dục Nghệ Thuật" },
  { id: "BAN_CUNG", name: "Bắn Cung" },
  { id: "CROSSFIT", name: "CrossFit" },
  { id: "LEO_NUI", name: "Leo Núi" },
  { id: "DAP_XE", name: "Đạp Xe" },
  { id: "BA_MON_POI_HOP", name: "Ba Môn Phối Hợp" },
  { id: "MEME", name: "Meme" },
  { id: "METAVERSE", name: "Metaverse" },
  { id: "TIKTOK", name: "TikTok" },
  { id: "TWITCH", name: "Twitch" },
  { id: "NETFLIX", name: "Netflix" },
  { id: "SANG_TAC_NHAC", name: "Sáng Tác Nhạc" },
  { id: "FREELANCE", name: "Freelance" },
  { id: "NHIEP_ANH", name: "Nhiếp Ảnh" },
  { id: "VU_DIEU_SAMBA", name: "Vũ Điệu Samba" },
  { id: "KHOI_NGHIEP", name: "Khởi Nghiệp" },
  { id: "HOP_XUONG", name: "Họp Xuông" },
  { id: "COSPLAY", name: "Cosplay" },
  { id: "SANG_TAO_NOI_DUNG", name: "Sáng Tạo Nội Dung" },
  { id: "HINH_XAM", name: "Hình Xăm" },
  { id: "DAU_TU", name: "Đầu Tư" },
  { id: "THOI_TRANG_VINTAGE", name: "Thời Trang Vintage" },
  { id: "VU_DIEU_VOGUE", name: "Vũ Điệu Vogue" },
  { id: "HAT", name: "Hát" },
  { id: "THO", name: "Thơ" },
  { id: "TRIEN_LAM", name: "Triển Lãm" },
  { id: "DAU_THO", name: "Đấu Thơ" },
  { id: "GIAY_SNEAKER", name: "Giày Sneaker" },
  { id: "GIAO_LUU_NGON_NGU", name: "Giao Lưu Ngôn Ngữ" },
  { id: "CHOI_GUITAR", name: "Chơi Guitar" },
  { id: "VU_DIEU_TANGO", name: "Vũ Điệu Tango" },
  { id: "VE", name: "Vẽ" },
  { id: "VIET", name: "Viết" },
  { id: "VAN_HOC", name: "Văn Học" },
  { id: "SON", name: "Sơn" },
  { id: "UPCYCLING", name: "Upcycling" },
  { id: "CHOI_SAXOPHONE", name: "Chơi Saxophone" },
  { id: "NHAY", name: "Nhảy" },
  { id: "CHUONG_TRINH_DU_HOC_TRAO_DOI", name: "Chương Trình Du Học Trao Đổi" },
  { id: "NGHE_THUAT", name: "Nghệ Thuật" },
  { id: "FLAMENCO", name: "Flamenco" },
  { id: "TO_CHUC_TU_TRI_PHI_TAP_TRUNG", name: "Tổ Chức Tự Trị Phi Tập Trung" },
  { id: "BAT_DONG_SAN", name: "Bất Động Sản" },
  { id: "CHOI_TRONG", name: "Chơi Trống" },
  { id: "NFT", name: "NFT" },
  { id: "MUA_BA_LE", name: "Múa Ba Lê" },
  { id: "CHOI_DAN_BASS", name: "Chơi Đàn Bass" },
  { id: "ACAPELLA", name: "Acapella" },
  { id: "NHAC_CU", name: "Nhạc Cụ" },
  { id: "VIET_NHAC", name: "Viết Nhạc" },
  { id: "VIET_BLOG", name: "Viết Blog" },
  { id: "THOI_TRANG", name: "Thời Trang" },
  { id: "TU_LAM_DO_DIY", name: "Tự Làm Đồ DIY" },
  { id: "CHUNG_KHOAN", name: "Chứng Khoán" },
  { id: "CO_PHIEU", name: "Cổ Phiếu" },
  { id: "BOI_BAI_TAROT", name: "Bói Bài Tarot" },
  { id: "SPA", name: "Spa" },
  { id: "CHAM_SOC_BAN_THAN", name: "Chăm Sóc Bản Thân" },
  { id: "PHAT_TRIEN_BAN_THAN", name: "Phát Triển Bản Thân" },
  { id: "HOT_YOGA", name: "Hot Yoga" },
  { id: "THIEN", name: "Thiền" },
  { id: "CHAM_SOC_DA", name: "Chăm Sóc Da" },
  { id: "TRANG_DIEM", name: "Trang Điểm" },
  { id: "VINYASA", name: "Vinyasa" },
  { id: "CHIEM_TINH", name: "Chiêm Tinh" },
  { id: "DI_XONG_HOI", name: "Đi Xông Hơi" },
  { id: "CHANH_NIEM", name: "Chánh Niệm" },
  { id: "PHONG_CACH_SONG_NANG_DONG", name: "Phong Cách Sống Năng Động" },
  { id: "TAP_YOGA", name: "Tập Yoga" },
  { id: "PHIM_TRUYEN_HINH_HAN_QUOC", name: "Phim Truyền Hình Hàn Quốc" },
  { id: "RUNNING_MAN", name: "Running Man" },
  { id: "RAP_VIET", name: "Rap Việt" },
  { id: "ANIME", name: "Anime" },
  { id: "PHIM_HANH_DONG", name: "Phim Hành Động" },
  { id: "PHIM_HOAT_HINH", name: "Phim Hoạt Hình" },
  { id: "PHIM_TOI_PHAM", name: "Phim Tội Phạm" },
  { id: "PHIM_VIEN_TUONG", name: "Phim Viễn Tưởng" },
  { id: "PHIM_TAI_LIEU", name: "Phim Tài Liệu" },
  { id: "PHIM_CHINH_KI", name: "Phim Chính Kịch" },
  { id: "TRUYEN_HINH_THUC_TE", name: "Truyền Hình Thực Tế" },
  { id: "PHIM_HAI_TINH_CAM", name: "Phim Hài Tình Cảm" },
  { id: "CHUONG_TRINH_THE_THAO", name: "Chương Trình Thể Thao" },
  { id: "PHIM_KINH_DI", name: "Phim Kinh Dị" },
  { id: "PHIM_INDIE", name: "Phim Indie" },
  { id: "BOLLYWOOD", name: "Bollywood" },
  { id: "PHIM_ANH", name: "Phim Anh" },
  { id: "HAI_KI", name: "Hài Kịch" },
  { id: "GROUP_X", name: "Group X" },
  { id: "FREELETICS", name: "Freeletics" },
  { id: "THE_DUC_NHIP_DIEU", name: "Thể Dục Nhịp Điệu" },
  { id: "BAN_SUNG_THE_THAO", name: "Bắn Súng Thể Thao" },
  { id: "KARATE", name: "Karate" },
  { id: "KHUC_CON_CAU_TREN_BANG", name: "Khúc Côn Cầu Trên Băng" },
  { id: "TAEKWONDO", name: "Taekwondo" }
];

const InterestStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [selectedInterests, setSelectedInterests] = useState<INTEREST[]>(registrationData.interests || []);
  const MAX_SELECTIONS = 5;

  // Update local state when context changes
  useEffect(() => {
    if (registrationData.interests) {
      setSelectedInterests(registrationData.interests);
    }
  }, [registrationData.interests]);

  const toggleInterest = (id: INTEREST) => {
    if (selectedInterests.includes(id)) {
      // Remove interest if already selected
      const updated = selectedInterests.filter(interest => interest !== id);
      setSelectedInterests(updated);
      updateRegistrationData('interests', updated);
    } else {
      // Add interest if not at max limit
      if (selectedInterests.length >= MAX_SELECTIONS) {
        Alert.alert('Đã đạt giới hạn', 'Bạn chỉ có thể chọn tối đa 5 sở thích');
        return;
      }
      const updated = [...selectedInterests, id];
      setSelectedInterests(updated);
      updateRegistrationData('interests', updated);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={STEPS.InterestStep} totalSteps={TOTAL_STEPS} />
      <AuthHeader
        onBack={() => router.back()}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bạn thích điều gì?</Text>
        <Text style={styles.subtitle}>
          Bạn có những sở thích của mình. Giờ hãy cho mọi người cùng biết nhé.
        </Text>
        <Text style={styles.selectionCount}>
          {selectedInterests.length}/{MAX_SELECTIONS} sở thích đã chọn
        </Text>
      </View>

      {/* Interest tags */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.interestsContainer}>
          {interests.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.interestButton,
                selectedInterests.includes(item.id) && styles.selectedOption,
              ]}
              onPress={() => toggleInterest(item.id)}
            >
              <Text
                style={[
                  styles.interestText,
                  selectedInterests.includes(item.id) && styles.selectedOptionText
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={() => {
              if (selectedInterests.length > 0) {
                router.push("/register/PhotosStep");
              } else {
                Alert.alert('Chọn sở thích', 'Hãy chọn ít nhất một sở thích');
              }
            }}
            disabled={!selectedInterests.length}
            title="Tiếp tục"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  selectionCount: {
    fontSize: 14,
    color: "#FF4458",
    fontWeight: "500",
    marginTop: 5,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  interestButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: "#f3f3f3",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedOption: {
    backgroundColor: "#FF4458",
    borderColor: "#FF4458",
  },
  interestText: {
    fontSize: 14,
    color: "#666",
  },
  selectedOptionText: {
    color: "#fff",
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default InterestStep;
