import React from 'react';
import { ProjectCommentsSection } from '../components/ProjectCommentsSection';

const TestCommentsPage = () => {
  // Use any valid project ID for testing
  return (
    <div className="max-w-2xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8">Test Comment Section</h1>
      <ProjectCommentsSection projectId={8} />
    </div>
  );
};

export default TestCommentsPage;
