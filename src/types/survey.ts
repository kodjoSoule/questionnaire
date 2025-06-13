export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'select' | 'textarea' | 'checkbox';
  options?: string[];
  required?: boolean;
  category?: string;
}

export interface SurveyResponse {
  userId: string;
  questionGroup: string;
  [key: string]: string | boolean | number;
}

export interface ApiResponse {
  questions: Question[];
  status: string;
  message?: string;
}

export interface UserResponse {
  id: string;
  userId: string;
  questionGroup: string;
  responses: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}