

export type GENDER = "MALE" | "FEMALE";

export const MappingGender: Record<GENDER, string> = {
    MALE: "Nam",
    FEMALE: "Nữ"
}

export type LOOKING_FOR =
    | "NGUOI_YEU"
    | "HEN_HO_LAU_DAI"
    | "BAT_KI_DIEU_GI_CO_THE"
    | "QUAN_HE_KHONG_RANG_BUOC"
    | "NHUNG_NGUOI_BAN_MOI"
    | "CHUA_RO";

export const MappingLookingFor: Record<LOOKING_FOR, string> = {
    "NGUOI_YEU": "Người yêu",
    "HEN_HO_LAU_DAI": "Hẹn ho lâu dài",
    "BAT_KI_DIEU_GI_CO_THE": "Bất kì điều gì có thể",
    "QUAN_HE_KHONG_RANG_BUOC": "Quan hệ không ràng buộc",
    "NHUNG_NGUOI_BAN_MOI": "Nhưng người bạn mới",
    "CHUA_RO": "Chưa rõ"
}

export type ZODIAC_SIGN =
    | "BachDuong"
    | "KimNguu"
    | "SongTu"
    | "CuGiai"
    | "SuTu"
    | "XuNu"
    | "ThienBinh"
    | "BoCap"
    | "NhanMa"
    | "MaKet"
    | "BaoBinh"
    | "SongNgu";

export const MappingZodiacSign: Record<ZODIAC_SIGN, string> = {
    "BachDuong": "Bạch Dương",
    "KimNguu": "Cựu",
    "SongTu": "Sư Tử",
    "CuGiai": "Cựu",
    "SuTu": "Sư Tử",
    "XuNu": "Xử Nữ",
    "ThienBinh": "Thiên Bình",
    "BoCap": "Bọ Cạp",
    "NhanMa": "Nhân Mã",
    "MaKet": "Mê Kè",
    "BaoBinh": "Bảo Bình",
    "SongNgu": "Song Ngư"
}

export type EDUCATION =
    | "CU_NHAN"
    | "DANG_HOC_DAI_HOC"
    | "THPT"
    | "TIEN_SI"
    | "THAC_SI"
    | "SAU_DAI_HOC"
    | "TRUONG_DAY_NGHE";

export const MappingEducation: Record<EDUCATION, string> = {
    CU_NHAN: "Cử nhân",
    DANG_HOC_DAI_HOC: "Đang học đại học",
    THPT: "THPT",
    TIEN_SI: "Tiến sĩ",
    THAC_SI: "Thạc sĩ",
    SAU_DAI_HOC: "Sau đại học",
    TRUONG_DAY_NGHE: "Trường dạy nghề"
}

export type COMMUNICATION_STYLE =
    | "NGHIEN_NHAN_TIN"
    | "THICH_GOI_DIEN"
    | "THICH_GOI_VIDEO"
    | "IT_NHAN_TIN"
    | "THICH_GAP_MAT_TRUC_TIEP";

export const MappingCommunicationStyle: Record<COMMUNICATION_STYLE, string> = {
    NGHIEN_NHAN_TIN: "Nghiện nhắn tin",
    THICH_GOI_DIEN: "Thích gọi điện",
    THICH_GOI_VIDEO: "Thích gọi video",
    IT_NHAN_TIN: "Ít nhắn tin",
    THICH_GAP_MAT_TRUC_TIEP: "Thích gặp mặt trực tiếp"
}

export type LOVE_LANGUAGE =
    | "NHUNG_HANH_DONG_TINH_TE"
    | "NHUNG_MON_QUA"
    | "NHUNG_CU_CHI_AU_YEM"
    | "NHUNG_LOI_KHEN"
    | "THOI_GIAN_BEN_NHAU";

export const MappingLoveLanguage: Record<LOVE_LANGUAGE, string> = {
    NHUNG_HANH_DONG_TINH_TE: "Nhưng hành động tình tế",
    NHUNG_MON_QUA: "Nhưng món qua",
    NHUNG_CU_CHI_AU_YEM: "Nhưng cử chỉ yêu",
    NHUNG_LOI_KHEN: "Nhưng lời khen",
    THOI_GIAN_BEN_NHAU: "Thời gian bên nhau"
}

