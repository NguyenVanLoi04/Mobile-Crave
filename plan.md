# CRAVE – OPENSTREETMAP API DOCUMENTATION

**Product:** Crave – Food Discovery App  
**Version:** 1.0  
**Date:** November 2026  
**Data provider:** OpenStreetMap  
**Mobile:** Expo React Native + TypeScript  
**Architecture:** Client-first, no custom backend for MVP

---

# 1. Tổng quan

## 1.1. OpenStreetMap là gì?

OpenStreetMap (OSM) là dự án bản đồ mở, được xây dựng và cập nhật bởi cộng đồng trên toàn thế giới.

OSM cung cấp dữ liệu địa lý như:

- Nhà hàng, quán ăn, quán cà phê.
- Đường phố, địa chỉ, khu vực.
- Cửa hàng, siêu thị, địa điểm công cộng.
- Tọa độ địa lý.
- Một số thông tin bổ sung như loại hình kinh doanh, giờ mở cửa, website, số điện thoại và cuisine.

Website: https://www.openstreetmap.org/

Dữ liệu OSM được phát hành theo giấy phép Open Database License (ODbL).

## 1.2. OSM có thay thế Google Places API được không?

Có thể thay thế một phần, nhưng không tương đương hoàn toàn.

| Dữ liệu | Google Places | OpenStreetMap |
|---|---|---|
| Tên nhà hàng | Có | Có nếu được đóng góp |
| Tọa độ | Có | Có |
| Địa chỉ | Có | Có thể có |
| Loại hình quán | Có | Có qua tags |
| Cuisine | Không phải lúc nào cũng có | Có nếu được đóng góp |
| Rating | Có | Không có rating chuẩn |
| Review | Có | Không có hệ thống review chuẩn |
| Ảnh nhà hàng | Có thể có | Không có hệ thống ảnh chuẩn tương đương |
| Số điện thoại | Có thể có | Có nếu được đóng góp |
| Website | Có thể có | Có nếu được đóng góp |
| Giờ mở cửa | Có thể có | Có nếu được đóng góp |
| Menu | Không đảm bảo | Không đảm bảo |

**Kết luận:** OSM phù hợp để xây dựng tính năng tìm kiếm và khám phá địa điểm. Những thông tin như rating, review, menu và ảnh cần nguồn dữ liệu bổ sung hoặc hệ thống riêng của Crave.

---

# 2. Kiến trúc API

Crave sử dụng ba dịch vụ chính:

| Service | Vai trò | Endpoint |
|---|---|---|
| Overpass API | Tìm địa điểm theo khu vực và loại hình | `https://overpass-api.de/api/interpreter` |
| Nominatim | Tìm kiếm địa chỉ, reverse geocoding | `https://nominatim.openstreetmap.org` |
| OpenStreetMap Tiles | Hiển thị bản đồ nền | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` |

MapLibre React Native được sử dụng để render bản đồ.

## 2.1. Luồng hoạt động

1. Người dùng cấp quyền vị trí.
2. Expo Location lấy latitude và longitude.
3. Crave gửi tọa độ và bán kính đến Overpass API.
4. Overpass trả về các địa điểm phù hợp.
5. Crave chuẩn hóa dữ liệu thành Restaurant.
6. Ứng dụng tính khoảng cách và áp dụng bộ lọc.
7. Hiển thị kết quả trên danh sách hoặc bản đồ.
8. Người dùng mở chi tiết nhà hàng.

---

# 3. Overpass API – Tìm kiếm nhà hàng

## 3.1. Vai trò

Overpass API cho phép truy vấn dữ liệu OpenStreetMap theo điều kiện.

Đây là API quan trọng nhất của Crave vì nó phục vụ:

- Tìm nhà hàng gần vị trí người dùng.
- Tìm quán cà phê.
- Tìm quán ăn nhanh.
- Tìm địa điểm theo loại hình.
- Tìm địa điểm trong bán kính xác định.

Endpoint:

`POST https://overpass-api.de/api/interpreter`

Không cần API Key đối với public instance.

## 3.2. Các loại địa điểm có thể tìm kiếm

OSM sử dụng hệ thống key-value tags.

