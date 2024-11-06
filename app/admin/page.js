'use client'
import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AppointmentAdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [showApplications, setShowApplications] = useState(false);
  const [statuses, setStatuses] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [filters, setFilters] = useState({
    status: '',
    dateRange: { start: '', end: '' },
    checked: null,
  });

  const handleSortChange = (value) => {
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      key: value,
    }));
  };

  const applySorting = (appointments) => {
    return appointments.sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortConfig.key === 'dateAndTime') {
        const dateTimeA = new Date(`${a.date} ${a.time}`);
        const dateTimeB = new Date(`${b.date} ${b.time}`);
        return sortConfig.direction === 'asc' ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
      }
      return 0;
    });
  };

  const sortedAppointments = applySorting(appointments);
  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/getappointments');
      const data = await response.json();
      const updatedData = data.map(appointment => ({ ...appointment, isChecked: false, status: appointment.status || ""  }));
      
      setAppointments(updatedData);
    };
    fetchAppointments();
  }, []);

  const updateStatus = (index, newStatus) => {
    setStatuses((prev) => ({ ...prev, [index]: newStatus }));
  };

  const handleCheckToggle = (index) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment, i) =>
        i === index ? { ...appointment, isChecked: !appointment.isChecked } : appointment
      )
    );
  };

  const getRemainingTime = (appointmentDate, appointmentTime) => {
    const appointmentDateTime = new Date(`${appointmentDate} ${appointmentTime}`);
    const currentTime = new Date();
    const diff = appointmentDateTime - currentTime;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments((prevAppointments) => [...prevAppointments]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const applyFilters = (appointments) => {
    return appointments.filter((appointment, index) => {
      const statusMatch = !filters.status || appointment.status === filters.status;
      console.log(`Appointment status: ${appointment.status}, Filter status: ${filters.status}`);
      console.log("Appointment Object:", appointment);


      const checkedMatch = filters.checked === null || appointment.isChecked === filters.checked;
      const dateMatch = (!filters.dateRange.start || !filters.dateRange.end) ||
        (new Date(appointment.date) >= new Date(filters.dateRange.start) &&
          new Date(appointment.date) <= new Date(filters.dateRange.end));

      return statusMatch && checkedMatch && dateMatch;
    });
  };

  const filteredAppointments = applyFilters(sortedAppointments);
  const getTotalAppointmentsData = () => {
    const totalAppointments = appointments.length;
    const appointmentsPerMonth = appointments.reduce((acc, appointment) => {
      const month = new Date(appointment.date).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, []);

    const lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label: 'Appointments Over Time',
                data: appointmentsPerMonth,
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
              },
            ],
          };
      
          return {
            totalAppointments,
            lineData,
          };
        };
      
        const { totalAppointments, lineData } = getTotalAppointmentsData();
      
        const pieData = {
          labels: ['Total Appointments'],
          datasets: [
            {
              data: [totalAppointments],
              backgroundColor: ['#36A2EB'],
              hoverBackgroundColor: ['#36A2EB'],
            },
          ],
        };
      
        const checkedUncheckedData = {
          labels: ['Checked', 'Unchecked'],
          datasets: [
            {
              data: [
                appointments.filter((a) => a.isChecked).length,
                appointments.filter((a) => !a.isChecked).length
              ],
              backgroundColor: ['#A4E5A1', '#FFCCCC'],
              hoverBackgroundColor: ['#A4E5A1', '#FFCCCC'],
            },
          ],
        };
      
        const statusCountsData = {
          labels: ['Pending', 'Confirmed', 'Canceled'],
          datasets: [
            {
              data: [
                appointments.filter((a, i) => statuses[i] === "Pending").length,
                appointments.filter((a, i) => statuses[i] === "Confirmed").length,
                appointments.filter((a, i) => statuses[i] === "Canceled").length,
              ],
              backgroundColor: ['#E5E5E5', '#A4E5A1', '#FFCCCC'],
              hoverBackgroundColor: ['#E5E5E5', '#A4E5A1', '#FFCCCC'],
            },
          ],
        };
      
      
        const monthlyStatusData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Confirmed',
              data: appointments.filter((a) => statuses[a] === "Confirmed").reduce((acc, appointment) => {
                const month = new Date(appointment.date).getMonth();
                acc[month] = (acc[month] || 0) + 1;
                return acc;
              }, []),
              backgroundColor: '#A4E5A1',
            },
            {
              label: 'Pending',
              data: appointments.filter((a) => statuses[a] === "Pending").reduce((acc, appointment) => {
                const month = new Date(appointment.date).getMonth();
                acc[month] = (acc[month] || 0) + 1;
                return acc;
              }, []),
              backgroundColor: '#E5E5E5',
            },
            {
              label: 'Canceled',
              data: appointments.filter((a) => statuses[a] === "Canceled").reduce((acc, appointment) => {
                const month = new Date(appointment.date).getMonth();
                acc[month] = (acc[month] || 0) + 1;
                return acc;
              }, []),
              backgroundColor: '#FFCCCC',
            }
          ]
        };
      
        const checkedByStatusData = {
          labels: ['Pending', 'Confirmed', 'Canceled'],
          datasets: [
            {
              label: 'Checked',
              data: [
                appointments.filter((a, i) => statuses[i] === "Pending" && a.isChecked).length,
                appointments.filter((a, i) => statuses[i] === "Confirmed" && a.isChecked).length,
                appointments.filter((a, i) => statuses[i] === "Canceled" && a.isChecked).length,
              ],
              backgroundColor: '#A4E5A1',
            },
            {
              label: 'Unchecked',
              data: [
                appointments.filter((a, i) => statuses[i] === "Pending" && !a.isChecked).length,
                appointments.filter((a, i) => statuses[i] === "Confirmed" && !a.isChecked).length,
                appointments.filter((a, i) => statuses[i] === "Canceled" && !a.isChecked).length,
              ],
              backgroundColor: '#FFCCCC',
            }
          ]
        };
      

  return (
    <div className="min-h-screen p-5 sm:p-10">
      <p className="text-center text-xl sm:text-2xl font-semibold mb-5">Admin Panel - Appointment Booking</p>
      
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-600"
          onClick={() => setShowApplications(!showApplications)}
        >
          {showApplications ? 'Close Applications' : 'Show Applications'}
        </button>
      </div>

      {showApplications && (
        <div className="mb-4 overflow-auto">
          <div className="flex space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="border rounded px-2 py-1"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Canceled">Canceled</option>
            </select>

            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
              className="border rounded px-2 py-1"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
              className="border rounded px-2 py-1"
            />

            <select
              value={filters.checked === null ? "" : filters.checked ? "Checked" : "Unchecked"}
              onChange={(e) => setFilters({ ...filters, checked: e.target.value === "Checked" ? true : e.target.value === "Unchecked" ? false : null })}
              className="border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="Checked">Checked</option>
              <option value="Unchecked">Unchecked</option>
            </select>
      
            <label htmlFor="sort" className="font-semibold mr-2">Sort By:</label>
            <select
              id="sort"
              value={sortConfig.key}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="date">Date</option>
              <option value="dateAndTime">Date and Time</option>
            </select>
      
          </div>
        </div>
      )}

      {showApplications ? (
        <div className="  overflow-auto max-h-[13000px]">
          <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 sm:px-4 py-2">S.No</th>
                <th className="px-2 sm:px-4 py-2">Name</th>
                <th className="px-2 sm:px-4 py-2">Email</th>
                <th className="px-2 sm:px-4 py-2">Date</th>
                <th className="px-2 sm:px-4 py-2">Time</th>
                <th className="px-2 sm:px-4 py-2">Comments</th>
                <th className="px-2 sm:px-4 py-2">Remaining Time</th>
                <th className="px-2 sm:px-4 py-2">Status</th>
                <th className="px-2 sm:px-4 py-2">Checked</th>
              </tr>
            </thead>
            <tbody>
              {applyFilters(appointments).map((appointment, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-2 sm:px-4 py-2">{index + 1}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.name}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.email}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.date}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.time}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.comments}</td>
                  <td className="border px-2 sm:px-4 py-2">{getRemainingTime(appointment.date, appointment.time)}</td>
                  <td className="border px-2 sm:px-4 py-2">
                    <select
                      value={statuses[index] || 'Pending'}
                      onChange={(e) => updateStatus(index, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="border px-2 sm:px-4 py-2">
                    <input
                      type="checkbox"
                      checked={appointment.isChecked}
                      onChange={() => handleCheckToggle(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) :(
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Appointments Over Time</h2>
                    <div style={{ position: 'relative', height: '300px' }}>
                      <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
        
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Checked / Unchecked</h2>
                    <div style={{ position: 'relative', height: '300px' }}>
                      <Pie data={checkedUncheckedData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
        
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Status Counts</h2>
                    <div style={{ position: 'relative', height: '300px' }}>
                      <Bar data={statusCountsData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
        
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Monthly Appointment Statuses</h2>
                    <div style={{ position: 'relative', height: '300px' }}>
                      <Bar data={monthlyStatusData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
                    </div>
                  </div>
        
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Checked / Unchecked by Status</h2>
                    <div style={{ position: 'relative', height: '300px' }}>
                      <Bar data={checkedByStatusData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
                    </div>
                  </div>
                </div>
              )}
    </div>
  );
};

export default AppointmentAdminPanel;