export type PETS =
    | "CHO"
    | "MEO"
    | "BO_SAT"
    | "DONG_VAT_LUONG_CU"
    | "LOAI_CHIM"
    | "CA"
    | "RUA"
    | "HAMSTER"
    | "THO"
    | "KHAC"
    | "KHONG_NUOI_THU_CUNG"
    | "MUON_NUOI_THU_CUNG"
    | "DI_UNG_VOI_DONG_VAT";

export const MappingPets: Record<PETS, string> = {
    CHO: "Chó",
    MEO: "Mèo",
    BO_SAT: "Bò sát",
    DONG_VAT_LUONG_CU: "Dòng vật lượng cụ",
    LOAI_CHIM: "Loại chim",
    CA: "Cá",
    RUA: "Rúa",
    HAMSTER: "Hamster",
    THO: "Thỏ",
    KHAC: "Khác",
    KHONG_NUOI_THU_CUNG: "Không nuôi thú cưng",
    MUON_NUOI_THU_CUNG: "Mường muốn nuôi thú cưng",
    DI_UNG_VOI_DONG_VAT: "Đi ứng với động vật"
}

export type ALCOHOL_CONSUMPTION =
    | "KHONG_DANH_CHO_MINH"
    | "LUON_TINH_TAO"
    | "UONG_CO_TRACH_NGHIEM"
    | "CHI_NHUNG_DIP_DAC_BIET"
    | "UONG_GIAO_LUU_VAO_CUOI_TUAN"
    | "HAU_NHU_MOI_TOI";

export const MappingAlcoholConsumption: Record<ALCOHOL_CONSUMPTION, string> = {
    KHONG_DANH_CHO_MINH: "Không uống rượu",
    LUON_TINH_TAO: "Luôn tình tao",
    UONG_CO_TRACH_NGHIEM: "Uống có trách nhiệm",
    CHI_NHUNG_DIP_DAC_BIET: "Chỉ những dịp đặc biệt",
    UONG_GIAO_LUU_VAO_CUOI_TUAN: "Uống giao lưu vào cuối tuần",
    HAU_NHU_MOI_TOI: "Hầu như mọi tối"
}

export type SMOKING_PREFERENCE =
    | "HUT_THUOC_VOI_BAN_BE"
    | "HUT_THUOC_KHI_NHAU"
    | "KHONG_HUT_THUOC"
    | "HUT_THUOC_THUONG_XUYEN"
    | "DANG_CO_GANG_BO";

export const MappingSmokingPreference: Record<SMOKING_PREFERENCE, string> = {
    HUT_THUOC_VOI_BAN_BE: "Hút thuốc với bạn bè",
    HUT_THUOC_KHI_NHAU: "Hút thuốc khi nhậu",
    KHONG_HUT_THUOC: "Không hút thuốc",
    HUT_THUOC_THUONG_XUYEN: "Hút thuốc thường xuyên",
    DANG_CO_GANG_BO: "Đang cố gắng bỏ"
}

export type EXERCISE_FREQUENCY =
    | "HANG_NGAY"
    | "THUONG_XUYEN"
    | "THINH_THOANG"
    | "KHONG_TAP";

export const MappingExercise: Record<EXERCISE_FREQUENCY, string> = {
    HANG_NGAY: "Hàng ngày",
    THUONG_XUYEN: "Thường xuyên",
    THINH_THOANG: "Thỉnh thoảng",
    KHONG_TAP: "Không tập"
}

export type DIETARY_PREFERENCE =
    | "AN_THUAN_CHAY"
    | "AN_CHAY"
    | "CHI_AN_HAI_SAN_RAU_CU"
    | "CHI_AN_THIT"
    | "KHONG_AN_KIENG"
    | "KHAC";

export const MappingDietaryPreference: Record<DIETARY_PREFERENCE, string> = {
    AN_THUAN_CHAY: "Ăn thuần chay",
    AN_CHAY: "Ăn chay",
    CHI_AN_HAI_SAN_RAU_CU: "Chỉ ăn hải sản rau củ",
    CHI_AN_THIT: "Chỉ ăn thịt",
    KHONG_AN_KIENG: "Không ăn kiêng",
    KHAC: "Khác"
}

export type SOCIAL_MEDIA_USAGE =
    | "INFLUENCER"
    | "HOAT_DONG_TICH_CUC"
    | "KHONG_DUNG_MANG"
    | "LUOT_DAO_AM_THAM";