| OSM tag | Ý nghĩa | Crave category |
|---|---|---|
| `amenity=restaurant` | Nhà hàng | Restaurant |
| `amenity=cafe` | Quán cà phê | Cafe |
| `amenity=fast_food` | Đồ ăn nhanh | Fast Food |
| `amenity=food_court` | Khu ẩm thực | Food Court |
| `amenity=ice_cream` | Cửa hàng kem | Ice Cream |
| `amenity=bar` | Quán bar | Bar |
| `shop=bakery` | Tiệm bánh | Bakery |
| `shop=pastry` | Tiệm bánh ngọt | Bakery |
| `shop=tea` | Cửa hàng trà | Tea |

Lưu ý: Không phải mọi địa điểm đều có đầy đủ tags. Một số quán ăn có thể chỉ được gắn một loại tag.

## 3.3. API tìm nhà hàng gần vị trí người dùng

Ví dụ: tìm nhà hàng, quán cà phê và đồ ăn nhanh trong bán kính 3km quanh trung tâm TP.HCM.

**Request**

Method: `POST`

URL:

`https://overpass-api.de/api/interpreter`

Header:

`Content-Type: application/x-www-form-urlencoded`

Body (form-urlencoded):

```text
data=[out:json][timeout:25];
(
  nwr["amenity"~"^(restaurant|cafe|fast_food|food_court|ice_cream)$"]
  (around:3000,10.7769,106.7009);
);
out center tags;
```

Trong đó:

- `around:3000`: bán kính 3.000 mét.
- `10.7769`: latitude.
- `106.7009`: longitude.
- `nwr`: tìm node, way và relation.
- `out center tags`: trả về tags và tọa độ center đối với way/relation.

**Response mẫu**

```json
{
  "version": 0.6,
  "elements": [
    {
      "type": "node",
      "id": 123456789,
      "lat": 10.7771,
      "lon": 106.7012,
      "tags": {
        "name": "Example Restaurant",
        "amenity": "restaurant",
        "cuisine": "vietnamese",
        "addr:street": "Nguyen Hue",
        "phone": "+842812345678",
        "opening_hours": "Mo-Su 08:00-22:00"
      }
    }
  ]
}
```

Response trên chỉ minh họa cấu trúc, không phải dữ liệu của một nhà hàng có thật.

## 3.4. Tìm riêng từng loại hình

**Nhà hàng:**

```text
[out:json][timeout:25];
nwr["amenity"="restaurant"]
(around:3000,10.7769,106.7009);
out center tags;
```

**Quán cà phê:**

```text
[out:json][timeout:25];
nwr["amenity"="cafe"]
(around:3000,10.7769,106.7009);
out center tags;
```

**Đồ ăn nhanh:**

```text
[out:json][timeout:25];
nwr["amenity"="fast_food"]
(around:3000,10.7769,106.7009);
out center tags;
```

## 3.5. Tìm theo cuisine

Một số giá trị cuisine thường gặp:

| Value | Mô tả |
|---|---|
| `vietnamese` | Món Việt |
| `chinese` | Món Trung |
| `japanese` | Món Nhật |
| `korean` | Món Hàn |
| `italian` | Món Ý |
| `pizza` | Pizza |
| `burger` | Burger |
| `seafood` | Hải sản |
| `coffee_shop` | Cà phê |
| `regional` | Món địa phương |

Ví dụ tìm nhà hàng món Việt:

```text
[out:json][timeout:25];
nwr["amenity"="restaurant"]
["cuisine"~"vietnamese"]
(around:3000,10.7769,106.7009);
out center tags;
```

**Quan trọng:** `cuisine` là dữ liệu do người đóng góp khai báo. Không phải nhà hàng nào cũng có tag này.

## 3.6. Tìm kiếm món ăn

Crave cần phân biệt:

- Restaurant Search: tìm nhà hàng theo tên.
- Food Search: tìm quán có khả năng phục vụ một loại món ăn.

OSM không có API menu chuẩn để xác minh một quán có bán món phở, bún bò hay pizza cụ thể.

Có thể dùng cuisine tags làm dữ liệu gợi ý, nhưng không nên khẳng định món ăn tồn tại nếu chưa xác minh.

Ví dụ:

```text
[out:json][timeout:25];
nwr["amenity"~"^(restaurant|fast_food)$"]
["cuisine"~"vietnamese"]
(around:3000,10.7769,106.7009);
out center tags;
```

Sau đó Crave có thể lọc thêm bằng dữ liệu do người dùng hoặc quản trị viên đóng góp.

---

# 4. Nominatim API – Tìm kiếm địa chỉ

## 4.1. Vai trò

