import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FaUserInjured,
  FaFileInvoiceDollar,
  FaVials,
  FaFileMedical,
  FaUserPlus,
  FaUsers,
  FaChartPie,
  FaCogs,
} from 'react-icons/fa';
import AllPatients from './AllPatients';
import FinancialStatement from './FinancialStatement';
import LabReports from './LabReports';
import LabIssuing from './LabIssuing';
import UserAccount from './UserAccount';
import AllUsers from './AllUsers';
import Analytics from './Analytics';
import Settings from './Settings';

const AdminSidebar = ({ activeComponent, setActiveComponent }) => {
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-black shadow-2xl text-white fixed transform transition-transform duration-500">
      <div className="flex items-center justify-center py-8 border-b border-gray-700">
        <h2 className="text-2xl font-bold tracking-wider">Dashboard</h2>
      </div>
      <nav className="mt-8">
        <ul className="space-y-4">
          {[
            { label: 'All Patients', icon: FaUserInjured, component: 'AllPatients' },
            { label: 'Financial Statement', icon: FaFileInvoiceDollar, component: 'FinancialStatement' },
            { label: 'All Lab Reports', icon: FaVials, component: 'LabReports' },
            { label: 'Lab Number Issuing', icon: FaFileMedical, component: 'LabIssuing' },
            { label: 'User Account Creation', icon: FaUserPlus, component: 'UserAccount' },
            { label: 'All Users', icon: FaUsers, component: 'AllUsers' },
            { label: 'Analytics', icon: FaChartPie, component: 'Analytics' },
            { label: 'Settings', icon: FaCogs, component: 'Settings' }
          ].map((item) => (
            <li
              key={item.label}
              onClick={() => setActiveComponent(item.component)}
              role="button"
              tabIndex={0}
              className={`group flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-200 
              ${activeComponent === item.component ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
              aria-current={activeComponent === item.component ? 'page' : undefined}
            >
              <item.icon className={`text-2xl ${activeComponent === item.component ? 'text-white' : 'text-teal-300 group-hover:text-blue-400 transition-colors'}`} />
              <span className={`text-base font-medium ${activeComponent === item.component ? 'text-white' : 'text-gray-300 group-hover:text-blue-400'}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

AdminSidebar.propTypes = {
  activeComponent: PropTypes.string.isRequired,
  setActiveComponent: PropTypes.func.isRequired,
};

const Sidebar = () => {
  const [activeComponent, setActiveComponent] = useState('AllPatients');

  const componentsMap = {
    AllPatients: <AllPatients />,
    FinancialStatement: <FinancialStatement />,
    LabReports: <LabReports />,
    LabIssuing: <LabIssuing />,
    UserAccount: <UserAccount />,
    AllUsers: <AllUsers />,
    Analytics: <Analytics />,
    Settings: <Settings />
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <main className="flex-1 p-10 ml-64 transition-all duration-500 ease-in-out bg-white shadow-lg rounded-lg">
        {componentsMap[activeComponent] || <AllPatients />}
      </main>
    </div>
  );
};

export default Sidebar;
