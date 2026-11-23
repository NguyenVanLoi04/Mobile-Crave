import { MenuItem, RestaurantItem } from '../../types/restaurant';

/**
 * Menu Service
 * Tạo thực đơn chi tiết, giá tiền và hình ảnh sống động phù hợp với từng quán ăn
 * Dựa trên tên quán, món đặc trưng (dishSpecialty), loại ẩm thực (cuisine) và OSM tags.
 */
class MenuService {
  /**
   * Tạo danh sách món ăn cho một quán cụ thể
   */
  generateMenuForRestaurant(restaurant: RestaurantItem): MenuItem[] {
    const combined = `${restaurant.name} ${restaurant.cuisine} ${restaurant.dishSpecialty || ''} ${(restaurant.tags || []).join(' ')}`.toLowerCase();

    // 1. Quán Cơm: Cơm tấm, cơm gà, cơm sườn, cơm niêu, cơm rang...
    if (
      combined.includes('cơm') ||
      combined.includes('com') ||
      combined.includes('rice')
    ) {
      return [
        {
          id: `${restaurant.id}_m1`,
          name: restaurant.dishSpecialty || 'Cơm Tấm Sườn Bì Chả Trứng',
          price: '65,000đ',
          desc: 'Sườn cốt lết nướng than hoa mật ong thơm lừng, bì dai giòn, chả trứng hấp mềm béo ngậy ăn kèm mỡ hành.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m2`,
          name: 'Cơm Gà Xối Mỡ Đùi Góc Tư Giòn Rụm',
          price: '55,000đ',
          desc: 'Đùi gà xối mỡ vàng ươm, da giòn rụm thịt mềm ngọt, ăn kèm cơm chiên tỏi và dưa leo cà chua.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m3`,
          name: 'Canh Khổ Qua Dồn Thịt Băm Nóng Hổi',
          price: '20,000đ',
          desc: 'Khổ qua tươi dồn thịt nạc vai và mộc nhĩ nêm nếm vừa vặn, nước dùng ngọt thanh giải nhiệt.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m4`,
          name: 'Cơm Sườn Nướng Cháy Cạnh Thơm Cay',
          price: '59,000đ',
          desc: 'Sườn cây tẩm ướp sốt ngũ vị cay nhẹ, nướng xém cạnh thơm phức, dĩa cơm dẻo ngọt.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m5`,
          name: 'Trà Đá Hoa Lài Thơm Mát',
          price: '5,000đ',
          desc: 'Trà hoa lài ướp lạnh giải khát hoàn hảo sau bữa ăn.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&auto=format&fit=crop&q=80' },
        },
      ];
    }