Nominatim là dịch vụ geocoding của hệ sinh thái OpenStreetMap.

Hai chức năng chính:

- Forward Geocoding: địa chỉ → tọa độ.
- Reverse Geocoding: tọa độ → địa chỉ.

Base URL:

`https://nominatim.openstreetmap.org`

Không cần API Key đối với public instance.

## 4.2. Forward Geocoding

Ví dụ người dùng nhập:

`Quận 1, Thành phố Hồ Chí Minh`

Request:

```http
GET https://nominatim.openstreetmap.org/search
  ?q=Quan%201%2C%20Ho%20Chi%20Minh
  &format=jsonv2
  &addressdetails=1
  &limit=5
```

Response mẫu:

```json
[
  {
    "place_id": 123456,
    "lat": "10.7756",
    "lon": "106.7019",
    "display_name": "District 1, Ho Chi Minh City, Vietnam",
    "type": "administrative",
    "address": {
      "city": "Ho Chi Minh City",
      "country": "Vietnam"
    }
  }
]
```

## 4.3. Reverse Geocoding

Ví dụ:

```http
GET https://nominatim.openstreetmap.org/reverse
  ?lat=10.7769
  &lon=106.7009
  &format=jsonv2
```

Trả về thông tin địa chỉ tương ứng với tọa độ.

## 4.4. Giới hạn quan trọng

Public Nominatim có chính sách sử dụng nghiêm ngặt:

- Tối đa 1 request/giây cho toàn ứng dụng.
- Phải định danh ứng dụng bằng User-Agent phù hợp hoặc Referer.
- Không được dùng làm autocomplete phía client.
- Không được truy vấn hàng loạt hoặc tải toàn bộ POI trong một khu vực.
- Phải hiển thị attribution.

Vì vậy, Crave chỉ nên sử dụng Nominatim cho các thao tác tìm địa chỉ có kiểm soát, không dùng nó làm search engine chính cho nhà hàng.

---

# 5. OpenStreetMap Tiles – Hiển thị bản đồ

## 5.1. Vai trò

Tiles là các ảnh bản đồ được chia thành những ô nhỏ theo zoom và tọa độ.

URL mẫu:

`https://tile.openstreetmap.org/{z}/{x}/{y}.png`

Trong đó:

- `z`: zoom level.
- `x`: tile coordinate X.
- `y`: tile coordinate Y.

Crave dùng tiles để hiển thị bản đồ và marker nhà hàng.

## 5.2. MapLibre React Native

Thư viện đề xuất:

`@maplibre/maplibre-react-native`

Tài liệu:

https://maplibre.org/maplibre-react-native/

MapLibre là thư viện render bản đồ, không phải nhà cung cấp dữ liệu địa điểm.

Bạn cần một nguồn map style/tiles riêng.

## 5.3. Cài đặt với Expo

```bash
npx expo install @maplibre/maplibre-react-native
```

Trong `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@maplibre/maplibre-react-native"
    ]
  }
}
```

Sau đó tạo Development Build và rebuild ứng dụng.

Lưu ý:

- Không chạy trực tiếp bằng Expo Go.
- MapLibre yêu cầu native code.
- Phiên bản hiện tại yêu cầu React Native từ 0.80 trở lên.
- Từ phiên bản 11, thư viện yêu cầu New Architecture.

React Native 0.81.5 của dự án Crave đáp ứng yêu cầu phiên bản tối thiểu, nhưng cần kiểm tra cấu hình New Architecture và tương thích native trước khi cài.

## 5.4. Ví dụ hiển thị bản đồ

```tsx
import React from 'react';
import { Map } from '@maplibre/maplibre-react-native';

export default function ExploreMapScreen() {
  return (
    <Map
      style={{ flex: 1 }}
      mapStyle="YOUR_MAP_STYLE_URL"
    />
  );
}
```

`YOUR_MAP_STYLE_URL` phải là style URL hợp lệ từ nhà cung cấp tiles hoặc server của bạn.

Không nên sử dụng demo tiles của MapLibre cho production.

## 5.5. Hiển thị attribution

Trên bản đồ cần hiển thị:

`© OpenStreetMap contributors`

Có thể dẫn người dùng tới:

`https://www.openstreetmap.org/copyright`

Không được che attribution bằng bottom sheet, nút điều khiển hoặc thành phần giao diện khác.

---

# 6. Chuẩn hóa dữ liệu cho Crave