export const MappingSocialMediaUsage: Record<SOCIAL_MEDIA_USAGE, string> = {
    INFLUENCER: "Influencer",
    HOAT_DONG_TICH_CUC: "Hoạt động tích cực",
    KHONG_DUNG_MANG: "Không dùng mạng",
    LUOT_DAO_AM_THAM: "Lượt dạo âm thầm"
}

export type SLEEP_PATTERN =
    | "DAY_SOM"
    | "CU_DEM"
    | "GIO_GIAC_LINH_HOAT";

export const MappingSleepPattern: Record<SLEEP_PATTERN, string> = {
    DAY_SOM: "Dậy sớm",
    CU_DEM: "Cú đêm",
    GIO_GIAC_LINH_HOAT: "Giờ giấc linh hoạt"
}

export type INTEREST =
    | "CHEO_THUYEN"
    | "LAN"
    | "MO_TO_NUOC"
    | "TOUR_DI_BO"
    | "TU_NHIEN"
    | "SUOI_NUOC_NONG"
    | "DAT_CHO_DI_DAO"
    | "CHEO_CANO"
    | "TRUOT_VAN_TUYET"
    | "PHUOT"
    | "DU_LICH_COUCHSURFING"
    | "LAN_TU_DO"
    | "TRUOT_TUYET"
    | "DU_LICH"
    | "CHEO_VAN_SUP"
    | "LUOT_SONG"
    | "BAR_BEN_BO_BIEN"
    | "DU_LUON"
    | "LEO_NUI_DA"
    | "THUYEN_BUOM"
    | "DI_BO_DUONG_TRUONG"
    | "NHUNG_NGON_NUI"
    | "DU_LICH_BUI"
    | "CAU_CA"
    | "CAM_TRANG"
    | "HOAT_DONG_NGOAI_TROI"
    | "DI_PICNIC"
    | "THE_HE_9X"
    | "SU_KIEN_COMIC_CON"
    | "HARRY_POTTER"
    | "NBA"
    | "MLB"
    | "POTTERHEAD"
    | "DUNGEONS_AND_DRAGONS"
    | "MANGA"
    | "MARVEL"
    | "DISNEY"
    | "THE_THAO_DIEN_TU"
    | "PLAYSTATION"
    | "FORTNITE"
    | "XBOX"
    | "LIEN_MINH_HUYEN_THOAI"
    | "ROBLOX"
    | "NINTENDO"
    | "AMONG_US"
    | "ATARI"
    | "QUYEN_CUA_NHOM_LGBTQIA"
    | "CHOI_ESCAPE_ROOM"
    | "QUAN_BAR"
    | "DO_SECONDHAND"
    | "BAO_TANG"
    | "DI_QUAY"
    | "XEM_PHIM_NGOAI_TROI"
    | "LE_HOI"
    | "XE_PHAN_KHOI_LON"
    | "NHAC_KICH"
    | "TRAI_NGHIEM_QUAN_CA_PHE"
    | "THUY_CUNG"
    | "MUA_SAM"
    | "TRIEN_LAM_TRUNG_BAY"
    | "DI_CHILL_TAI_BAR"
    | "TIEC_GIA_DINH"
    | "XE_HOI"
    | "NHAC_KICH_WEST_END"
    | "SAN_KHAU_BROADWAY"
    | "TRO_CAU_DO_TAI_QUAN_RUOU"
    | "QUAN_CAFE"
    | "HAPPY_HOUR"
    | "HAI_DOC_THOAI"
    | "KARAOKE"
    | "NHA_HAT"
    | "SHISHA"
    | "ROLLERSKATING"
    | "NHAC_LIVE"
    | "CHOI_BOWLING"
    | "LIEN_HOAN_PHIM"
    | "QUAN_RUOU"
    | "KHAM_PHA_QUAN_BAR"
    | "TIEC_TUNG"
    | "DI_CHOI_DEM"
    | "LAI_XE_MAY"
    | "TRIEN_LAM_NGHE_THUAT"
    | "HOA_NHAC"
    | "CAC_LE_HOI_TRONG_THANH_PHO"
    | "DIEN_KINH"
    | "BONG_CHUYEN_BAI_BIEN"
    | "JUDO"
    | "VO_MUAY_THAI"
    | "DI_DAO"
    | "THE_THAO_BAI_BIEN"
    | "LOP_THE_DUC_NHOM"
    | "TRUOT_PATIN"
    | "THE_THAO"
    | "QUYEN_ANH"
    | "THE_DUC_DUNG_CU"
    | "BONG_BAU_DUC"
    | "CAU_LONG"
    | "PILATES"
    | "NAM_MON_POI_HOP"
    | "CHEERLEADING"
    | "MUA_COT"
    | "BONG_DA_MINI"
    | "DUA_XE_O_TO"
    | "DUA_MOTOR_THE_THAO"
    | "DUA_XE_DAP"
    | "BODY_COMBAT"
    | "JIU_JITSU"
    | "CHAY_BO"
    | "TRUOT_VAN"
    | "BONG_DA"
    | "QUAN_VOT"
    | "TRUOT_BANG"
    | "HOCKEY"
    | "BONG_RO"
    | "TAP_GYM"
    | "CRICKET"
    | "NANG_TA"
    | "DAU_VAT"
    | "CHAY_MARATHON"
    | "VO_THUAT"
    | "BODY_JAM"
    | "PADEL"
    | "BODY_PUMP"
    | "BODY_STEP"
    | "CUOI_NGUA"
    | "BONG_CHAY"
    | "TENNIS_BAI_BIEN"
    | "DUA_XE_MAY"
    | "THE_DUC_NGHE_THUAT"
    | "BAN_CUNG"
    | "CROSSFIT"
    | "LEO_NUI"
    | "DAP_XE"
    | "BA_MON_POI_HOP"
    | "MEME"
    | "METAVERSE"
    | "TIKTOK"
    | "TWITCH"
    | "NETFLIX"
    | "SANG_TAC_NHAC"
    | "FREELANCE"
    | "NHIEP_ANH"
    | "VU_DIEU_SAMBA"
    | "KHOI_NGHIEP"
    | "HOP_XUONG"
    | "COSPLAY"
    | "SANG_TAO_NOI_DUNG"
    | "HINH_XAM"
    | "DAU_TU"
    | "THOI_TRANG_VINTAGE"
    | "VU_DIEU_VOGUE"
    | "HAT"
    | "THO"
    | "TRIEN_LAM"
    | "DAU_THO"
    | "GIAY_SNEAKER"
    | "GIAO_LUU_NGON_NGU"
    | "CHOI_GUITAR"
    | "VU_DIEU_TANGO"
    | "VE"
    | "VIET"
    | "VAN_HOC"
    | "SON"
    | "UPCYCLING"
    | "CHOI_SAXOPHONE"
    | "NHAY"
    | "CHUONG_TRINH_DU_HOC_TRAO_DOI"
    | "NGHE_THUAT"
    | "FLAMENCO"
    | "TO_CHUC_TU_TRI_PHI_TAP_TRUNG"
    | "BAT_DONG_SAN"
    | "CHOI_TRONG"
    | "NFT"
    | "MUA_BA_LE"
    | "CHOI_DAN_BASS"
    | "ACAPELLA"
    | "NHAC_CU"
    | "VIET_NHAC"
    | "VIET_BLOG"
    | "THOI_TRANG"
    | "TU_LAM_DO_DIY"
    | "CHUNG_KHOAN"
    | "CO_PHIEU"
    | "BOI_BAI_TAROT"
    | "SPA"
    | "CHAM_SOC_BAN_THAN"
    | "PHAT_TRIEN_BAN_THAN"
    | "HOT_YOGA"
    | "THIEN"
    | "CHAM_SOC_DA"
    | "TRANG_DIEM"
    | "VINYASA"
    | "CHIEM_TINH"
    | "DI_XONG_HOI"
    | "CHANH_NIEM"
    | "PHONG_CACH_SONG_NANG_DONG"
    | "TAP_YOGA"
    | "PHIM_TRUYEN_HINH_HAN_QUOC"
    | "RUNNING_MAN"
    | "RAP_VIET"
    | "ANIME"
    | "PHIM_HANH_DONG"
    | "PHIM_HOAT_HINH"
    | "PHIM_TOI_PHAM"
    | "PHIM_VIEN_TUONG"
    | "PHIM_TAI_LIEU"
    | "PHIM_CHINH_KI"
    | "TRUYEN_HINH_THUC_TE"
    | "PHIM_HAI_TINH_CAM"
    | "CHUONG_TRINH_THE_THAO"
    | "PHIM_KINH_DI"
    | "PHIM_INDIE"
    | "BOLLYWOOD"
    | "PHIM_ANH"
    | "HAI_KI"
    | "GROUP_X"
    | "FREELETICS"
    | "THE_DUC_NHIP_DIEU"
    | "BAN_SUNG_THE_THAO"
    | "KARATE"
    | "KHUC_CON_CAU_TREN_BANG"
    | "TAEKWONDO";