    // 2. Món Sợi & Nước: Phở, Bún bò, Mì Quảng, Bánh canh, Hủ tiếu...
    if (
      combined.includes('phở') ||
      combined.includes('pho') ||
      combined.includes('bún') ||
      combined.includes('bánh canh') ||
      combined.includes('mì') ||
      combined.includes('hủ tiếu') ||
      combined.includes('noodle')
    ) {
      return [
        {
          id: `${restaurant.id}_m1`,
          name: restaurant.dishSpecialty || 'Phở Bò Tái Nạm Gầu Gân Đặc Biệt',
          price: '79,000đ',
          desc: 'Nước dùng ninh xương ống bò tươi 24 tiếng cùng quế hồi thảo quả, thịt bò tươi mềm ngọt lịm.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m2`,
          name: 'Quẩy Giòn Vàng Ruộm (Đĩa)',
          price: '10,000đ',
          desc: 'Quẩy tươi chiên giòn tan, nhúng nước dùng phở béo ngọt ngậy tuyệt hảo.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m3`,
          name: 'Bún Bò Giò Heo Chả Cua Cay Nồng',
          price: '69,000đ',
          desc: 'Móng giò giòn sần sật, chả cua Huế bùi thơm, sa tế sả ớt xộc mũi đặc trưng Cố Đô.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m4`,
          name: 'Trứng Gà Ta Chần Nước Béo Thơm Lừng',
          price: '12,000đ',
          desc: 'Trứng gà lòng đào béo ngậy hòa quyện cùng nước hầm xương đậm đà.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m5`,
          name: 'Trà Tắc Mật Ong Hạt Chia Mát Lạnh',
          price: '20,000đ',
          desc: 'Tắc tươi nguyên chất kết hợp mật ong hoa rừng thanh mát, giải ngấy.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&auto=format&fit=crop&q=80' },
        },
      ];
    }

    // 3. Cà phê & Cafe chill
    if (
      combined.includes('cà phê') ||
      combined.includes('cafe') ||
      combined.includes('coffee') ||
      restaurant.cuisine.toLowerCase().includes('cafe')
    ) {
      return [
        {
          id: `${restaurant.id}_m1`,
          name: restaurant.dishSpecialty || 'Cà Phê Sữa Đá Sài Gòn Pha Phin',
          price: '35,000đ',
          desc: 'Hạt cà phê Robusta rang mộc pha phin truyền thống hòa quyện cùng sữa đặc béo ngọt đậm đà.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m2`,
          name: 'Cà Phê Muối Kem Béo Cổ Điển',
          price: '39,000đ',
          desc: 'Lớp kem muối bồng bềnh mịn màng, vị mằn mặn tôn lên vị đắng ngọt quyến rũ của cà phê.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m3`,
          name: 'Bạc Xỉu 3 Tầng Cốt Dừa Thơm Ngậy',
          price: '42,000đ',
          desc: 'Sữa tươi, cốt dừa béo bùi và chút nhấn nhá cà phê nhẹ nhàng êm dịu.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m4`,
          name: 'Cold Brew Cam Vàng Ủ Lạnh 16 Giờ',
          price: '48,000đ',
          desc: 'Cà phê Arabica ủ lạnh chiết xuất thanh khiết kết hợp lát cam vàng mọng nước sảng khoái.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m5`,
          name: 'Bánh Croissant Bơ Tỏi Nướng Giòn',
          price: '35,000đ',
          desc: 'Bánh sừng bò ngàn lớp thơm nức mùi bơ Pháp tươi, vỏ giòn ruột mềm ăn kèm cà phê.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=900&auto=format&fit=crop&q=80' },
        },
      ];
    }

    // 4. Trà sữa, Chè, Đồ uống ngọt
    if (
      combined.includes('trà sữa') ||
      combined.includes('milktea') ||
      combined.includes('chè') ||
      combined.includes('boba') ||
      combined.includes('juice') ||
      combined.includes('tea')
    ) {
      return [
        {
          id: `${restaurant.id}_m1`,
          name: restaurant.dishSpecialty || 'Trà Sữa Trân Châu Đường Đen Hoàng Kim',
          price: '48,000đ',
          desc: 'Trà đen Ceylon đậm vị quyện sữa tươi thanh trùng, trân châu thủ công dẻo dai đun đường đen thơm phức.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m2`,
          name: 'Trà Đào Cam Sả Tươi Mát Thanh Nhiệt',
          price: '45,000đ',
          desc: 'Trà đào thơm nức hòa quyện sả tươi đập dập, cam mọng nước và miếng đào giòn ngâm thơm ngon.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m3`,
          name: 'Matcha Uji Đá Xay Kem Cheese Mặn',
          price: '52,000đ',
          desc: 'Bột trà xanh Nhật Bản thơm chát nhẹ hòa cùng lớp foam phô mai béo ngậy sánh mịn.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m4`,
          name: 'Chè Bưởi An Giang Cốt Dừa Béo Bùi',
          price: '30,000đ',
          desc: 'Cùi bưởi giòn sần sật không chút đắng, đỗ xanh hấp mềm mịn chan nước cốt dừa thơm ngát.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&auto=format&fit=crop&q=80' },
        },
      ];
    }

    // 5. Ốc & Hải sản
    if (
      combined.includes('ốc') ||
      combined.includes('hải sản') ||
      combined.includes('quán ốc') ||
      combined.includes('seafood')
    ) {
      return [
        {
          id: `${restaurant.id}_m1`,
          name: restaurant.dishSpecialty || 'Ốc Hương Rang Muối Tuyết Phô Mai Cay',
          price: '95,000đ',
          desc: 'Ốc hương cồi giòn ngọt đảo sốt muối tuyết đậm đà, phủ phô mai cay thơm nức mũi.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m2`,
          name: 'Ốc Móng Tay Xào Rau Muống Tỏi Thơm',
          price: '65,000đ',
          desc: 'Ốc móng tay tươi béo ngọt xào nhanh trên lửa lớn cùng rau muống xanh giòn và tỏi băm.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m3`,
          name: 'Tôm Sú Nướng Muối Ớt Xanh Cháy Cạnh',
          price: '89,000đ',
          desc: 'Tôm sú tươi sống nướng than hoa đỏ rực, chấm muối tiêu chanh ớt xiêm xanh cay nồng.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m4`,
          name: 'Mì Xào Giòn Hải Sản Thập Cẩm Rau Cải',
          price: '75,000đ',
          desc: 'Sợi mì xào giòn rụm ngập sốt mực tôm tươi rói và nấm cải thìa ngọt thanh.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=900&auto=format&fit=crop&q=80' },
        },
      ];
    }

    // 6. Sushi & Món Nhật
    if (
      combined.includes('sushi') ||
      combined.includes('japanese') ||
      combined.includes('nhật')
    ) {
      return [
        {
          id: `${restaurant.id}_m1`,
          name: restaurant.dishSpecialty || 'Set Nigiri & Sashimi Cá Hồi Tươi Sống',
          price: '185,000đ',
          desc: 'Cá hồi Nauy nhập khẩu vân mỡ mềm tan, ăn kèm gừng hồng gari và wasabi tươi cay nồng.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m2`,
          name: 'Cơm Lươn Nhật Nướng Sốt Teriyaki',
          price: '145,000đ',
          desc: 'Lươn nướng mọng nước phết sốt teriyaki đậm vị ngọt thanh, rắc vừng rang trên cơm trắng Nhật Bản.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m3`,
          name: 'Xửng Dimsum Há Cảo Tôm Thịt Nghi Ngút',
          price: '48,000đ',
          desc: 'Vỏ bánh trong suốt thấy rõ nhân tôm tươi giòn ngọt bùi, chấm tương ớt giấm tiều.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1562436260-8c9216eeb703?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m4`,
          name: 'Súp Miso Rong Biển Đậu Hũ Non',
          price: '25,000đ',
          desc: 'Nước dùng dashi thanh ngọt, tương miso lên men truyền thống và đậu hũ non mềm mịn.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&auto=format&fit=crop&q=80' },
        },
      ];
    }

    // 7. Bánh Mì & Bakery
    if (
      combined.includes('bánh mì') ||
      combined.includes('banh mi') ||
      combined.includes('tiệm bánh') ||
      combined.includes('bakery')
    ) {
      return [
        {
          id: `${restaurant.id}_m1`,
          name: restaurant.dishSpecialty || 'Bánh Mì Thập Cẩm Pate Bơ Thịt Nguội',
          price: '35,000đ',
          desc: 'Vỏ bánh mì giòn tan nóng hổi, pate gan béo ngậy, bơ vàng óng, dưa chua và ngò rí đậm đà.',
          isBestseller: true,
          image: { uri: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m2`,
          name: 'Bánh Mì Chả Cá Nóng Vũng Tàu',
          price: '30,000đ',
          desc: 'Chả cá tươi chiên vàng trực tiếp tại chỗ, thơm mùi thì là chấm tương ớt cay xè.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m3`,
          name: 'Bánh Bao Xá Xíu Trứng Cút Hấp Nóng',
          price: '20,000đ',
          desc: 'Vỏ bánh trắng xốp bông mịn, nhân xá xíu đậm đà cùng trứng cút bùi ngậy.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=900&auto=format&fit=crop&q=80' },
        },
        {
          id: `${restaurant.id}_m4`,
          name: 'Sữa Đậu Nành Lá Dứa Nấu Tươi',
          price: '15,000đ',
          desc: 'Đậu nành hạt nấu thủ công hòa cùng lá dứa thơm mát, ít ngọt lành mạnh.',
          isBestseller: false,
          image: { uri: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&auto=format&fit=crop&q=80' },
        },
      ];
    }

    // 8. Nhà hàng tổng hợp & Món Việt truyền thống (Fallback tiêu chuẩn)
    return [
      {
        id: `${restaurant.id}_m1`,
        name: restaurant.dishSpecialty || `Món Đặc Sản ${restaurant.name}`,
        price: '89,000đ',
        desc: 'Món ăn đặc sắc nhất của quán, chế biến từ nguyên liệu tươi ngon theo công thức bí truyền.',
        isBestseller: true,
        image: restaurant.image,
      },
      {
        id: `${restaurant.id}_m2`,
        name: 'Thịt Kho Tàu Nước Dừa Trứng Cút',
        price: '65,000đ',
        desc: 'Ba chỉ tươi kho mềm rục trong nước dừa xiêm ngọt lịm, màu cánh gián tự nhiên óng ả.',
        isBestseller: true,
        image: { uri: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80' },
      },
      {
        id: `${restaurant.id}_m3`,
        name: 'Canh Cua Rau Đay Mướp Hương Nồi Đất',
        price: '45,000đ',
        desc: 'Gạch cua đồng giã tay nổi vàng ươm, rau đay mồng tơi ngọt mát giải nhiệt mùa hè.',
        isBestseller: false,
        image: { uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80' },
      },
      {
        id: `${restaurant.id}_m4`,
        name: 'Rau Luộc Thập Cẩm Chấm Kho Quẹt Tôm Khô',
        price: '55,000đ',
        desc: 'Đậu bắp, bầu, cà rốt xanh mướt chấm nồi kho quẹt tóp mỡ giòn rụm và tôm khô béo cay.',
        isBestseller: false,
        image: { uri: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&auto=format&fit=crop&q=80' },
      },
      {
        id: `${restaurant.id}_m5`,
        name: 'Trà Xanh Tươi Gừng Ấm',
        price: '10,000đ',
        desc: 'Lá chè xanh om nóng pha chút gừng tươi ấm bụng, thanh lọc.',
        isBestseller: false,
        image: { uri: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&auto=format&fit=crop&q=80' },
      },
    ];
  }
}

export const menuService = new MenuService();
