// 敏感词库 — Trie 树匹配引擎
import type { SensitiveMark, CategoryType, ViolationLevel } from '@/types';

interface TrieNode {
  children: Record<string, TrieNode>;
  isEnd: boolean;
  category?: CategoryType;
  level?: ViolationLevel;
  alternatives?: string[];
  ruleRef?: string;
}

// AC 自动机节点（简化版 Trie）
class SensitiveWordEngine {
  private root: TrieNode = { children: {}, isEnd: false };

  constructor() {
    this.buildTrie();
  }

  private insert(
    word: string,
    category: CategoryType,
    level: ViolationLevel,
    alternatives: string[],
    ruleRef: string
  ) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = { children: {}, isEnd: false };
      }
      node = node.children[char];
    }
    node.isEnd = true;
    node.category = category;
    node.level = level;
    node.alternatives = alternatives;
    node.ruleRef = ruleRef;
  }

  private buildTrie() {
    // 敏感词库 — 按类别组织
    const words: Array<{
      word: string;
      category: CategoryType;
      level: ViolationLevel;
      alternatives: string[];
      ruleRef: string;
    }> = [
      // === 政治敏感 ===
      { word: '领导人', category: 'political', level: 'high', alternatives: ['管理层', '负责人'], ruleRef: '《微信视频号运营规范》第3.1条' },
      { word: '暴乱', category: 'political', level: 'high', alternatives: ['群体事件'], ruleRef: '《微信视频号运营规范》第3.2条' },
      { word: '颠覆政权', category: 'political', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第3.1条' },
      { word: '独立宣言', category: 'political', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第3.3条' },
      { word: '颜色革命', category: 'political', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第3.2条' },

      // === 色情低俗 ===
      { word: '裸体', category: 'pornographic', level: 'high', alternatives: [], ruleRef: '《微信视频号内容审核标准》第5.1条' },
      { word: '性暗示', category: 'pornographic', level: 'high', alternatives: [], ruleRef: '《微信视频号内容审核标准》第5.2条' },
      { word: '擦边', category: 'pornographic', level: 'warning', alternatives: [], ruleRef: '《微信视频号内容审核标准》第5.3条' },
      { word: '情趣', category: 'pornographic', level: 'warning', alternatives: [], ruleRef: '《微信视频号内容审核标准》第5.3条' },

      // === 暴力血腥 ===
      { word: '虐杀', category: 'violence', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第4.1条' },
      { word: '血腥', category: 'violence', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第4.1条' },
      { word: '殴打', category: 'violence', level: 'high', alternatives: ['冲突'], ruleRef: '《微信视频号运营规范》第4.2条' },
      { word: '自残', category: 'violence', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第4.3条' },

      // === 虚假宣传 ===
      { word: '绝对有效', category: 'false_advertising', level: 'high', alternatives: ['效果显著', '用户反馈良好'], ruleRef: '《广告法》第9条' },
      { word: '包治百病', category: 'false_advertising', level: 'high', alternatives: ['有助于改善', '辅助调理'], ruleRef: '《广告法》第17条' },
      { word: '一夜暴富', category: 'false_advertising', level: 'high', alternatives: ['快速增收', '高效变现'], ruleRef: '《微信视频号运营规范》第6.1条' },
      { word: '保证赚钱', category: 'false_advertising', level: 'high', alternatives: ['有盈利机会', '可实现收益'], ruleRef: '《广告法》第25条' },
      { word: '最', category: 'false_advertising', level: 'warning', alternatives: ['非常', '十分'], ruleRef: '《广告法》第9条' },
      { word: '第一', category: 'false_advertising', level: 'warning', alternatives: ['领先', '头部'], ruleRef: '《广告法》第9条' },
      { word: '永不', category: 'false_advertising', level: 'warning', alternatives: ['长期', '持续'], ruleRef: '《广告法》第9条' },
      { word: '万能', category: 'false_advertising', level: 'warning', alternatives: ['多功能', '全面'], ruleRef: '《广告法》第9条' },

      // === 侵权内容 ===
      { word: '盗版', category: 'infringement', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第7.1条' },
      { word: '破解版', category: 'infringement', level: 'high', alternatives: ['试用版'], ruleRef: '《微信视频号运营规范》第7.2条' },
      { word: '翻录', category: 'infringement', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第7.1条' },

      // === 诱导分享 ===
      { word: '转发才能', category: 'inducement', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第8.1条' },
      { word: '转发朋友圈', category: 'inducement', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第8.1条' },
      { word: '集赞', category: 'inducement', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第8.2条' },
      { word: '分享到群', category: 'inducement', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第8.1条' },
      { word: '转发有奖', category: 'inducement', level: 'high', alternatives: [], ruleRef: '《微信视频号运营规范》第8.3条' },
      { word: '求点赞', category: 'inducement', level: 'warning', alternatives: ['如果喜欢请点赞'], ruleRef: '《微信视频号运营规范》第8.2条' },
      { word: '求关注', category: 'inducement', level: 'info', alternatives: ['欢迎关注'], ruleRef: '《微信视频号运营规范》第8.2条' },

      // === 医疗健康 ===
      { word: '根治', category: 'medical', level: 'high', alternatives: ['缓解', '改善'], ruleRef: '《广告法》第17条' },
      { word: '治愈率', category: 'medical', level: 'high', alternatives: ['有效率'], ruleRef: '《医疗广告管理办法》第7条' },
      { word: '特效药', category: 'medical', level: 'high', alternatives: ['常用药', '推荐用药'], ruleRef: '《广告法》第17条' },
      { word: '祖传秘方', category: 'medical', level: 'high', alternatives: ['传统方法'], ruleRef: '《医疗广告管理办法》第7条' },
      { word: '神药', category: 'medical', level: 'high', alternatives: ['药物', '药品'], ruleRef: '《广告法》第17条' },
      { word: '减肥药', category: 'medical', level: 'warning', alternatives: ['体重管理产品'], ruleRef: '《微信视频号运营规范》第9.1条' },

      // === 金融风险 ===
      { word: '稳赚不赔', category: 'financial', level: 'high', alternatives: ['风险可控', '历史表现良好'], ruleRef: '《广告法》第25条' },
      { word: '零风险', category: 'financial', level: 'high', alternatives: ['低风险', '风险可控'], ruleRef: '《广告法》第25条' },
      { word: '高回报率', category: 'financial', level: 'high', alternatives: ['有收益潜力'], ruleRef: '《微信视频号运营规范》第10.1条' },
      { word: '内部消息', category: 'financial', level: 'high', alternatives: ['市场分析'], ruleRef: '《证券法》第78条' },
      { word: '内幕交易', category: 'financial', level: 'high', alternatives: [], ruleRef: '《证券法》第53条' },
      { word: '炒股秘籍', category: 'financial', level: 'warning', alternatives: ['投资策略', '分析方法'], ruleRef: '《微信视频号运营规范》第10.2条' },
      { word: '涨停', category: 'financial', level: 'warning', alternatives: ['上涨'], ruleRef: '《微信视频号运营规范》第10.2条' },
      { word: '借贷', category: 'financial', level: 'warning', alternatives: ['借款'], ruleRef: '《微信视频号运营规范》第10.3条' },
    ];

    for (const w of words) {
      this.insert(w.word, w.category, w.level, w.alternatives, w.ruleRef);
    }
  }

  // 扫描文本，返回所有匹配的敏感词标记
  scan(text: string): SensitiveMark[] {
    const marks: SensitiveMark[] = [];
    let idCounter = 0;

    for (let i = 0; i < text.length; i++) {
      let node = this.root;
      let j = i;

      while (j < text.length && node.children[text[j]]) {
        node = node.children[text[j]];
        j++;

        if (node.isEnd) {
          const word = text.slice(i, j);
          // 避免重复标记 (长词优先)
          const existingIdx = marks.findIndex(
            (m) => m.startIndex <= i && m.endIndex >= j
          );
          if (existingIdx === -1) {
            marks.push({
              id: `mark_${idCounter++}`,
              word,
              startIndex: i,
              endIndex: j,
              category: node.category!,
              level: node.level!,
              suggestion: this.getSuggestion(word, node.category!),
              alternatives: node.alternatives || [],
              ruleRef: node.ruleRef || '《微信视频号运营规范》',
            });
          }
        }
      }
    }

    return marks;
  }

  private getSuggestion(_word: string, category: CategoryType): string {
    const suggestions: Record<CategoryType, string> = {
      political: '建议删除或替换为中性表述，避免涉及敏感政治话题',
      pornographic: '建议删除该内容，改用健康、积极的表达方式',
      violence: '建议删除暴力相关描述，改用温和的叙述方式',
      false_advertising: '建议修改为客观描述，避免使用绝对化用语',
      infringement: '建议使用原创内容或取得合法授权',
      inducement: '建议删除诱导性语言，自然引导用户互动',
      medical: '建议避免医疗功效性表述，如需提及请注明信息来源',
      financial: '建议添加风险提示，避免承诺性收益描述',
    };
    return suggestions[category];
  }
}

export const sensitiveEngine = new SensitiveWordEngine();