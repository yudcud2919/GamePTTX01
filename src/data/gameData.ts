/**
 * ============================================================================
 * TRUNG TÂM DỮ LIỆU TRÒ CHƠI (GAME DATA — WINTER PIXEL EDITION)
 * ============================================================================
 * Để đổi sang tác phẩm Ngữ văn khác, bạn chỉ cần chỉnh sửa nội dung trong file
 * này — toàn bộ UI, bản đồ 2D 7 điểm checkpoint, phần thưởng và 2 Easter Eggs
 * sẽ tự động cập nhật theo!
 * ============================================================================
 */

export type QuestionType = 'multiple-choice' | 'fill-blank' | 'word-spotter';

export type ClueIconKey =
  | 'camera'
  | 'aperture'
  | 'zap'
  | 'file'
  | 'scale'
  | 'sparkles'
  | 'eye';

export interface MapPoint {
  /** Tọa độ ngang trên bản đồ 2D (0 - 100%) */
  x: number;
  /** Tọa độ dọc trên bản đồ 2D (0 - 100%) */
  y: number;
}

export interface ClueReward {
  id: string;
  code: string;
  itemName: string;
  tag: string;
  hostTalkingPoint: string;
  iconKey: ClueIconKey;
}

interface BaseQuestion {
  id: number;
  stageCode: string;
  stageLabel: string;
  locationName: string;
  mapPosition: MapPoint;
  type: QuestionType;
  prompt: string;
  contextQuote?: string;
  hint: string;
  reward: ClueReward;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  beforeBlank: string;
  afterBlank: string;
  acceptedAnswers: string[];
  displayAnswer: string;
  placeholder?: string;
}

export interface WordSpotterQuestion extends BaseQuestion {
  type: 'word-spotter';
  instruction: string;
  tokens: string[];
  targetIndex: number;
}

export type GameQuestion =
  | MultipleChoiceQuestion
  | FillBlankQuestion
  | WordSpotterQuestion;

export interface EasterEggData {
  id: 'recovery' | 'plot-twist';
  code: string;
  title: string;
  subtitle: string;
  badgeName: string;
  storyContent: string;
  hostLeadIn: string;
  mapPosition: MapPoint;
}

export interface VictoryRank {
  minHp: number;
  title: string;
  subtitle: string;
  accentClass: string;
}

export interface GameConfig {
  caseCode: string;
  workTitle: string;
  author: string;
  year: string;
  missionTitle: string;
  missionSubtitle: string;
  protagonistName: string;
  protagonistRole: string;
  maxHp: number;
  spawnPoint: MapPoint;
  loadingTips: string[];
  closingTitle: string;
  closingMessage: string;
  closingQuote: string;
}

export const GAME_CONFIG: GameConfig = {
  caseCode: 'HỒ SƠ #1983',
  workTitle: 'Chiếc Thuyền Ngoài Xa',
  author: 'Nguyễn Minh Châu',
  year: '1983',
  missionTitle: 'HÀNH TRÌNH MÙA ĐÔNG — GIẢI MÃ SỰ THẬT SAU ỐNG KÍNH',
  missionSubtitle:
    'Di chuyển qua 7 điểm manh mối giữa làng chài phủ tuyết để khám phá ranh giới giữa cái đẹp nghệ thuật và hiện thực đời sống',
  protagonistName: 'Thám tử Ống Kính Phùng',
  protagonistRole: 'Người giữ đèn mùa đông',
  maxHp: 5,
  spawnPoint: { x: 10, y: 58 },
  loadingTips: [
    'Mẹo chơi: Dùng phím WASD, phím mũi tên ↑↓←→ hoặc click chuột trên bản đồ để di chuyển nhân vật.',
    'Mẹo chơi: Tiến lại gần trạm đèn đang phát sáng và nhấn giữ phím [E] để mở khóa câu hỏi.',
    'Bí mật mùa đông: Từ Chặng 3 trở đi, hãy tìm hộp quà Giáng sinh 0x83 ẩn trong rừng thông phía Nam bản đồ!',
    'Cảnh báo hồ sơ mật: Ở Chặng 6, một tín hiệu đặc biệt sẽ xuất hiện gần vịnh đá — hoặc nhấn Shift + E.',
  ],
  closingTitle: 'THÔNG ĐIỆP KẾT ÁN — GIÁ TRỊ NHÂN ĐẠO & NGHỆ THUẬT',
  closingMessage:
    'Đừng bao giờ nhìn cuộc đời và con người một cách đơn giản, phiến diện từ khoảng cách "ngoài xa". Nghệ thuật chân chính không tách rời đời sống — người nghệ sĩ và mỗi chúng ta cần có cái nhìn đa chiều, ấm áp và thấu cảm để nhận ra vẻ đẹp khuất lấp sau những mảnh đời lam lũ.',
  closingQuote:
    '“Nghệ thuật không cần phải là ánh trăng lừa dối, nghệ thuật có thể chỉ là tiếng đau khổ kia thoát ra từ những kiếp lầm than.”',
};

