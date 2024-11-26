import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Search, Tag } from 'lucide-react';
import { TreatmentTemplate } from '../../contexts/TreatmentTemplatesContext';

interface TemplateSelectorProps {
  templates: TreatmentTemplate[];
  onSelect: (content: string) => void;
}

export default function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(templates.map(t => t.category || '基本')));

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-4 w-4" />
          <input
            type="text"
            placeholder="定型文を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-blue-500 text-white'
                : 'bg-mono-100 text-mono-600 hover:bg-mono-200'
            }`}
          >
            すべて
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === selectedCategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-mono-100 text-mono-600 hover:bg-mono-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredTemplates.map((template) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onSelect(template.content)}
            className="group relative flex flex-col p-4 bg-white border border-mono-200 hover:border-blue-500 rounded-xl transition-all duration-200 hover:shadow-md text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-mono-900 group-hover:text-blue-600 transition-colors">
                  {template.title}
                </span>
              </div>
              {template.category && (
                <div className="flex items-center gap-1 px-2 py-1 bg-mono-100 rounded-full">
                  <Tag className="h-3 w-3 text-mono-500" />
                  <span className="text-xs text-mono-600">{template.category}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-mono-500 line-clamp-2 mb-2">
              {template.content.split('\n')[0]}
            </p>
            <div className="flex items-center justify-end mt-auto">
              <span className="flex items-center text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                クリックして挿入
                <ChevronRight className="h-3 w-3 ml-1" />
              </span>
            </div>
          </motion.button>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-8 text-mono-500">
            該当する定型文が見つかりません
          </div>
        )}
      </div>
    </div>
  );
}
