import React, { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import SurveyContent from './components/SurveyContent';
import ResponsesView from './components/ResponsesView';

function App() {
  const [activeTab, setActiveTab] = useState<'survey' | 'responses'>('survey');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'survey' ? <SurveyContent /> : <ResponsesView />}
      </div>
    </div>
  );
}

export default App;