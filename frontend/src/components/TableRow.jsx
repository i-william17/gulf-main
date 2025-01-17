import React from 'react';
import { Field, ErrorMessage } from 'formik';

const TableRow = ({ testName, namePrefix, unitsPlaceholder, rangePlaceholder, disabled }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
      <td className="px-4 py-3 text-gray-700 font-medium">
        {testName}
      </td>
      <td className="px-4 py-3">
        <Field
          name={`${namePrefix}.value`}
          type="text"
          placeholder="Enter Value"
          disabled={disabled}
          className={`w-full p-2 border ${disabled ? 'bg-gray-100 text-gray-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
        />
        <ErrorMessage
          name={`${namePrefix}.value`}
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </td>
      
      {unitsPlaceholder && (
        <td className="px-4 py-3 text-gray-600 italic">
          {unitsPlaceholder}
        </td>
      )}

      <td className="px-4 py-3">
        <Field
          name={`${namePrefix}.status`}
          as="select"
          disabled={disabled}
          className={`w-full p-2 border ${disabled ? 'bg-gray-100 text-gray-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
        >
          <option value="">Select Status</option>
          <option value="normal">Normal</option>
          <option value="abnormal">Abnormal</option>
        </Field>
        <ErrorMessage
          name={`${namePrefix}.status`}
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </td>

      <td className="px-4 py-3">
        <Field
          name={`${namePrefix}.range`}
          type="text"
          placeholder={rangePlaceholder}
          disabled={disabled}
          className={`w-full p-2 border ${disabled ? 'bg-gray-100 text-gray-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
        />
        <ErrorMessage
          name={`${namePrefix}.range`}
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </td>
    </tr>
  );
};

export default TableRow;
