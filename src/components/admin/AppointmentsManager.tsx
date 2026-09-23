'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Trash2, Calendar } from 'lucide-react';
import { useAdminData, Appointment } from '@/context/AdminContext';
import { useDialog } from '@/context/DialogContext';
import AdminModal from './AdminModal';
import AdminSelect, { AdminSelectOption } from './AdminSelect';

export default function AppointmentsManager() {
  const { appointments, updateAppointmentStatus, deleteAppointment, clearAppointments } = useAdminData();
  const { confirm, toast } = useDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments
    .filter((apt: Appointment) => 
      ((apt.fullName || (apt as any).name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
       (apt.phone || '').includes(searchTerm)) &&
      (statusFilter === 'All' || apt.status.toLowerCase() === statusFilter.toLowerCase())
    )
    .sort((a: Appointment, b: Appointment) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleClearAll = async () => {
    const ok = await confirm({
      title: 'Clear All Bookings',
      message: 'Are you sure you want to clear all booked appointments? This action cannot be undone and will permanently remove all patient bookings.',
      confirmText: 'Clear All',
      cancelText: 'Keep Bookings',
      type: 'danger',
    });
    if (ok) {
      clearAppointments();
      toast({
        title: 'Appointments Cleared',
        message: 'All booked appointments have been successfully removed.',
        type: 'success',
      });
    }
  };

  const handleDeleteAppointment = async (apt: Appointment) => {
    const patientName = apt.fullName || (apt as any).name || 'this patient';
    const ok = await confirm({
      title: 'Delete Appointment',
      message: `Are you sure you want to delete the appointment for "${patientName}"? This record will be permanently removed.`,
      confirmText: 'Delete Booking',
      cancelText: 'Cancel',
      type: 'danger',
    });
    if (ok) {
      deleteAppointment(apt.id);
      if (selectedAppointment?.id === apt.id) {
        setSelectedAppointment(null);
      }
      toast({
        title: 'Appointment Deleted',
        message: `Booking for "${patientName}" has been removed.`,
        type: 'success',
      });
    }
  };

  const handleUpdateStatus = (id: string, status: Appointment['status'], label: string) => {
    updateAppointmentStatus(id, status);
    toast({
      title: 'Status Updated',
      message: `Appointment marked as ${label}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <AdminSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={[
                { value: 'All', label: `All Statuses (${appointments.length})` },
                { value: 'New', label: 'New' },
                { value: 'Confirmed', label: 'Confirmed' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
              width="w-44 sm:w-52"
              buttonClassName="bg-white py-2"
            />
          </div>
          {appointments.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              title="Clear all appointments"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Phone</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Date/Time</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Condition</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <Calendar className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {appointments.length === 0 ? 'No booked appointments yet' : 'No matching appointments found'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointments.length === 0 
                          ? 'Consultation requests booked by patients on the website will be recorded and displayed here in real time.'
                          : 'Try adjusting your search query or status filter above.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt: Appointment) => (
                  <tr key={apt.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{apt.fullName || (apt as any).name}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{apt.phone}</td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      <div>{apt.date}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{apt.condition || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="p-1.5 text-gray-400 hover:text-[#108283] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {apt.status?.toLowerCase() === 'new' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'confirmed', 'Confirmed')}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {apt.status?.toLowerCase() === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'completed', 'Completed')}
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Mark Completed"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        {apt.status?.toLowerCase() !== 'cancelled' && apt.status?.toLowerCase() !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'cancelled', 'Cancelled')}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAppointment(apt)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <div className="font-medium">{selectedAppointment.fullName || (selectedAppointment as any).name}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                <div className="font-medium">{selectedAppointment.phone}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Date</label>
                <div className="font-medium">{selectedAppointment.date}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize inline-block mt-1 ${getStatusBadge(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-500 mb-1">Condition</label>
                <div className="font-medium">{selectedAppointment.condition || 'Not specified'}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-500 mb-1">Message</label>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700">
                  {selectedAppointment.message || 'No message provided.'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
              {selectedAppointment.status?.toLowerCase() === 'new' && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedAppointment.id, 'confirmed', 'Confirmed');
                    setSelectedAppointment(null);
                  }}
                  className="px-4 py-2 bg-[#108283] text-white rounded-xl hover:bg-[#188D90] transition-colors cursor-pointer"
                >
                  Confirm Appointment
                </button>
              )}
              {selectedAppointment.status?.toLowerCase() === 'confirmed' && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedAppointment.id, 'completed', 'Completed');
                    setSelectedAppointment(null);
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Mark Completed
                </button>
              )}
              {selectedAppointment.status?.toLowerCase() !== 'cancelled' && selectedAppointment.status?.toLowerCase() !== 'completed' && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedAppointment.id, 'cancelled', 'Cancelled');
                    setSelectedAppointment(null);
                  }}
                  className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer text-sm font-medium"
                >
                  Cancel Appointment
                </button>
              )}
              <button
                onClick={() => handleDeleteAppointment(selectedAppointment)}
                className="ml-auto px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-sm font-medium"
              >
                Delete Booking
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