export const QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    stageCode: 'CHẶNG 01',
    stageLabel: 'Bình minh sương sớm',
    locationName: 'Bãi biển sương sớm',
    mapPosition: { x: 18, y: 36 },
    type: 'multiple-choice',
    prompt:
      'Tại bãi biển miền Trung phủ sương sớm, nghệ sĩ nhiếp ảnh Phùng đã bắt gặp khung cảnh tuyệt mỹ nào khiến anh xúc động như chạm tới "chân lý của sự toàn thiện"?',
    options: [
      {
        key: 'A',
        text: 'Hoàng hôn đỏ rực nhuộm kín bến cá vùng biển miền Trung sau cơn bão.',
      },
      {
        key: 'B',
        text: 'Mũi thuyền in một nét mơ hồ lòe nhòe vào bầu sương mù trắng như sữa có pha đôi chút màu hồng của ánh mặt trời.',
      },
      {
        key: 'C',
        text: 'Đoàn thuyền đánh cá giăng buồm trở về giữa tiếng hò kéo lưới vang dội.',
      },
      {
        key: 'D',
        text: 'Ngọn hải đăng cổ soi rọi mặt biển đêm tĩnh lặng giữa những con sóng bạc.',
      },
    ],
    correctKey: 'B',
    hint: 'Khung cảnh ấy được Nguyễn Minh Châu ví như một "bức tranh mực tàu của một danh họa thời cổ" với sắc trắng sữa và màu hồng ánh nắng sớm.',
    reward: {
      id: 'clue-1',
      code: 'MANH MỐI #01',
      itemName: 'Cuộn Phim Đen Trắng — "Bức Tranh Mực Tàu"',
      tag: 'Phát hiện thứ nhất',
      hostTalkingPoint:
        'Dẫn dắt vào bài: Đây chính là "phát hiện thứ nhất" của Phùng — cái đẹp toàn bích khi đứng từ xa nhìn qua lăng kính nghệ thuật thuần túy. Nhưng liệu đằng sau vẻ đẹp ấy có thực sự bình yên?',
      iconKey: 'camera',
    },
  },
  {
    id: 2,
    stageCode: 'CHẶNG 02',
    stageLabel: 'Chân lý cái Đẹp',
    locationName: 'Đồi thông bình minh',
    mapPosition: { x: 35, y: 27 },
    type: 'fill-blank',
    prompt:
      'Điền cụm từ còn thiếu (2 tiếng) trong lời cảm nhận nổi tiếng của nhân vật Phùng khi bấm máy thu lấy cảnh đắt trời cho:',
    beforeBlank:
      '“Trong giây phút bối rối, tôi tưởng chính mình vừa khám phá thấy cái chân lý của sự toàn thiện, khám phá thấy cái khoảnh khắc trong ngần của tâm hồn... Bản thân cái đẹp chính là ',
    afterBlank: '.”',
    acceptedAnswers: ['đạo đức', 'dao duc'],
    displayAnswer: 'đạo đức',
    placeholder: 'Nhập 2 tiếng còn thiếu...',
    hint: 'Cụm từ bắt đầu bằng chữ "Đ" — chỉ chuẩn mực tốt đẹp, hướng thiện làm thanh lọc tâm hồn con người.',
    reward: {
      id: 'clue-2',
      code: 'MANH MỐI #02',
      itemName: 'Lăng Kính Thẩm Mỹ & Thanh Lọc',
      tag: 'Quan niệm nghệ thuật',
      hostTalkingPoint:
        'Dẫn dắt vào bài: Phùng tin rằng cái đẹp có sức mạnh thanh lọc tâm hồn — "bản thân cái đẹp chính là đạo đức". Chính niềm tin lãng mạn này sẽ tạo ra cú tương phản dữ dội ngay ở chặng kế tiếp!',
      iconKey: 'aperture',
    },
  },
  {
    id: 3,
    stageCode: 'CHẶNG 03',
    stageLabel: 'Cú sốc bãi biển',
    locationName: 'Bến thuyền cũ',
    mapPosition: { x: 49, y: 45 },
    type: 'word-spotter',
    prompt:
      'Chiếc thuyền cập bờ cũng là lúc "bức tranh mực tàu" vỡ vụn. Hãy click chọn đúng cụm từ chỉ CÔNG CỤ BẠO LỰC phũ phàng mà lão đàn ông hàng chài rút ra để đánh vợ:',
    instruction: 'Click vào đúng cụm từ khóa trong đoạn trích bên dưới:',
    tokens: [
      'Lão đàn ông',
      'lập tức',
      'trở nên hùng hổ,',
      'mặt đỏ gay,',
      'rút trong người ra',
      'một chiếc thắt lưng của lính ngụy ngày xưa,',
      'quật tới tấp',
      'vào lưng người đàn bà.',
    ],
    targetIndex: 5,
    hint: 'Đó là một vật dụng gắn với dấu tích chiến tranh cũ mà lão đàn ông luôn mang trong người.',
    reward: {
      id: 'clue-3',
      code: 'MANH MỐI #03',
      itemName: 'Tấm Âm Bản Rạn Nứt — Nghịch Lý Hiện Thực',
      tag: 'Phát hiện thứ hai',
      hostTalkingPoint:
        'Dẫn dắt vào bài: Cú sốc "phát hiện thứ hai"! Bước ra từ chiếc thuyền đẹp như mơ lại là cảnh bạo hành tàn nhẫn. Dư âm chiến tranh và cái đói nghèo đã biến nạn nhân thành kẻ gây đau khổ.',
      iconKey: 'zap',
    },
  },
  {
    id: 4,
    stageCode: 'CHẶNG 04',
    stageLabel: 'Vết thương tuổi thơ',
    locationName: 'Xóm chài tuyết phủ',
    mapPosition: { x: 31, y: 72 },
    type: 'multiple-choice',
    prompt:
      'Hành động nào của cậu bé Phác trên bãi biển đã bộc lộ bi kịch tinh thần dữ dội nhất của một đứa trẻ lớn lên giữa bạo lực gia đình?',
    options: [
      {
        key: 'A',
        text: 'Chạy lên thị trấn tìm chánh án Đẩu để viết đơn tố cáo bố mình.',
      },
      {
        key: 'B',
        text: 'Giấu con dao găm trong người, lao vào giằng chiếc thắt lưng và đánh trả lại bố để bảo vệ mẹ.',
      },
      {
        key: 'C',
        text: 'Đẩy chiếc thuyền ra xa bờ để bố không thể quay lại bãi xe tăng hỏng.',
      },
      {
        key: 'D',
        text: 'Đập vỡ chiếc máy ảnh của nghệ sĩ Phùng vì nghĩ anh đang chế giễu gia đình mình.',
      },
    ],
    correctKey: 'B',
    hint: 'Tình thương mẹ bản năng của Phác đi kèm với nguy cơ khiến em bị tổn thương tâm hồn và lặp lại vòng xoáy bạo lực.',
    reward: {
      id: 'clue-4',
      code: 'MANH MỐI #04',
      itemName: 'Hồ Sơ Nhân Chứng: Cậu Bé Phác',
      tag: 'Bi kịch thế hệ',
      hostTalkingPoint:
        'Dẫn dắt vào bài: Nỗi đau lớn nhất của người đàn bà hàng chài không phải những trận đòn lên thân xác, mà là nỗi sợ tâm hồn con trai mình bị vấy bẩn bởi hận thù. Chính vì thế bà mới xin chồng "đưa lên bờ mà đánh" để tránh mặt các con.',
      iconKey: 'file',
    },
  },
  {
    id: 5,
    stageCode: 'CHẶNG 05',
    stageLabel: 'Tòa án huyện',
    locationName: 'Tòa án huyện ấm đèn',
    mapPosition: { x: 56, y: 74 },
    type: 'fill-blank',
    prompt:
      'Tại Tòa án huyện, trước lời khuyên bỏ chồng đầy thiện chí của chánh án Đẩu, người đàn bà hàng chài đã thốt lên lời bộc bạch xót xa nào về cuộc sống mưu sinh? Điền từ khuyết (2 tiếng):',
    beforeBlank:
      '“Lòng các chú tốt, nhưng các chú đâu có phải là người làm ăn... cho nên các chú đâu có hiểu được cái việc của các người làm ăn ',
    afterBlank: '.”',
    acceptedAnswers: ['lam lũ', 'lam lu', 'khốn khó', 'khon kho'],
    displayAnswer: 'lam lũ',
    placeholder: 'Nhập 2 tiếng chỉ sự vất vả, cơ cực...',
    hint: 'Từ láy phụ âm đầu "L" gồm 2 tiếng, miêu tả cảnh sống vất vả, cơ cực, cực nhọc quanh năm.',
    reward: {
      id: 'clue-5',
      code: 'MANH MỐI #05',
      itemName: 'Biên Bản Tòa Án Huyện — Logic Sinh Tồn',
      tag: 'Chiều sâu nhân sinh',
      hostTalkingPoint:
        'Dẫn dắt vào bài: Câu nói khiến cả Phùng và Đẩu "vỡ ra" nhiều điều! Pháp luật và thiện chí sách vở đôi khi chưa chạm tới quy luật sinh tồn khắc nghiệt của người dân chài — nơi chiếc thuyền giữa phong ba không thể thiếu người đàn ông chèo chống.',
      iconKey: 'scale',
    },
  },
  {
    id: 6,
    stageCode: 'CHẶNG 06',
    stageLabel: 'Ánh sáng khuất lấp',
    locationName: 'Cầu gỗ bên vịnh',
    mapPosition: { x: 74, y: 52 },
    type: 'word-spotter',
    prompt:
      'Ẩn sau dáng vẻ thô kệch, cam chịu là trái tim người mẹ giàu đức hy sinh. Hãy chọn cụm từ diễn tả NIỀM HẠNH PHÚC HIẾM HOI nhưng đủ sức giữ bà ở lại với gia đình:',
    instruction:
      'Click chọn cụm từ khóa thể hiện khoảnh khắc hạnh phúc nhất của người đàn bà hàng chài:',
    tokens: [
      'Trên chiếc thuyền',
      'chật hẹp giữa biển khơi,',
      'vui nhất là lúc',
      'ngồi nhìn đàn con tôi',
      'chúng nó',
      'được ăn no...',
      'mỗi khi trời yên biển lặng',
      'và có chút cá tôm.',
    ],
    targetIndex: 5,
    hint: 'Một ước vọng vô cùng bình dị, gắn với miếng cơm manh áo hằng ngày của những đứa trẻ nghèo vùng biển.',
    reward: {
      id: 'clue-6',
      code: 'MANH MỐI #06',
      itemName: 'Tia Sáng Mẫu Tử Trong Giông Bão',
      tag: 'Vẻ đẹp khuất lấp',
      hostTalkingPoint:
        'Dẫn dắt vào bài: Chỉ 3 chữ "được ăn no" đã làm bừng sáng toàn bộ thiên truyện! Người đàn bà ấy sống không phải cho bản thân mà "sống cho con". Đó là vẻ đẹp khuất lấp mang đậm cảm hứng nhân đạo của Nguyễn Minh Châu.',
      iconKey: 'sparkles',
    },
  },
  {
    id: 7,
    stageCode: 'CHẶNG 07',
    stageLabel: 'Tấm ảnh cuối năm',
    locationName: 'Hải đăng đêm Giáng sinh',
    mapPosition: { x: 87, y: 31 },
    type: 'multiple-choice',
    prompt:
      'Mỗi lần đứng ngắm kỹ tấm ảnh đen trắng được chọn in vào bộ lịch nghệ thuật cuối năm, nghệ sĩ Phùng luôn nhìn thấy điều gì bước ra từ trong khung hình?',
    options: [
      {
        key: 'A',
        text: 'Màu xanh ngắt của đại dương cùng cánh buồm no gió hướng về chân trời.',
      },
      {
        key: 'B',
        text: 'Màu hồng hồng của ánh sương mai và dáng người đàn bà hàng chài đang bước ra khỏi tấm ảnh.',
      },
      {
        key: 'C',
        text: 'Phòng xử án uy nghiêm cùng tập hồ sơ ly hôn còn dang dở trên bàn chánh án Đẩu.',
      },
      {
        key: 'D',
        text: 'Những xác xe tăng hỏng gỉ sét nằm im lìm dọc bãi cát miền Trung.',
      },
    ],
    correctKey: 'B',
    hint: 'Sự kết hợp giữa sắc màu lãng mạn của nghệ thuật (ánh sương mai) và hình bóng con người lam lũ của hiện thực.',
    reward: {
      id: 'clue-7',
      code: 'MANH MỐI #07',
      itemName: 'Tấm Ảnh Bộ Lịch — Cái Nhìn Đa Chiều',
      tag: 'Kết án & Triết lý',
      hostTalkingPoint:
        'Dẫn dắt kết bài: Chi tiết kết truyện là một kiệt tác biểu tượng! Dù là ảnh đen trắng, Phùng vẫn thấy "màu hồng của ánh sương mai" (cái đẹp nghệ thuật) hòa quyện cùng bước chân người đàn bà bước ra (hiện thực cuộc đời). Nghệ thuật chỉ thực sự sống khi gắn liền với số phận con người!',
      iconKey: 'eye',
    },
  },
];

