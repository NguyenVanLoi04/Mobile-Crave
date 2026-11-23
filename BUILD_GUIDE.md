# Hướng Dẫn Chi Tiết Build Ứng Dụng Crave Mobile (Expo & React Native)

Tài liệu này hướng dẫn chi tiết từ A-Z cách chạy thử nghiệm (Development), tạo gói cài đặt thử nghiệm (Testing/Preview APK), và đóng gói phát hành (Production AAB/IPA) cho ứng dụng di động **Crave** sử dụng **Expo** (SDK 58) và **React Native**.

---

## 📑 Mục Lục
1. [Yêu Cầu Môi Trường (Prerequisites)](#1-yêu-cầu-môi-trường-prerequisites)
2. [Chạy Thử Nghiệm Trong Quá Trình Phát Triển (Development)](#2-chạy-thử-nghiệm-trong-quá-trình-phát-triển-development)
3. [Build Ứng Dụng Qua EAS Build (Khuyên Dùng - Cloud Build)](#3-build-ứng-dụng-qua-eas-build-khuyên-dùng---cloud-build)
   - [3.1. Cài đặt & Đăng nhập EAS](#31-cài-đặt--đăng-nhập-eas)
   - [3.2. Build file APK Android (Cài trực tiếp lên điện thoại)](#32-build-file-apk-android-cài-trực-tiếp-lên-điện-thoại)
   - [3.3. Build file AAB Android (Phát hành lên Google Play)](#33-build-file-aab-android-phát-hành-lên-google-play)
   - [3.4. Build file iOS (TestFlight / App Store)](#34-build-file-ios-testflight--app-store)
4. [Build Ứng Dụng Local Trên Máy Của Bạn (Không Cần Cloud)](#4-build-ứng-dụng-local-trên-máy-của-bạn-không-cần-cloud)
5. [Cấu Hình Ứng Dụng (app.json & eas.json)](#5-cấu-hình-ứng-dụng-appjson--easjson)
6. [Khắc Phục Sự Cố Thường Gặp (Troubleshooting)](#6-khắc-phục-sự-cố-thường-gặp-troubleshooting)

---

## 1. Yêu Cầu Môi Trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt:
* **Node.js**: Phiên bản LTS khuyến nghị `Node.js >= 18.x` hoặc `20.x` ([Tải tại nodejs.org](https://nodejs.org/)).
* **npm** (đi kèm Node) hoặc **yarn/pnpm**.
* **Git**: Dùng để quản lý mã nguồn.
* **Điện thoại thật**:
  * Android: Tải app **Expo Go** từ Google Play Store.
  * iOS: Tải app **Expo Go** từ App Store.

Kiểm tra phiên bản trong terminal:
```bash
node -v
npm -v
```

Cài đặt các gói phụ thuộc dự án (nếu mới clone dự án):
```bash
cd d:\Crave\Mobile_Crave
npm install
```

---

## 2. Chạy Thử Nghiệm Trong Quá Trình Phát Triển (Development)

### Cách 1: Chạy với Expo Dev Server (Mặc định)
Khởi động máy chủ Metro Bundler:
```bash
npm run start
# hoặc: npx expo start -c (xoá cache sạch sẽ)
```
* **Trên Android**: Mở app **Expo Go** trên điện thoại, chọn **Scan QR code** và quét mã QR hiển thị trên màn hình terminal.
* **Trên iOS**: Mở ứng dụng **Camera** mặc định của iPhone, quét mã QR và chọn mở bằng **Expo Go**.

### Cách 2: Kết nối khi khác mạng Wi-Fi (Chế độ Tunnel)
Nếu điện thoại và máy tính không dùng chung mạng Wi-Fi, hoặc mạng công ty/quán cafe chặn port nội bộ:
```bash
npm run tunnel
# hoặc: npx expo start --tunnel
```

### Cách 3: Chạy trên Giả lập (Emulator / Simulator)
* Giả lập Android (Android Studio): Nhấn phím `a` trên terminal hoặc chạy:
  ```bash
  npm run android
  ```
* Giả lập iOS (Xcode - Chỉ trên macOS): Nhấn phím `i` trên terminal hoặc chạy:
  ```bash
  npm run ios
  ```
* Trình duyệt Web: Nhấn phím `w` hoặc chạy:
  ```bash
  npm run web
  ```

---

## 3. Build Ứng Dụng Qua EAS Build (Khuyên Dùng - Cloud Build)

**EAS (Expo Application Services)** là giải pháp chính thức và tối ưu nhất của Expo. 
* **Ưu điểm**:
  * Build hoàn toàn trên server đám mây của Expo (không làm nóng máy, không tốn RAM).
  * **Người dùng Windows vẫn build được file iOS** mà không cần máy tính Mac.
  * Tự động quản lý Keystore (Android) và Certificates/Provisioning Profile (Apple).

---

### 3.1. Cài đặt & Đăng nhập EAS
Cài đặt công cụ dòng lệnh EAS CLI toàn cục:
```bash
npm install -g eas-cli
```

Đăng nhập tài khoản Expo (nếu chưa có, đăng ký miễn phí tại [expo.dev](https://expo.dev)):
```bash
eas login
```

Khởi tạo dự án trên tài khoản Expo của bạn (chỉ cần chạy lần đầu):
```bash
eas project:init
```

---

### 3.2. Build file APK Android (Cài trực tiếp lên điện thoại)
Để gửi file cài đặt cho khách hàng, tester hoặc tự cài lên máy Android của mình mà **không cần thông qua Google Play**:
```bash
eas build -p android --profile preview
```
* Khi được hỏi tạo Keystore: Nhấn **Yes** để EAS tự động tạo và lưu trữ an toàn.
* Quá trình build mất khoảng 5–10 phút trên cloud.
* Sau khi hoàn tất, terminal sẽ trả về **Đường link tải file `.apk`** và mã QR để quét tải trực tiếp về điện thoại.

---

### 3.3. Build file AAB Android (Phát hành lên Google Play)
Google Play Store bắt buộc định dạng **Android App Bundle (`.aab`)**:
```bash
eas build -p android --profile production
```
Sau khi hoàn tất, tải file `.aab` về để tải lên Google Play Console.

---

### 3.4. Build file iOS (TestFlight / App Store)
*(Yêu cầu tài khoản Apple Developer Program $99/năm để ký chứng chỉ)*

* **Bản xem trước nội bộ (Internal Testing / Simulator)**:
  ```bash
  eas build -p ios --profile preview
  ```
* **Bản phát hành App Store / TestFlight**:
  ```bash
  eas build -p ios --profile production
  ```
EAS sẽ tự động hướng dẫn bạn đăng nhập Apple ID để tạo Certificate và Provisioning Profile hợp lệ.

---

## 4. Build Ứng Dụng Local Trên Máy Của Bạn (Không Cần Cloud)

Nếu máy tính của bạn đã cài sẵn **Android Studio, Android SDK và JDK 17**, bạn có thể build trực tiếp trên máy mà không cần mạng Internet.

### Bước 1: Xuất mã nguồn Native (Prebuild)
Lệnh này sẽ tạo thư mục gốc native `android/` và `ios/`:
```bash
npx expo prebuild
```

### Bước 2: Build file APK Android cục bộ
Vào thư mục Android và chạy Gradle:
* **Trên Windows PowerShell**:
  ```powershell
  cd android
  .\gradlew assembleRelease
  ```
* **Trên macOS / Linux**:
  ```bash
  cd android
  ./gradlew assembleRelease
  ```

File APK đầu ra sẽ nằm tại đường dẫn:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 5. Cấu Hình Ứng Dụng (app.json & eas.json)

Dự án đã được cấu hình sẵn 2 file cốt lõi:

### 1. `app.json`
Định danh gói ứng dụng (Package Name) và thông số kỹ thuật:
```json
{
  "expo": {
    "name": "Crave",
    "slug": "crave",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/logo.png",
    "ios": {
      "bundleIdentifier": "com.crave.app"
    },
    "android": {
      "package": "com.crave.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/logo.png",
        "backgroundColor": "#00478D"
      }
    }
  }
}
```

### 2. `eas.json`
Cấu hình các môi trường build:
```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true,
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

---

## 6. Khắc Phục Sự Cố Thường Gặp (Troubleshooting)

| Lỗi thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| **Expo Go báo lỗi `Network response timed out`** | Khác mạng Wi-Fi hoặc tường lửa Windows chặn cổng 8081. | Chạy lệnh `npm run tunnel` để kết nối qua cloud tunnel. |
| **Giao diện không cập nhật sau khi đổi code** | Cache Metro cũ bị giữ lại. | Tắt terminal và chạy `npx expo start -c` để xoá cache. |
| **EAS Build báo lỗi thiếu package/bundleIdentifier** | Chưa cấu hình tên định danh ứng dụng. | Kiểm tra lại `app.json` đã có `"package": "com.crave.app"`. |
| **Local build Android báo lỗi Java Version** | React Native mới yêu cầu Java 17. | Cài đặt OpenJDK 17 và trỏ biến môi trường `JAVA_HOME`. |
| **Lỗi `TypeError` hoặc import không nhận** | Mã TypeScript chưa được biên dịch kiểm tra. | Chạy `npx tsc --noEmit` để xác định chính xác dòng bị lỗi. |

---

> 💡 **Mẹo**: Để tạo bản cài đặt nhanh nhất cho sếp/khách hàng/bạn bè dùng thử ngay hôm nay trên Android, hãy mở terminal và chạy đúng một dòng lệnh:
> ```bash
> eas build -p android --profile preview
> ```
