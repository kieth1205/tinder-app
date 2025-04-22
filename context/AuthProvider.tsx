import { ReactNode, createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { router, useSegments } from "expo-router";
import api, { getAuthToken, isAuthenticated, removeAuthToken, saveAuthTokens } from "@/services/api";
import { Alert } from "react-native";

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
};

type AuthProvider = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

function useProtectedRoute(user: User | null, loading: boolean, checkAuth: () => Promise<boolean>) {
  const segments = useSegments();

  // Kiểm tra xác thực khi app khởi động và điều hướng phù hợp
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();

      // Sau khi hoàn thành kiểm tra xác thực, điều hướng đến màn hình phù hợp
      if (isAuth) {
        // Đã đăng nhập -> chuyển đến màn home
        if (segments[0] !== "(tabs)") {
          router.replace("/(tabs)");
        }
      } else {
        // Chưa đăng nhập -> chuyển đến màn welcome
        if (segments[0] !== "(auth)" && segments[0] !== undefined) {
          console.log("Chưa đăng nhập -> chuyển đến màn welcome")
          router.replace("/(auth)");
        }
      }
    };

    verifyAuth();
  }, []);

  // Theo dõi thay đổi trạng thái người dùng và điều hướng
  useEffect(() => {
    const inAuthGroup = segments[0] === "(tabs)";

    // Nếu đang tải, không điều hướng
    if (loading) return;

    // Nếu chưa đăng nhập và đang ở nhóm tabs cần xác thực
    if (!user && inAuthGroup) {
      console.log("Not logged in, redirecting to login")
      router.replace("/(auth)");
    }
    // Nếu đã đăng nhập và không ở nhóm tabs (trừ trường hợp chưa điều hướng)
    else if (user && !inAuthGroup && segments[0] !== undefined) {
      console.log("user && !inAuthGroup && segments[0] !== undefined")
      router.replace("/(tabs)");
    }
  }, [user, segments, loading]);
}

export const AuthContext = createContext<AuthProvider>({
  user: null,
  loading: false,
  login: async () => false,
  logout: async () => { },
  checkAuth: async () => false,
});

export function useAuth() {
  if (!useContext(AuthContext)) {
    throw new Error("useAuth must be used within a <AuthProvider />");
  }

  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password }, { requireAuth: false });
      // const response = {
      //   data: {
      //     accessToken: "1",
      //     refreshToken: "2",
      //     user: {
      //       id: "1",
      //       email: "test@gmail.com",
      //       name: "test",
      //       avatar: "https://images.unsplash.com/photo-1506794778202-254834971119?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      //       bio: "Funny"
      //     }
      //   }
      // }

      if (response.data && response.data.accessToken && response.data.refreshToken && response.data.user) {
        // Lưu tokens
        await saveAuthTokens(response.data.accessToken, response.data.refreshToken);

        // Lưu thông tin người dùng trực tiếp từ response
        setUser(response.data.user);
        return true;
      } else {
        Alert.alert("Lỗi đăng nhập", "Tài khoản hoặc mật khẩu không đúng");
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập";
      Alert.alert("Lỗi đăng nhập", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin người dùng hiện tại
  const checkAuth = async () => {
    try {
      console.log("check auth")

      setLoading(true);

      // Kiểm tra token
      const isAuth = await isAuthenticated();

      console.log("isAuth", isAuth)

      if (!isAuth) {
        setUser(null);
        return false;
      }

      // Gọi API kiểm tra thông tin người dùng
      const response = await api.get('/auth/me');

      if (response.data && response.data.user) {
        setUser(response.data.user);
        return true;
      } else {
        // Token không hợp lệ
        setUser(null);
        await removeAuthToken();
        return false;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      await removeAuthToken();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Xóa token và thông tin người dùng
      await removeAuthToken();
      setUser(null);
      router.replace("/(auth)");
    }
  };

  useProtectedRoute(user, loading, checkAuth);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}