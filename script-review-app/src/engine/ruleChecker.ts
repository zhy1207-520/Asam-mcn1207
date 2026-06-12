// 规则匹配引擎 — 对脚本进行多维度审核
import type { ReviewResult, SensitiveMark } from '@/types';
import { sensitiveEngine } from './sensitiveWords';

// 额外的规则检测（基于正则模式）
const rulePatterns: Array<{
  pattern: RegExp;
  category: SensitiveMark['category'];
  level: SensitiveMark['level'];
  suggestion: string;
  alternatives: string[];
  ruleRef: string;
}> = [
  // 虚假宣传 — 承诺性用语
  {
    pattern: /保证(你|您|大家|.*)(赚|盈利|收益|发财|暴富)/,
    category: 'false_advertising',
    level: 'high',
    suggestion: '建议删除承诺性收益描述，改为客观介绍产品或服务',
    alternatives: ['请理性看待收益'],
    ruleRef: '《广告法》第25条',
  },
  {
    pattern: /见效快.*(不复发|不反弹|根治)/,
    category: 'medical',
    level: 'high',
    suggestion: '医疗健康类内容避免使用承诺性疗效描述',
    alternatives: ['请遵医嘱', '效果因人而异'],
    ruleRef: '《医疗广告管理办法》第7条',
  },
  // 诱导分享
  {
    pattern: /(关注公众号|加微信).*(领取|获得|免费)/,
    category: 'inducement',
    level: 'warning',
    suggestion: '避免以利益诱导用户关注/添加',
    alternatives: ['了解更多请关注'],
    ruleRef: '《微信视频号运营规范》第8.2条',
  },
  // 联系方式泄露风险
  {
    pattern: /加我.*(微信|QQ|手机)/i,
    category: 'inducement',
    level: 'info',
    suggestion: '建议通过视频号官方渠道引导互动，避免直接索要联系方式',
    alternatives: ['欢迎在评论区交流'],
    ruleRef: '《微信视频号运营规范》第8.3条',
  },
];

export function runReview(text: string): ReviewResult {
  // 1. 敏感词检测
  const marks = sensitiveEngine.scan(text);

  // 2. 规则模式匹配检测
  for (const rp of rulePatterns) {
    const match = text.match(rp.pattern);
    if (match && match.index !== undefined) {
      // 检查是否与已有标记重叠，避免重复
      const overlaps = marks.some(
        (m) => m.startIndex <= match.index! && m.endIndex >= match.index! + match[0].length
      );
      if (!overlaps) {
        marks.push({
          id: `mark_pattern_${Date.now()}_${match.index}`,
          word: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          category: rp.category,
          level: rp.level,
          suggestion: rp.suggestion,
          alternatives: rp.alternatives,
          ruleRef: rp.ruleRef,
        });
      }
    }
  }

  // 3. 按位置排序标记
  marks.sort((a, b) => a.startIndex - b.startIndex);

  // 4. 计算评分
  const highCount = marks.filter((m) => m.level === 'high').length;
  const warningCount = marks.filter((m) => m.level === 'warning').length;
  const infoCount = marks.filter((m) => m.level === 'info').length;

  // 评分逻辑：高危 -20/个，警告 -5/个，提示 -2/个，最低 0
  const penalty = highCount * 20 + warningCount * 5 + infoCount * 2;
  const score = Math.max(0, 100 - penalty);

  // 5. 生成优化后脚本
  const { optimizedText, diffData } = generateOptimizedScript(text, marks);

  const result: ReviewResult = {
    id: `review_${Date.now()}`,
    originalText: text,
    score,
    marks,
    summary: { high: highCount, warning: warningCount, info: infoCount },
    optimizedText,
    diffData,
    reviewedAt: Date.now(),
  };

  return result;
}

// 生成优化后脚本
function generateOptimizedScript(
  text: string,
  marks: SensitiveMark[]
): { optimizedText: string; diffData: ReviewResult['diffData'] } {
  const diffData: ReviewResult['diffData'] = [];
  const sortedMarks = [...marks].sort((a, b) => a.startIndex - b.startIndex);

  let optimizedText = '';
  let lastIdx = 0;

  for (const mark of sortedMarks) {
    // 保留标记前的正常文本
    optimizedText += text.slice(lastIdx, mark.startIndex);
    diffData.push({ type: 'keep', text: text.slice(lastIdx, mark.startIndex) });

    // 标记删除的原词
    diffData.push({ type: 'remove', text: mark.word, suggestion: mark.suggestion });

    // 替换为优化后的词（取第一个替代词，如果没有则用 [已删除]）
    const replacement = mark.alternatives.length > 0 ? mark.alternatives[0] : '';
    if (replacement) {
      optimizedText += replacement;
      diffData.push({ type: 'add', text: replacement, suggestion: `替换"${mark.word}"` });
    } else {
      diffData.push({ type: 'remove', text: mark.word, suggestion: `建议删除"${mark.word}"` });
    }

    lastIdx = mark.endIndex;
  }

  // 剩余正常文本
  optimizedText += text.slice(lastIdx);
  if (lastIdx < text.length) {
    diffData.push({ type: 'keep', text: text.slice(lastIdx) });
  }

  return { optimizedText, diffData };
}