export const EASTER_EGGS: Record<'recovery' | 'plot-twist', EasterEggData> = {
  recovery: {
    id: 'recovery',
    code: 'QUÀ GIÁNG SINH ẨN #01 // HỒ SƠ HẬU TRƯỜNG',
    title: 'Mật Mã 1983: Người Mở Đường Tinh Anh',
    subtitle: 'Chi tiết hậu trường ít người biết về hoàn cảnh ra đời tác phẩm',
    badgeName: 'Hộp Quà Thấu Thị',
    storyContent:
      'Ít ai để ý rằng "Chiếc thuyền ngoài xa" được viết năm 1983 — trước cả cột mốc Đổi mới 1986 ba năm! Giữa lúc văn học vẫn quen với cảm hứng sử thi hào hùng, Nguyễn Minh Châu đã dũng cảm xoay ống kính vào những vết thương đời thường hậu chiến. Nhà văn Nguyên Ngọc từng tôn vinh ông là "người mở đường tinh anh và tài năng nhất của văn học Việt Nam sau 1975".',
    hostLeadIn:
      'Mẹo cho Host: Chia sẻ nhanh chi tiết này để nhấn mạnh tầm vóc tiên phong của Nguyễn Minh Châu — cả lớp sẽ cực kỳ thích thú với món quà hồi phục mùa Noel này!',
    mapPosition: { x: 13, y: 84 },
  },
  'plot-twist': {
    id: 'plot-twist',
    code: 'HỒ SƠ MẬT // GÓC NHÌN PHẢN BIỆN #02',
    title: 'PLOT TWIST: Ai Mới Là Người "Mù Quáng"?',
    subtitle: 'Góc nhìn phản biện bất ngờ tại Tòa án huyện',
    badgeName: 'Ngôi Sao Thấu Thị',
    storyContent:
      'Khi mới đọc, ta dễ nghĩ người đàn bà hàng chài "cam chịu, nhẫn nhục, thiếu hiểu biết" nên không dám bỏ chồng. NHƯNG HÃY LẬT NGƯỢC HỒ SƠ: Trong căn phòng tòa án huyện hôm ấy, chính bà mới là người tỉnh táo và thấu hiểu hiện thực nhất! Ngược lại, Phùng (đại diện cho Nghệ thuật) và Đẩu (đại diện cho Pháp luật) ban đầu lại chính là hai người nhìn đời đơn giản, một chiều. Cuộc "xét xử" thực chất đã đảo vai: người đàn bà thất học lại trở thành người "khai sáng" nhận thức cho hai người trí thức!',
    hostLeadIn:
      'Mẹo cho Host: Đặt câu hỏi mở cho cả lớp 15 giây: "Theo các bạn, ở tòa án huyện, ai mới thực sự là người dạy cho ai một bài học về cuộc đời?" — Đảm bảo cả lớp sẽ tranh luận sôi nổi!',
    mapPosition: { x: 86, y: 78 },
  },
};