Không nên sử dụng trực tiếp response của Overpass trong toàn bộ ứng dụng.

Nên chuyển đổi sang một model thống nhất.

## 6.1. Restaurant TypeScript

```ts
export interface Restaurant {
  id: string;

  osmType: 'node' | 'way' | 'relation';
  osmId: number;

  name: string;
  latitude: number;
  longitude: number;

  category?: string;
  cuisine?: string[];

  address?: string;
  phone?: string;
  website?: string;

  openingHours?: string;

  distance?: number;

  photoUrl?: string;

  rating?: number;
  reviewCount?: number;

  priceLevel?: number;

  tags: Record<string, string>;
}
```

Các trường `photoUrl`, `rating`, `reviewCount`, `priceLevel` không được mặc định là có từ OSM.

## 6.2. Mapping dữ liệu

| OSM field | Crave field |
|---|---|
| `type + id` | `id`, `osmType`, `osmId` |
| `tags.name` | `name` |
| `lat`, `lon` hoặc `center.lat`, `center.lon` | `latitude`, `longitude` |
| `tags.amenity` | `category` |
| `tags.cuisine` | `cuisine` |
| `tags.phone` | `phone` |
| `tags.website` | `website` |
| `tags.opening_hours` | `openingHours` |
| `tags.addr:*` | `address` |
| `tags` | `tags` |

Nên dùng composite ID như `node/123456`, `way/123456` hoặc `relation/123456` để tránh trùng ID giữa các loại OSM object.

---

# 7. Tính khoảng cách

OSM trả về tọa độ, không đảm bảo có khoảng cách đường đi.

Crave có thể tính khoảng cách đường chim bay bằng công thức Haversine.

```ts
const toRad = (value: number) =>
  (value * Math.PI) / 180;

export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return R * c;
}
```

Ví dụ:

```ts
const distance = getDistance(
  userLatitude,
  userLongitude,
  restaurant.latitude,
  restaurant.longitude
);

console.log(`${distance.toFixed(2)} km`);
```

Đây là khoảng cách trực tiếp, không phải khoảng cách di chuyển theo đường phố.

---

# 8. Search Architecture của Crave

## 8.1. Restaurant Search

Luồng:

1. Người dùng nhập tên quán.
2. Crave gửi truy vấn đến Overpass.
3. Lọc kết quả theo tên.
4. Hiển thị danh sách phù hợp.

Overpass không phải full-text search engine tối ưu cho việc tìm kiếm tên trên phạm vi toàn thành phố. Không nên gửi một truy vấn lớn cho mọi lần gõ phím.

MVP nên giới hạn phạm vi tìm kiếm theo khu vực hoặc tọa độ.

## 8.2. Food Search

Ví dụ người dùng nhập:

- Phở bò.
- Bún bò.
- Pizza.
- Hamburger.
- Trà sữa.

Luồng:

1. Chuẩn hóa từ khóa.
2. Mapping từ khóa sang cuisine/category nếu có thể.
3. Query Overpass theo loại hình và tags.
4. Lọc các kết quả có dữ liệu phù hợp.
5. Gắn nhãn mức độ xác minh.

Không được coi một nhà hàng có `cuisine=vietnamese` là bằng chứng chắc chắn rằng họ có bán một món cụ thể.

## 8.3. Nearby Search

Default radius:

`3000 meters`

Các bộ lọc:

- Category.
- Cuisine.
- Distance.
- Open/Closed nếu có opening_hours và parser phù hợp.
- Budget nếu Crave có dữ liệu giá riêng.

Lưu ý: không phải địa điểm nào cũng khai báo giờ mở cửa hoặc giá.

## 8.4. Random Picker

Random Picker không cần API riêng.

Luồng:

1. Lấy danh sách nhà hàng đã tìm được.
2. Lọc theo budget, category và distance.
3. Loại các quán người dùng vừa dislike.
4. Chọn ngẫu nhiên một kết quả.

## 8.5. Swipe Discovery

Swipe cũng có thể xử lý local.

- Swipe right: Like.
- Swipe left: Dislike.
- Tap: mở Restaurant Detail.
- Save: thêm vào Favorites.

Lưu trạng thái tương tác bằng SQLite.

---

# 9. Dữ liệu nào cần tự xây dựng?

Do OSM không có đầy đủ thông tin thương mại, Crave nên sở hữu một số dữ liệu riêng.

