// 违规等级
export type ViolationLevel = 'high' | 'warning' | 'info';

// 敏感词类别
export type CategoryType =
  | 'political'
  | 'pornographic'
  | 'violence'
  | 'false_advertising'
  | 'infringement'
  | 'inducement'
  | 'medical'
  | 'financial';

// 类别中文名
export const CategoryLabels: Record<CategoryType, string> = {
  political: '政治敏感',
  pornographic: '色情低俗',
  violence: '暴力血腥',
  false_advertising: '虚假宣传',
  infringement: '侵权内容',
  inducement: '诱导分享',
  medical: '医疗健康',
  financial: '金融风险',
};

export const LevelLabels: Record<ViolationLevel, string> = {
  high: '高危',
  warning: '警告',
  info: '提示',
};

// 敏感词标记
export interface SensitiveMark {
  id: string;
  word: string;
  startIndex: number;
  endIndex: number;
  category: CategoryType;
  level: ViolationLevel;
  suggestion: string;
  alternatives: string[];
  ruleRef: string;
}

// diff 对比数据
export interface DiffEntry {
  type: 'keep' | 'remove' | 'add';
  text: string;
  suggestion?: string;
}

// 审核结果
export interface ReviewResult {
  id: string;
  originalText: string;
  score: number;
  marks: SensitiveMark[];
  summary: {
    high: number;
    warning: number;
    info: number;
  };
  optimizedText: string;
  diffData: DiffEntry[];
  reviewedAt: number;
}

// 用户信息
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
}

// 平台规则
export interface PlatformRule {
  id: string;
  year: number;
  title: string;
  content: string;
  category: string;
  priority: 'high' | 'normal';
}