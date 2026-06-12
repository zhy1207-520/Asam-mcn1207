// 平台规则库 — 视频号历年规则规范

import type { PlatformRule } from '@/types';

export const platformRules: PlatformRule[] = [
  // === 2020 年 ===
  {
    id: 'rule-2020-01',
    year: 2020,
    title: '视频号内容基本准则',
    content:
      '所有视频号内容须遵守国家法律法规，不得传播违法信息。内容包括但不限于：反对宪法确定的基本原则的；危害国家统一、主权和领土完整的；泄露国家秘密、危害国家安全或者损害国家荣誉和利益的。',
    category: '内容管理',
    priority: 'high',
  },
  {
    id: 'rule-2020-02',
    year: 2020,
    title: '禁止传播虚假信息',
    content:
      '不得编造、传播虚假信息或者误导性信息，扰乱经济秩序和社会秩序。发布内容须确保真实性，不得以虚假或者引人误解的内容欺骗、误导用户。',
    category: '内容管理',
    priority: 'high',
  },
  {
    id: 'rule-2020-03',
    year: 2020,
    title: '未成年人保护规定',
    content:
      '不得利用视频号从事危害未成年人身心健康的行为。涉及未成年人的内容需特别审慎，保护未成年人隐私和权益。',
    category: '未成年人保护',
    priority: 'high',
  },

  // === 2021 年 ===
  {
    id: 'rule-2021-01',
    year: 2021,
    title: '商业广告内容规范',
    content:
      '发布商业广告内容须遵守《广告法》相关规定，不得使用"最好""第一""国家级"等绝对化用语。涉及医疗、药品、保健食品等内容须取得相应资质。',
    category: '商业规范',
    priority: 'high',
  },
  {
    id: 'rule-2021-02',
    year: 2021,
    title: '直播带货规范',
    content:
      '视频号直播带货须确保商品信息真实、准确，不得进行虚假宣传或夸大商品功效。主播应对推荐商品的质量负责。',
    category: '商业规范',
    priority: 'high',
  },
  {
    id: 'rule-2021-03',
    year: 2021,
    title: '诱导分享行为治理',
    content:
      '严禁以利益诱惑、胁迫等方式诱导用户进行分享、点赞等互动行为。包括但不限于"转发才能看""集赞送礼""分享到群"等。',
    category: '用户互动',
    priority: 'high',
  },

  // === 2022 年 ===
  {
    id: 'rule-2022-01',
    year: 2022,
    title: '医疗健康内容管理新规',
    content:
      '加强医疗健康类内容管理，未经认证不得发布医疗建议、诊断结论等内容。涉及药品、医疗器械、保健食品的内容须显著标注广告标识。',
    category: '内容管理',
    priority: 'high',
  },
  {
    id: 'rule-2022-02',
    year: 2022,
    title: '金融类内容准入标准',
    content:
      '发布金融类内容须具备相应资质，不得发布承诺收益、保证本金安全等内容。涉及股票、基金、期货等内容须进行风险提示。',
    category: '内容管理',
    priority: 'high',
  },
  {
    id: 'rule-2022-03',
    year: 2022,
    title: '知识产权保护强化',
    content:
      '强化知识产权保护，严禁未经授权使用他人作品（包括音乐、视频、图片、文字等）。鼓励原创内容创作。',
    category: '知识产权',
    priority: 'high',
  },

  // === 2023 年 ===
  {
    id: 'rule-2023-01',
    year: 2023,
    title: 'AI 生成内容标识规定',
    content:
      '使用人工智能技术生成的内容需进行明确标识，不得利用 AI 生成虚假信息或误导性内容。AI 生成内容同样须遵守所有平台规范。',
    category: '内容管理',
    priority: 'high',
  },
  {
    id: 'rule-2023-02',
    year: 2023,
    title: '短视频内容审核细则',
    content:
      '短视频内容不得包含暴力、血腥、恐怖场景；不得展示危险行为或可能被模仿的危险动作；不得传播低俗、色情内容。',
    category: '内容审核',
    priority: 'high',
  },
  {
    id: 'rule-2023-03',
    year: 2023,
    title: '数据安全与隐私保护',
    content:
      '创作者须遵守《个人信息保护法》，不得在内容中泄露他人个人信息（如电话号码、身份证号、住址等），不得未经同意使用他人肖像。',
    category: '数据安全',
    priority: 'high',
  },

  // === 2024 年 ===
  {
    id: 'rule-2024-01',
    year: 2024,
    title: '内容生态优化指南',
    content:
      '鼓励发布积极向上、传递正能量的内容。对低质量、重复、搬运内容将降低推荐权重。原创优质内容将获得更多流量扶持。',
    category: '内容生态',
    priority: 'normal',
  },
  {
    id: 'rule-2024-02',
    year: 2024,
    title: '争议内容处理机制',
    content:
      '涉及社会热点事件、争议话题的内容，需基于事实客观表述，不得煽动对立情绪。平台将对争议内容进行严格审核。',
    category: '内容审核',
    priority: 'high',
  },
  {
    id: 'rule-2024-03',
    year: 2024,
    title: '视频号电商运营规范',
    content:
      '视频号电商运营须取得相应资质，商品展示须与实际一致。不得通过虚假交易、刷单等方式提升数据。售后服务体系须完善。',
    category: '商业规范',
    priority: 'high',
  },

  // === 2025 年 ===
  {
    id: 'rule-2025-01',
    year: 2025,
    title: '深度合成内容管理规定',
    content:
      '使用深度合成（如 deepfake、AI 换脸等）技术制作的内容须显著标识，不得用于制作虚假新闻、冒充他人或传播不实信息。',
    category: '内容管理',
    priority: 'high',
  },
  {
    id: 'rule-2025-02',
    year: 2025,
    title: '跨境内容传播规则',
    content:
      '涉及跨境内容传播须遵守相关法律法规，不得传播危害国家安全的内容。海外内容引入须符合主管部门要求。',
    category: '内容管理',
    priority: 'high',
  },
  {
    id: 'rule-2025-03',
    year: 2025,
    title: '用户互动生态治理',
    content:
      '严厉打击刷量、水军、恶意评论等破坏互动生态的行为。建立健康、真实的用户互动环境。',
    category: '用户互动',
    priority: 'high',
  },

  // === 2026 年 ===
  {
    id: 'rule-2026-01',
    year: 2026,
    title: 'AI 驱动内容审核升级',
    content:
      '平台采用先进 AI 技术加强内容审核能力，同时要求创作者自觉遵守内容规范。AI 辅助创作工具生成的内容同样适用所有平台规则。',
    category: '内容审核',
    priority: 'normal',
  },
  {
    id: 'rule-2026-02',
    year: 2026,
    title: '内容分级管理制度',
    content:
      '实施内容分级管理，对不同类型的视频内容建立差异化的审核标准。涉及敏感话题的内容将进行更严格的审核。',
    category: '内容管理',
    priority: 'normal',
  },
  {
    id: 'rule-2026-03',
    year: 2026,
    title: '创作者权益保障',
    content:
      '完善创作者权益保障机制，加强原创保护。对侵权行为将采取包括但不限于下架内容、限制账号功能等措施。',
    category: '创作者权益',
    priority: 'normal',
  },
];

// 按年份分组
export const rulesByYear = platformRules.reduce(
  (acc, rule) => {
    if (!acc[rule.year]) acc[rule.year] = [];
    acc[rule.year].push(rule);
    return acc;
  },
  {} as Record<number, PlatformRule[]>
);

// 获取所有年份
export const allYears = Object.keys(rulesByYear)
  .map(Number)
  .sort((a, b) => b - a);