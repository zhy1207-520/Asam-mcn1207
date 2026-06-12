// 平台规则库页
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { platformRules, rulesByYear, allYears } from '@/engine/rules';
import { Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export default function RulesPage() {
  const [search, setSearch] = useState('');
  const [expandedYear, setExpandedYear] = useState<number | null>(allYears[0]);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const filteredRules = useMemo(() => {
    if (!search.trim()) return platformRules;
    const q = search.toLowerCase();
    return platformRules.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [search]);

  const toggleRule = (id: string) => {
    setExpandedRules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          平台规则库
        </h1>
        <p className="text-sm text-[var(--color-ink-light)]">
          收录微信视频号历年平台规则规范，持续更新中
        </p>
      </motion.div>

      {/* 搜索框 */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-light)]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索规则关键词..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-1"
          style={{
            borderColor: 'var(--color-border)',
            background: '#fff',
          }}
        />
      </div>

      {search.trim() ? (
        /* 搜索结果 */
        <div className="space-y-3">
          {filteredRules.length === 0 ? (
            <p className="text-center py-10 text-[var(--color-ink-light)]">
              未找到匹配的规则
            </p>
          ) : (
            filteredRules.map((rule, idx) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="rounded-xl p-4"
                style={{ background: '#fff', boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: rule.priority === 'high' ? 'var(--color-danger-bg)' : 'var(--color-bg)',
                          color: rule.priority === 'high' ? 'var(--color-danger)' : 'var(--color-ink-light)',
                        }}
                      >
                        {rule.priority === 'high' ? '重要' : '一般'}
                      </span>
                      <span className="text-xs text-[var(--color-ink-light)]">
                        {rule.year} · {rule.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold">{rule.title}</h3>
                    <p className="text-xs text-[var(--color-ink-light)] mt-1 line-clamp-2">
                      {rule.content}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    {expandedRules.has(rule.id) ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>
                {expandedRules.has(rule.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-[var(--color-border-light)]"
                  >
                    <p className="text-sm leading-relaxed text-[var(--color-ink-light)]">
                      {rule.content}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      ) : (
        /* 按年份浏览 */
        <div className="space-y-3">
          {allYears.map((year) => (
            <div key={year}>
              <button
                onClick={() =>
                  setExpandedYear(expandedYear === year ? null : year)
                }
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 hover:shadow-sm"
                style={{
                  background:
                    expandedYear === year
                      ? 'var(--color-accent)'
                      : '#fff',
                  color:
                    expandedYear === year ? '#fff' : 'var(--color-ink)',
                  boxShadow:
                    expandedYear === year
                      ? 'var(--shadow-md)'
                      : 'var(--shadow-sm)',
                }}
              >
                <span className="font-semibold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {year} 年
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background:
                      expandedYear === year
                        ? 'rgba(255,255,255,0.2)'
                        : 'var(--color-bg)',
                  }}
                >
                  {rulesByYear[year]?.length || 0} 条规则
                </span>
              </button>

              {expandedYear === year && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-2 space-y-2 pl-2"
                >
                  {(rulesByYear[year] || []).map((rule, idx) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="rounded-xl p-3 ml-4 border-l-2"
                      style={{
                        background: '#fff',
                        borderColor: rule.priority === 'high' ? 'var(--color-danger)' : 'var(--color-accent)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            background:
                              rule.priority === 'high'
                                ? 'var(--color-danger-bg)'
                                : 'var(--color-bg)',
                            color:
                              rule.priority === 'high'
                                ? 'var(--color-danger)'
                                : 'var(--color-ink-light)',
                          }}
                        >
                          {rule.priority === 'high' ? '重要' : '一般'}
                        </span>
                        <span className="text-[10px] text-[var(--color-ink-light)]">
                          {rule.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold">{rule.title}</h4>
                      <p className="text-xs text-[var(--color-ink-light)] mt-1">
                        {rule.content}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}