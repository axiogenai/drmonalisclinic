'use client';

import React from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { Calendar, ShoppingBag, Stethoscope, Star, ArrowRight, PlusCircle, Clock, Images, GraduationCap, Building2, TicketPercent, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardOverview() {
  const { appointments, products, services, testimonials, results, coupons = [] } = useAdminData();
  const router = useRouter();

  // Sort and get recent appointments
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">New</span>;
      case 'confirmed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Total Appointments */}
        <div 
          onClick={() => router.push('?tab=appointments')}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:border-teal-300 transition-colors"
        >
          <div className="p-4 lg:p-5 flex items-center">
            <div className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center mr-3 shrink-0">
              <Calendar className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Appointments</p>
              <p className="text-xl font-bold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>

        {/* 2. Active Services */}
        <div 
          onClick={() => router.push('?tab=services')}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:border-violet-300 transition-colors"
        >
          <div className="p-4 lg:p-5 flex items-center">
            <div className="w-11 h-11 rounded-full bg-violet-50 flex items-center justify-center mr-3 shrink-0">
              <Stethoscope className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Services</p>
              <p className="text-xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>

        {/* 3. Total Products */}
        <div 
          onClick={() => router.push('?tab=products')}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <div className="p-4 lg:p-5 flex items-center">
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center mr-3 shrink-0">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Products</p>
              <p className="text-xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        {/* 4. Active Coupons */}
        <div 
          onClick={() => router.push('?tab=coupons')}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:border-teal-400 transition-colors"
        >
          <div className="p-4 lg:p-5 flex items-center">
            <div className="w-11 h-11 rounded-full bg-[#108283]/10 flex items-center justify-center mr-3 shrink-0">
              <TicketPercent className="h-5 w-5 text-[#108283]" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Coupons</p>
              <p className="text-xl font-bold text-gray-900">{coupons.length}</p>
            </div>
          </div>
        </div>

        {/* 5. Before & After Results */}
        <div 
          onClick={() => router.push('?tab=results')}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="p-4 lg:p-5 flex items-center">
            <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center mr-3 shrink-0">
              <Images className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Transformations</p>
              <p className="text-xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>

        {/* 6. Testimonials */}
        <div 
          onClick={() => router.push('?tab=testimonials')}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="p-4 lg:p-5 flex items-center">
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center mr-3 shrink-0">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Reviews</p>
              <p className="text-xl font-bold text-gray-900">{testimonials.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Appointments Table - Grows naturally with rows */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Appointments</h3>
              <p className="text-xs text-gray-400 font-['Source_Sans_3']">
                {recentAppointments.length === 0 ? 'No bookings logged yet' : `${recentAppointments.length} most recent patient booking${recentAppointments.length === 1 ? '' : 's'}`}
              </p>
            </div>
            <button 
              onClick={() => router.push('?tab=appointments')}
              className="text-xs sm:text-sm font-semibold text-[#108283] hover:text-[#0c6b6c] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            {recentAppointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 font-['Source_Sans_3']">
                  {recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900">{apt.fullName || (apt as any).name}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-500">{apt.phone}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-500">{apt.date}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-500">{apt.condition}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {getStatusBadge(apt.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2.5 text-gray-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-0.5">No appointments yet</h4>
                <p className="text-xs text-gray-400 max-w-xs font-['Source_Sans_3']">
                  When patients book appointments, they will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - Slim modern cards without scrolling */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</h3>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Shortcuts</span>
          </div>
          <div className="p-3 space-y-2">
            {[
              {
                tab: 'appointments',
                label: 'Patient Appointments',
                desc: 'Review scheduled visits & consultation requests',
                icon: Calendar,
                iconBg: 'bg-teal-50 text-teal-700',
              },
              {
                tab: 'services',
                label: 'Manage Services',
                desc: 'Homeopathy, Cosmetic & Hair treatments',
                icon: Stethoscope,
                iconBg: 'bg-violet-50 text-violet-700',
              },
              {
                tab: 'products',
                label: 'Manage Products',
                desc: 'Skincare products, pricing & stock status',
                icon: PlusCircle,
                iconBg: 'bg-emerald-50 text-emerald-700',
              },
              {
                tab: 'coupons',
                label: 'Coupons & Discounts',
                desc: 'Issue limited-time promo codes & track usage',
                icon: TicketPercent,
                iconBg: 'bg-teal-50 text-[#108283]',
              },
              {
                tab: 'results',
                label: 'Before & After Results',
                desc: 'Manage clinical before/after transformations',
                icon: Images,
                iconBg: 'bg-rose-50 text-rose-700',
              },
              {
                tab: 'about',
                label: 'About & Doctors CMS',
                desc: 'Doctor degrees, council numbers & clinical bios',
                icon: GraduationCap,
                iconBg: 'bg-amber-50 text-amber-700',
              },
              {
                tab: 'footer',
                label: 'Footer & Clinic Hours',
                desc: 'Update clinic phone, timings & address',
                icon: Building2,
                iconBg: 'bg-blue-50 text-blue-700',
              },
            ].map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.tab}
                  onClick={() => router.push(`?tab=${action.tab}`)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-gray-100 hover:border-[#108283]/40 hover:bg-[#108283]/5 transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.iconBg} group-hover:scale-105 transition-transform`}>
                      <ActionIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#108283] transition-colors leading-tight truncate">
                        {action.label}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-['Source_Sans_3'] truncate leading-tight">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#108283] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
