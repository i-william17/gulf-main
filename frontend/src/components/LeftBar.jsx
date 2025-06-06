import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  ChevronRight,
  Activity,
  Calendar,
  Users,
  FileText,
  Settings,
} from 'lucide-react';

const LeftBar = () => {
  const [labReports, setLabReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/lab');
        setLabReports(response.data.data || []);
      } catch (error) {
        console.error('Error fetching lab reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent animate-pulse" />

      <div className="relative z-10 backdrop-blur-sm bg-white/5">

        {/* Lab Reports Preview */}
        <div className="px-6 mt-4 space-y-2 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-transparent">
          <h4 className="text-teal-200 font-semibold text-lg mb-2">Recent Lab Reports</h4>

          {isLoading ? (
            <p className="text-teal-100 text-sm">Loading reports...</p>
          ) : labReports.length === 0 ? (
            <p className="text-teal-100 text-sm">No reports available.</p>
          ) : (
            labReports.slice(0, 5).map((report) => (
              <Link
                className="block p-2 rounded-md bg-white/10 hover:bg-teal-700/40 transition-colors"
              >
                <p className="text-sm font-medium">{report.patientName || 'Unnamed'}</p>
                <p className="text-xs text-teal-200">
                  Lab No: {report.labNumber} •{' '}
                  {new Date(report.timestamp || report.timeStamp).toLocaleDateString()}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500/50 via-teal-300/50 to-teal-500/50" />
    </div>
  );
};

export default LeftBar;