export const MappingInterest: Record<INTEREST, string> = {
    CHEO_THUYEN: "Chèo thuyền",
    LAN: "Lặn",
    MO_TO_NUOC: "Mô tô nước",
    TOUR_DI_BO: "Tour đi bộ",
    TU_NHIEN: "Thiên nhiên",
    SUOI_NUOC_NONG: "Suối nước nóng",
    DAT_CHO_DI_DAO: "Đặt chỗ đi dạo",
    CHEO_CANO: "Chèo ca nô",
    TRUOT_VAN_TUYET: "Trượt ván tuyết",
    PHUOT: "Phượt",
    DU_LICH_COUCHSURFING: "Du lịch Couchsurfing",
    LAN_TU_DO: "Lặn tự do",
    TRUOT_TUYET: "Trượt tuyết",
    DU_LICH: "Du lịch",
    CHEO_VAN_SUP: "Chèo ván SUP",
    LUOT_SONG: "Lướt sóng",
    BAR_BEN_BO_BIEN: "Bar bên bờ biển",
    DU_LUON: "Dù lượn",
    LEO_NUI_DA: "Leo núi đá",
    THUYEN_BUOM: "Thuyền buồm",
    DI_BO_DUONG_TRUONG: "Đi bộ đường trường",
    NHUNG_NGON_NUI: "Những ngọn núi",
    DU_LICH_BUI: "Du lịch bụi",
    CAU_CA: "Câu cá",
    CAM_TRANG: "Cắm trại",
    HOAT_DONG_NGOAI_TROI: "Hoạt động ngoài trời",
    DI_PICNIC: "Đi picnic",
    THE_HE_9X: "Thế hệ 9x",
    SU_KIEN_COMIC_CON: "Sự kiện Comic Con",
    HARRY_POTTER: "Harry Potter",
    NBA: "NBA",
    MLB: "MLB",
    POTTERHEAD: "Potterhead",
    DUNGEONS_AND_DRAGONS: "Dungeons & Dragons",
    MANGA: "Manga",
    MARVEL: "Marvel",
    DISNEY: "Disney",
    THE_THAO_DIEN_TU: "Thể thao điện tử",
    PLAYSTATION: "PlayStation",
    FORTNITE: "Fortnite",
    XBOX: "Xbox",
    LIEN_MINH_HUYEN_THOAI: "Liên Minh Huyền Thoại",
    ROBLOX: "Roblox",
    NINTENDO: "Nintendo",
    AMONG_US: "Among Us",
    ATARI: "Atari",
    QUYEN_CUA_NHOM_LGBTQIA: "Quyền của nhóm LGBTQIA+",
    CHOI_ESCAPE_ROOM: "Chơi escape room",
    QUAN_BAR: "Quán bar",
    DO_SECONDHAND: "Đồ secondhand",
    BAO_TANG: "Bảo tàng",
    DI_QUAY: "Đi quẩy",
    XEM_PHIM_NGOAI_TROI: "Xem phim ngoài trời",
    LE_HOI: "Lễ hội",
    XE_PHAN_KHOI_LON: "Xe phân khối lớn",
    NHAC_KICH: "Nhạc kịch",
    TRAI_NGHIEM_QUAN_CA_PHE: "Trải nghiệm quán cà phê",
    THUY_CUNG: "Thủy cung",
    MUA_SAM: "Mua sắm",
    TRIEN_LAM_TRUNG_BAY: "Triển lãm trưng bày",
    DI_CHILL_TAI_BAR: "Đi chill tại bar",
    TIEC_GIA_DINH: "Tiệc gia đình",
    XE_HOI: "Xe hơi",
    NHAC_KICH_WEST_END: "Nhạc kịch West End",
    SAN_KHAU_BROADWAY: "Sân khấu Broadway",
    TRO_CAU_DO_TAI_QUAN_RUOU: "Trò câu đố tại quán rượu",
    QUAN_CAFE: "Quán cafe",
    HAPPY_HOUR: "Happy Hour",
    HAI_DOC_THOAI: "Hài độc thoại",
    KARAOKE: "Karaoke",
    NHA_HAT: "Nhà hát",
    SHISHA: "Shisha",
    ROLLERSKATING: "Rollerskating",
    NHAC_LIVE: "Nhạc live",
    CHOI_BOWLING: "Chơi bowling",
    LIEN_HOAN_PHIM: "Liên hoan phim",
    QUAN_RUOU: "Quán rượu",
    KHAM_PHA_QUAN_BAR: "Khám phá quán bar",
    TIEC_TUNG: "Tiệc tùng",
    DI_CHOI_DEM: "Đi chơi đêm",
    LAI_XE_MAY: "Lái xe máy",
    TRIEN_LAM_NGHE_THUAT: "Triển lãm nghệ thuật",
    HOA_NHAC: "Hòa nhạc",
    CAC_LE_HOI_TRONG_THANH_PHO: "Các lễ hội trong thành phố",
    DIEN_KINH: "Điền kinh",
    BONG_CHUYEN_BAI_BIEN: "Bóng chuyền bãi biển",
    JUDO: "Judo",
    VO_MUAY_THAI: "Võ Muay Thái",
    DI_DAO: "Đi dạo",
    THE_THAO_BAI_BIEN: "Thể thao bãi biển",
    LOP_THE_DUC_NHOM: "Lớp thể dục nhóm",
    TRUOT_PATIN: "Trượt patin",
    THE_THAO: "Thể thao",
    QUYEN_ANH: "Quyền anh",
    THE_DUC_DUNG_CU: "Thể dục dụng cụ",
    BONG_BAU_DUC: "Bóng bầu dục",
    CAU_LONG: "Cầu lông",
    PILATES: "Pilates",
    NAM_MON_POI_HOP: "Năm môn phối hợp",
    CHEERLEADING: "Cheerleading",
    MUA_COT: "Múa cột",
    BONG_DA_MINI: "Bóng đá mini",
    DUA_XE_O_TO: "Đua xe ô tô",
    DUA_MOTOR_THE_THAO: "Đua motor thể thao",
    DUA_XE_DAP: "Đua xe đạp",
    BODY_COMBAT: "Body Combat",
    JIU_JITSU: "Jiu-Jitsu",
    CHAY_BO: "Chạy bộ",
    TRUOT_VAN: "Trượt ván",
    BONG_DA: "Bóng đá",
    QUAN_VOT: "Quần vợt",
    TRUOT_BANG: "Trượt băng",
    HOCKEY: "Hockey",
    BONG_RO: "Bóng rổ",
    TAP_GYM: "Tập gym",
    CRICKET: "Cricket",
    NANG_TA: "Nâng tạ",
    DAU_VAT: "Đấu vật",
    CHAY_MARATHON: "Chạy marathon",
    VO_THUAT: "Võ thuật",
    BODY_JAM: "Body Jam",
    PADEL: "Padel",
    BODY_PUMP: "Body Pump",
    BODY_STEP: "Body Step",
    CUOI_NGUA: "Cưỡi ngựa",
    BONG_CHAY: "Bóng chày",
    TENNIS_BAI_BIEN: "Tennis bãi biển",
    DUA_XE_MAY: "Đua xe máy",
    THE_DUC_NGHE_THUAT: "Thể dục nghệ thuật",
    BAN_CUNG: "Bắn cung",
    CROSSFIT: "CrossFit",
    LEO_NUI: "Leo núi",
    DAP_XE: "Đạp xe",
    BA_MON_POI_HOP: "Ba môn phối hợp",
    MEME: "Meme",
    METAVERSE: "Metaverse",
    TIKTOK: "TikTok",
    TWITCH: "Twitch",
    NETFLIX: "Netflix",
    SANG_TAC_NHAC: "Sáng tác nhạc",
    FREELANCE: "Freelance",
    NHIEP_ANH: "Nhiếp ảnh",
    VU_DIEU_SAMBA: "Vũ điệu Samba",
    KHOI_NGHIEP: "Khởi nghiệp",
    HOP_XUONG: "Hợp xướng",
    COSPLAY: "Cosplay",
    SANG_TAO_NOI_DUNG: "Sáng tạo nội dung",
    HINH_XAM: "Hình xăm",
    DAU_TU: "Đầu tư",
    THOI_TRANG_VINTAGE: "Thời trang vintage",
    VU_DIEU_VOGUE: "Vũ điệu Vogue",
    HAT: "Hát",
    THO: "Thơ",
    TRIEN_LAM: "Triển lãm",
    DAU_THO: "Dầu thô",
    GIAY_SNEAKER: "Giày sneaker",
    GIAO_LUU_NGON_NGU: "Giao lưu ngôn ngữ",
    CHOI_GUITAR: "Chơi guitar",
    VU_DIEU_TANGO: "Vũ điệu Tango",
    VE: "Vẽ",
    VIET: "Viết",
    VAN_HOC: "Văn học",
    SON: "Sơn",
    UPCYCLING: "Upcycling",
    CHOI_SAXOPHONE: "Chơi saxophone",
    NHAY: "Nhảy",
    CHUONG_TRINH_DU_HOC_TRAO_DOI: "Chương trình du học trao đổi",
    NGHE_THUAT: "Nghệ thuật",
    FLAMENCO: "Flamenco",
    TO_CHUC_TU_TRI_PHI_TAP_TRUNG: "Tổ chức tự trị phi tập trung",
    BAT_DONG_SAN: "Bất động sản",
    CHOI_TRONG: "Chơi trống",
    NFT: "NFT",
    MUA_BA_LE: "Múa ba lê",
    CHOI_DAN_BASS: "Chơi đàn bass",
    ACAPELLA: "Acapella",
    NHAC_CU: "Nhạc cụ",
    VIET_NHAC: "Viết nhạc",
    VIET_BLOG: "Viết blog",
    THOI_TRANG: "Thời trang",
    TU_LAM_DO_DIY: "Tự làm đồ (DIY)",
    CHUNG_KHOAN: "Chứng khoán",
    CO_PHIEU: "Cổ phiếu",
    BOI_BAI_TAROT: "Bói bài Tarot",
    SPA: "Spa",
    CHAM_SOC_BAN_THAN: "Chăm sóc bản thân",
    PHAT_TRIEN_BAN_THAN: "Phát triển bản thân",
    HOT_YOGA: "Hot Yoga",
    THIEN: "Thiền",
    CHAM_SOC_DA: "Chăm sóc da",
    TRANG_DIEM: "Trang điểm",
    VINYASA: "Vinyasa",
    CHIEM_TINH: "Chiêm tinh",
    DI_XONG_HOI: "Đi xông hơi",
    CHANH_NIEM: "Chánh niệm",
    PHONG_CACH_SONG_NANG_DONG: "Phong cách sống năng động",
    TAP_YOGA: "Tập Yoga",
    PHIM_TRUYEN_HINH_HAN_QUOC: "Phim truyền hình Hàn Quốc",
    RUNNING_MAN: "Running Man",
    RAP_VIET: "Rap Việt",
    ANIME: "Anime",
    PHIM_HANH_DONG: "Phim hành động",
    PHIM_HOAT_HINH: "Phim hoạt hình",
    PHIM_TOI_PHAM: "Phim tội phạm",
    PHIM_VIEN_TUONG: "Phim viễn tưởng",
    PHIM_TAI_LIEU: "Phim tài liệu",
    PHIM_CHINH_KI: "Phim chính kịch",
    TRUYEN_HINH_THUC_TE: "Truyền hình thực tế",
    PHIM_HAI_TINH_CAM: "Phim hài tình cảm",
    CHUONG_TRINH_THE_THAO: "Chương trình thể thao",
    PHIM_KINH_DI: "Phim kinh dị",
    PHIM_INDIE: "Phim indie",
    BOLLYWOOD: "Bollywood",
    PHIM_ANH: "Phim Anh",
    HAI_KI: "Hài kịch",
    GROUP_X: "Group X",
    FREELETICS: "Freeletics",
    THE_DUC_NHIP_DIEU: "Thể dục nhịp điệu",
    BAN_SUNG_THE_THAO: "Bắn súng thể thao",
    KARATE: "Karate",
    KHUC_CON_CAU_TREN_BANG: "Khúc côn cầu trên băng",
    TAEKWONDO: "Taekwondo"
};
      