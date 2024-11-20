import React from 'react';
import PropTypes from 'prop-types';

const ReportSection = ({ title, data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">{title}</h3>
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  // Recursive rendering for nested objects
  const renderData = (key, value) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div className="pl-4 space-y-2 border-l-2 border-blue-100 ml-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="text-sm">
              <span className="font-medium text-gray-700">
                {subKey.charAt(0).toUpperCase() + subKey.slice(1).replace(/([A-Z])/g, ' $1')}:
              </span>{' '}
              {typeof subValue === 'object' ? renderData(subKey, subValue) : <span className="text-gray-600">{subValue || 'N/A'}</span>}
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-gray-600">{value || 'N/A'}</span>;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-2">{title}</h3>
      <div className="pl-4 space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="text-sm">
            <span className="font-medium text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
            </span>{' '}
            {typeof value === 'object' ? renderData(key, value) : <span className="text-gray-600">{value || 'N/A'}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

ReportSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        units: PropTypes.string,
        status: PropTypes.string,
        range: PropTypes.string,
      }),
    ])
  ),
};

export default ReportSection;