| Data | Nguồn |
|---|---|
| Restaurant location | OSM |
| Restaurant name | OSM |
| Restaurant category | OSM |
| Cuisine | OSM nếu có |
| Rating | Crave/user contribution |
| Review | Crave/user contribution |
| Menu | Chủ quán hoặc người dùng đóng góp |
| Price range | Crave/user contribution |
| Hashtags | Crave |
| Favorites | SQLite |
| Interaction history | SQLite |
| Random pick history | SQLite |
| Stories | Backend riêng nếu phát triển |

Không được tự tạo rating và review rồi trình bày như dữ liệu thật.

---

# 10. Local Database

MVP có thể sử dụng SQLite.

## 10.1. favorites

```sql
CREATE TABLE favorites (
  id TEXT PRIMARY KEY,
  osm_type TEXT NOT NULL,
  osm_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  created_at TEXT NOT NULL
);
```

## 10.2. restaurant_interactions

```sql
CREATE TABLE restaurant_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  osm_type TEXT NOT NULL,
  osm_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

`action`: like, dislike, view, skip.

## 10.3. user_preferences

```sql
CREATE TABLE user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  budget_min INTEGER,
  budget_max INTEGER,
  radius INTEGER DEFAULT 3000,
  preferred_categories TEXT,
  preferred_cuisines TEXT
);
```

## 10.4. recent_searches

```sql
CREATE TABLE recent_searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  search_type TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

---

# 11. Error Handling

| Error | Nguyên nhân | Xử lý |
|---|---|---|
| Timeout | Query quá nặng hoặc server chậm | Retry có giới hạn, giảm radius |
| 429 | Bị giới hạn request | Backoff, giảm tần suất |
| 5xx | Public instance gặp sự cố | Thử instance khác phù hợp chính sách |
| Empty result | Khu vực thiếu dữ liệu | Gợi ý tăng bán kính |
| Missing coordinates | Dữ liệu không đầy đủ | Bỏ qua record |
| Missing name | POI không có tên | Không hiển thị như nhà hàng có tên |
| Missing tags | Dữ liệu chưa đầy đủ | Hiển thị thông tin cơ bản |

Không retry liên tục khi Overpass hoặc Nominatim gặp lỗi.

---

# 12. Rate Limit và Usage Policy

## Overpass API

Overpass sử dụng máy chủ công cộng được chia sẻ với nhiều người dùng.

- Không gửi truy vấn toàn thành phố với mọi thao tác.
- Giới hạn radius.
- Chỉ lấy tags cần thiết.
- Tránh gọi API liên tục khi người dùng di chuyển.
- Cache kết quả phù hợp.
- Không thực hiện crawling hoặc tải hàng loạt.

Một số public instance công bố mức sử dụng tham khảo, nhưng không có SLA đảm bảo cho ứng dụng production.

## Nominatim

Public Nominatim:

- Tối đa 1 request/giây cho toàn ứng dụng.
- Không autocomplete phía client.
- Phải định danh ứng dụng.
- Không bulk geocoding.
- Không sử dụng như dịch vụ geocoding thương mại quy mô lớn.

## OpenStreetMap Tiles

- Chỉ tải tile cần thiết cho viewport người dùng.
- Tuân thủ cache headers.
- Không bulk download.
- Không tạo chức năng tải bản đồ offline trên máy chủ tile công cộng của OSM.
- Hiển thị attribution.

---

# 13. Licensing và Attribution

OpenStreetMap sử dụng Open Database License (ODbL).

Crave cần hiển thị:

`© OpenStreetMap contributors`

Link:

`https://www.openstreetmap.org/copyright`

Nếu phân phối dữ liệu OSM hoặc cơ sở dữ liệu phái sinh, cần đánh giá nghĩa vụ share-alike của ODbL. Việc sử dụng dữ liệu OSM không đồng nghĩa mọi mã nguồn của Crave phải được mở.

Đây là phần cần xem xét kỹ nếu Crave phát triển thành sản phẩm thương mại.

---

# 14. Bảo mật và kiến trúc Production

MVP có thể gọi public APIs trực tiếp từ mobile app, nhưng cần tách data layer để có thể thay nhà cung cấp.

Kiến trúc đề xuất:

```text
Expo React Native
       |
       v
RestaurantRepository
       |
       v
OpenStreetMapProvider
       |
       +---- Overpass API
       |
       +---- Nominatim API
       |
       +---- Local SQLite
       |
       +---- MapLibre
```

