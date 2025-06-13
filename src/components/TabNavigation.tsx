import React from 'react';
import { ClipboardList, FileText } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'survey' | 'responses';
  onTabChange: (tab: 'survey' | 'responses') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onTabChange('survey')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'survey'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Questionnaire
          </button>
          <button
            onClick={() => onTabChange('responses')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'responses'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Mes Réponses
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;