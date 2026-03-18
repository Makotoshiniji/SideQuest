/**
 * Seed data for 5 sample quests - MyFoodApp Series
 */

export const sampleQuests = [
  {
    title: "Product Manager - กัปตันเรือผู้ต้องตัดสินใจ",
    description:
      "อีก 1 สัปดาห์ MyFoodApp ต้องปล่อยฟีเจอร์ Healthy Choice แต่ทีมDev พบ Bug ใหญ่ ต้องใช้เวลา 2 สัปดาห์เพิ่ม",
    difficulty: "Hard" as const,
    estimatedMinutes: 35,
    xpReward: 550,
    skillsRewarded: ["communication", "critical"],
    type: "solo" as const,
    status: "published" as const,
    creatorId: "seed-creator",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    content: {
      scenario: `🎯 สถานการณ์: คุณเป็น Product Manager ของ MyFoodApp 

เหตุการณ์วิกฤต:
- สัญญาลงทุนได้สัญญาว่าจะปล่อยฟีเจอร์ "Healthy Choice" ในวันที่ 7
- ทีม Dev รายงาน: ระบบ filter ร้านอาหารคลีนมี Critical Bug
- ตัวเลือก: ปล่อยทันที (2 สัปดาห์เพิ่มเติม) หรือ MVP หรือ Accelerate
- ทีม Marketing เตรียมแอดพร้อมแล้ว
- Investor อยากดู Demo ในวันศุกร์นี้

ตัดสินใจภายใน 2 ชั่วโมง:`,
      choices: [
        {
          label: "A",
          text: "เลื่อนการเปิดตัวไป 2 สัปดาห์ เจรจา Marketing ระงับแอด ยืนยันคุณภาพ → +Critical, +Communication",
          skillId: "critical",
        },
        {
          label: "B",
          text: "ปล่อย MVP ตัดระบบ filter ออก ใช้ manual ชั่วคราว 2 สัปดาห์ → +Creativity, +Critical",
          skillId: "creativity",
        },
        {
          label: "C",
          text: "สั่ง Dev ทำ Overtime ไม่มีวัน ไม่มีคืน → ได้งาน แต่ Burnout -Collaboration",
          skillId: "critical",
        },
      ],
    },
  },
  {
    title: "Junior Developer - API ช้าจน User ออก",
    description:
      "API ร้านอาหารโหลดรูปช้า 3-5 วินาทีต่อครั้ง User ออกไป 60% Senior Dev ป่วย",
    difficulty: "Medium" as const,
    estimatedMinutes: 30,
    xpReward: 450,
    skillsRewarded: ["critical", "collaboration"],
    type: "solo" as const,
    status: "published" as const,
    creatorId: "seed-creator",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    content: {
      scenario: `🔧 สถานการณ์: คุณเป็น Junior Developer ของ MyFoodApp

ปัญหา: API ดึงข้อมูลร้าน 20 ร้านโหลด 20 วินาที User ออกจากหน้า 6 ใน 10
- Database ไม่มี Index
- ไม่มี Cache layer
- Senior Dev ป่วยลา
- Deadline: พรุ่งนี้ต้องปล่อย

จะทำไง:`,
      choices: [
        {
          label: "A",
          text: "รื้อ API ใหม่ทั้งหมด เพิ่ม Index Database + Cache (เสี่ยง Bug สูง) → +Creativity, -Critical",
          skillId: "creativity",
        },
        {
          label: "B",
          text: "แจ้ง PM เสนอ Placeholder + Lazy Load ลดเวลา 70% ขอ Backend ช่วย → +Communication, +Collaboration",
          skillId: "communication",
        },
        {
          label: "C",
          text: "Copy Code จาก StackOverflow เงียบๆ (ได้งาน แต่ debt สูง) → -Collaboration",
          skillId: "critical",
        },
      ],
    },
  },
  {
    title: "UI Designer - Dashboard สวยแต่คุณป้างง",
    description:
      "ออกแบบ Dashboard สวยๆ แต่คุณป้าร้านค้า 50+ บ่นว่าปุ่มเยอะเกิน จะทำไง",
    difficulty: "Medium" as const,
    estimatedMinutes: 28,
    xpReward: 420,
    skillsRewarded: ["critical", "collaboration"],
    type: "solo" as const,
    status: "published" as const,
    creatorId: "seed-creator",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    content: {
      scenario: `🎨 สถานการณ์: คุณเป็น UI/UX Designer ของ MyFoodApp

สถานการณ์:
- ออกแบบ Dashboard สวยงาม 18 ปุ่ม
- คุณป้าต้นแบบ 50+ ปี: "ปุ่มเยอะไป งง"
- ใช้งานถูกต้องเพียง 40%
- BA บ่น: "User นี้ 60% ของ Target Group"

ตัดสินใจ:`,
      choices: [
        {
          label: "A",
          text: "ยืนยันว่า Design เป็น Best Practice สากล ผู้ใช้ต้องเรียนรู้ (ไม่ฟังผู้ใช้) → -Collaboration",
          skillId: "collaboration",
        },
        {
          label: "B",
          text: "ลงพื้นที่ สัก 4 ชั่วโมง สอบถาม วิธีคุณป้าจดออร์เดอร์จริงๆ ปรับ Design ให้ค่ายใจเธอ (Master Approach) → +Critical, +Collaboration",
          skillId: "critical",
        },
        {
          label: "C",
          text: "ตัด feature เหลือ 3 ปุ่มเท่านั้น (ง่าย แต่สูญเสีย feature) → -Creativity",
          skillId: "critical",
        },
      ],
    },
  },
  {
    title: "Business Analyst - Traffic สูง Conversion ต่ำ",
    description:
      "Healthy Choice Traffic 15K แต่ Conversion 0.8% ต่ำจังหวัล หาหนทางหรือเหตุผล",
    difficulty: "Hard" as const,
    estimatedMinutes: 40,
    xpReward: 600,
    skillsRewarded: ["critical", "collaboration"],
    type: "solo" as const,
    status: "published" as const,
    creatorId: "seed-creator",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116639-c741ee6ddce7?w=500&h=300&fit=crop",
    content: {
      scenario: `📊 สถานการณ์: คุณเป็น Business Analyst ของ MyFoodApp

ข้อมูล:
- Traffic Healthy Choice: 15,000 คน
- Conversion: 120 orders (0.8% ต่ำ) vs ปกติ 4%
- 8,500 คน View Order, 7,200 View Restaurant, 1,200 เข้า Checkout
- 1,080 คนออกจาก Checkout (Bounce 90%)

หาสาเหตุ:`,
      choices: [
        {
          label: "A",
          text: "ดึง Data ราคา Healthy vs Regular ราคาสูง 30% → ราคาเป็น Issue → +Critical",
          skillId: "critical",
        },
        {
          label: "B",
          text: "ส่ง Survey Push Notification ถาม 1,200 คนที่ Bounce: ทำไมไม่สั่ง ได้ feedback จริง → +Communication, +Collaboration",
          skillId: "communication",
        },
        {
          label: "C",
          text: "สรุปฟันธง UI ของ Designer ทำปุ่ม Checkout ไม่ดี (รีบเรียนอง ไม่ data) → -Collaboration",
          skillId: "critical",
        },
      ],
    },
  },
  {
    title: "Digital Marketing - คู่แข่งชิงเปิด Healthy Choice ก่อน",
    description: "FoodFresh เปิด Healthy Menu ก่อน โฆษณาคล้ายของเรา 95% จะทำไง",
    difficulty: "Hard" as const,
    estimatedMinutes: 35,
    xpReward: 550,
    skillsRewarded: ["creativity", "communication"],
    type: "solo" as const,
    status: "published" as const,
    creatorId: "seed-creator",
    imageUrl:
      "https://images.unsplash.com/photo-1611532736579-6c8f41cecb94?w=500&h=300&fit=crop",
    content: {
      scenario: `📢 สถานการณ์: คุณเป็น Digital Marketing Manager ของ MyFoodApp

วิกฤต:
- FoodFresh เปิด Healthy Menu ก่อน โปรโมชันคล้าย 95%
- Hashtag: #HealthyChoiceFoodFresh ได้ 50K impressions
- คุณซื้อ Ads 500K บาท บ้างจ่ายไปแล้วครึ่ง
- Design + Copy พร้อมแล้วอยากยิง แต่คนต้องคิด Copy-cat

ตัดสินใจ:`,
      choices: [
        {
          label: "A",
          text: "ยกเลิก Campaign ทิ้ง ยอมเสีย 250K บาท (Safe Play แต่ Loss สูง) → -Creativity",
          skillId: "creativity",
        },
        {
          label: "B",
          text: "นัด BA + Designer ด่วน หา Differentiation (เราส่ง 30 นาที เร็ว) แก้ Copy ใหม่ ยิง Ads ด้วย Data → +Collaboration, +Critical",
          skillId: "critical",
        },
        {
          label: "C",
          text: "ทำ Viral Campaign ล้อเลียนขำๆ Meme copy-cat (Risk สูง แต่ +Creativity, +Communication)",
          skillId: "creativity",
        },
      ],
    },
  },
];
