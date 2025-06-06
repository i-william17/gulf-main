import React from 'react';
import PropTypes from 'prop-types';

const ReportSection = ({ title, data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <SectionWrapper title={title}>
        <p className="text-gray-500">No data available.</p>
      </SectionWrapper>
    );
  }

  const renderItem = (key, value) => {
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={key} className="ml-3 pl-4 border-l-2 border-blue-100 space-y-1">
          <h4 className="text-sm font-semibold text-gray-700">{formattedKey}</h4>
          {Object.entries(value).map(([subKey, subValue]) => renderItem(subKey, subValue))}
        </div>
      );
    }

    return (
      <div key={key} className="text-sm">
        <span className="font-medium text-gray-700">{formattedKey}:</span>{' '}
        <span className="text-gray-600">{value || 'N/A'}</span>
      </div>
    );
  };

  return (
    <SectionWrapper title={title}>
      <div className="pl-1 space-y-2">
        {Object.entries(data).map(([key, value]) => renderItem(key, value))}
      </div>
    </SectionWrapper>
  );
};

const SectionWrapper = ({ title, children }) => (
  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
    <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">
      {title}
    </h3>
    {children}
  </div>
);

SectionWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ReportSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default ReportSection;
