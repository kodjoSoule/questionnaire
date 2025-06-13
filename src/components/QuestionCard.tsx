import React from 'react';
import { CheckCircle } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  type: string;
  options?: string[];
  value: string;
  onChange: (value: string) => void;
  fieldName: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  type,
  options = [],
  value,
  onChange,
  fieldName
}) => {
  const renderInput = () => {
    if (type === 'radio' && options.length > 0) {
      return (
        <div className="space-y-3">
          {options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 ${
                value === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <input
                type="radio"
                name={fieldName}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                value === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {value === option && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (type === 'select' && options.length > 0) {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white text-gray-700"
        >
          <option value="">Sélectionnez une option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
        placeholder="Votre réponse..."
      />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
        {question}
      </h3>
      {renderInput()}
    </div>
  );
};

export default QuestionCard;