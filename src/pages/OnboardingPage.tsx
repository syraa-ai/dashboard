import React from 'react';

const OnboardingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-brand-purple dark:text-brand-purple-light mb-4">Welcome!</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          It looks like this is your first time logging in or your profile is incomplete.
          Please complete your profile setup to access the dashboard.
        </p>
        <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to profile setup...</p>
        {/* In a real application, you would redirect to a profile setup form here */}
      </div>
    </div>
  );
};

export default OnboardingPage;