Khi phát triển lớn hơn:

```text
Mobile App
    |
    v
Crave Backend
    |
    +---- OSM Provider
    |
    +---- Restaurant Database
    |
    +---- User Reviews
    |
    +---- Menu / Photos
    |
    +---- Recommendation Engine
```

Không nên phụ thuộc lâu dài vào một public Overpass instance duy nhất.

---

# 15. Tech Stack đề xuất

| Layer | Technology |
|---|---|
| Mobile | Expo React Native |
| Language | TypeScript |
| Navigation | Expo Router |
| Server State | TanStack Query |
| Local State | Zustand |
| Local Database | Expo SQLite |
| Location | Expo Location |
| Map | MapLibre React Native |
| Map Data | OpenStreetMap |
| POI Search | Overpass API |
| Geocoding | Nominatim |
| Image | Expo Image |
| Animation | Reanimated |
| Gesture | Gesture Handler |

---

# 16. Implementation Roadmap

## Phase 1 – Location & Map

- [ ] Xin quyền truy cập vị trí.
- [ ] Lấy tọa độ người dùng.
- [ ] Cài đặt MapLibre.
- [ ] Hiển thị bản đồ.
- [ ] Hiển thị vị trí hiện tại.
- [ ] Hiển thị attribution.

## Phase 2 – Restaurant Discovery

- [ ] Tích hợp Overpass API.
- [ ] Nearby Restaurant Search.
- [ ] Nearby Cafe Search.
- [ ] Nearby Fast Food Search.
- [ ] Normalize OSM response.
- [ ] Tính khoảng cách.
- [ ] Hiển thị Restaurant List.
- [ ] Hiển thị Map Markers.

## Phase 3 – Restaurant Detail

- [ ] Tên và loại hình.
- [ ] Địa chỉ.
- [ ] Tọa độ.
- [ ] Cuisine.
- [ ] Số điện thoại nếu có.
- [ ] Website nếu có.
- [ ] Giờ mở cửa nếu có.
- [ ] Liên kết Google Maps/ứng dụng bản đồ để chỉ đường.

## Phase 4 – Discovery Experience

- [ ] Swipe Discovery.
- [ ] Random Picker.
- [ ] Favorites.
- [ ] Interaction History.
- [ ] Filter theo khoảng cách.
- [ ] Filter theo category.
- [ ] Search theo cuisine.

## Phase 5 – Crave Data

- [ ] User Reviews.
- [ ] Menu submissions.
- [ ] Price range.
- [ ] Hashtags.
- [ ] Restaurant photos.
- [ ] Backend và đồng bộ dữ liệu.

---

# 17. Official Documentation

1. OpenStreetMap: https://www.openstreetmap.org/
2. OSM Copyright & License: https://www.openstreetmap.org/copyright
3. Overpass API: https://wiki.openstreetmap.org/wiki/Overpass_API
4. Overpass Turbo: https://overpass-turbo.eu/
5. Nominatim: https://nominatim.org/
6. Nominatim Usage Policy: https://operations.osmfoundation.org/policies/nominatim/
7. Tile Usage Policy: https://operations.osmfoundation.org/policies/tiles/
8. MapLibre React Native: https://maplibre.org/maplibre-react-native/
9. MapLibre Expo Setup: https://maplibre.org/maplibre-react-native/docs/setup/expo/

---

# 18. Final Recommendation

Đối với Crave MVP, kiến trúc nên là:

- **Overpass API:** tìm kiếm nhà hàng và quán ăn.
- **MapLibre:** hiển thị bản đồ.
- **OpenStreetMap:** dữ liệu địa lý.
- **Nominatim:** tìm địa chỉ có kiểm soát.
- **SQLite:** lưu Favorites, Preferences và History.
- **Crave local data:** quản lý rating, menu, price và hashtags trong giai đoạn đầu.

Không cần Google Cloud Billing, không cần API Key của Google để triển khai kiến trúc này.

Tuy nhiên, public OSM services không có SLA và không đảm bảo dữ liệu nhà hàng đầy đủ. Đây là lựa chọn rất tốt để làm MVP và portfolio, nhưng khi có nhiều người dùng cần chuyển sang nhà cung cấp có cam kết dịch vụ hoặc tự vận hành hạ tầng phù hợp.

**Product principle:** Crave should discover real places, but should never pretend that missing restaurant information is verified data.