export const VICTORY_RANKS: VictoryRank[] = [
  {
    minHp: 5,
    title: 'NGƯỜI GIỮ ĐÈN HUYỀN THOẠI',
    subtitle: 'Phá án hoàn hảo giữa đêm Giáng sinh — Bậc thầy giải mã văn chương!',
    accentClass: 'text-[#f5d497] border-[#e8b86d]/60 bg-[#e8b86d]/15',
  },
  {
    minHp: 3,
    title: 'THÁM TỬ RỪNG THÔNG CẤP S',
    subtitle: 'Bản lĩnh sắc bén — Nhìn thấu mọi lớp nghĩa đằng sau khung hình!',
    accentClass: 'text-[#a7d4bf] border-[#74b096]/60 bg-[#49856f]/20',
  },
  {
    minHp: 1,
    title: 'LỮ KHÁCH KIÊN CƯỜNG',
    subtitle: 'Vượt qua gió tuyết và sóng lớn để chạm tới chân lý nhân sinh!',
    accentClass: 'text-[#f3ecde] border-[#c7d8db]/50 bg-[#274952]/50',
  },
];

export function getVictoryRank(remainingHp: number): VictoryRank {
  return (
    VICTORY_RANKS.find((rank) => remainingHp >= rank.minHp) ??
    VICTORY_RANKS[VICTORY_RANKS.length - 1]
  );
}

export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:"'“”‘’()\-–—]/g, '')
    .replace(/\s+/g, ' ');
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
