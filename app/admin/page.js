'use client'
import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AppointmentAdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [showApplications, setShowApplications] = useState(false);
  const [statuses, setStatuses] = useState({});

 
  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/getappointments'); 
      const data = await response.json();
      const updatedData = data.map(appointment => ({ ...appointment, isChecked: false }));
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

  // New Graphs: Monthly Appointment Statuses and Checked/Unchecked by Status
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
      <p className='text-center text-xl sm:text-2xl font-semibold mb-5'>Admin Panel - Appointment Booking</p>
      
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-600"
          onClick={() => setShowApplications(!showApplications)}
        >
          {showApplications ? 'Close Applications' : 'Show Applications'}
        </button>
      </div>

      {showApplications ? (
        <div className="overflow-auto">
          <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
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
              {appointments.map((appointment, index) => (
                <tr key={index} className={`${statuses[index] === "Confirmed" ? 'bg-green-100' : statuses[index] === "Canceled" ? 'bg-red-100' : ''}`}>
                  <td className="border px-2 sm:px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.name}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.email}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.date}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.time}</td>
                  <td className="border px-2 sm:px-4 py-2">{appointment.comments}</td>
                  <td className="border px-2 sm:px-4 py-2">{getRemainingTime(appointment.date, appointment.time)}</td>
                  <td className="border px-2 sm:px-4 py-2">
                    <select
                      value={statuses[index] || "Pending"}
                      onChange={(e) => updateStatus(index, e.target.value)}
                      className="rounded border p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                  <td className={`border px-2 sm:px-4 py-2 text-center ${appointment.isChecked ? 'bg-green-100' : 'bg-red-100'}`}>
                    <input type="checkbox" checked={appointment.isChecked} onChange={() => handleCheckToggle(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
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
