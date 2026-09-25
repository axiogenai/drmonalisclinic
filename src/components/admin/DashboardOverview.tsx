'use client';

import React from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { Calendar, ShoppingBag, Stethoscope, Star, ArrowRight, PlusCircle, Clock, Images, GraduationCap, Building2, TicketPercent } from 'lucide-react';
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
            <button 
              onClick={() => router.push('?tab=appointments')}
              className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            {recentAppointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{apt.fullName || (apt as any).name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{apt.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{apt.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{apt.condition}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(apt.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 mb-1">No appointments yet</h4>
                <p className="text-sm text-gray-500 max-w-sm">When patients book appointments, they will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-3">
            <button 
              onClick={() => router.push('?tab=appointments')}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all group flex items-start"
            >
              <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700">Patient Appointments</h4>
                <p className="text-xs text-gray-500 mt-1">Review scheduled patient visits and consultation requests.</p>
              </div>
            </button>

            <button 
              onClick={() => router.push('?tab=services')}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all group flex items-start"
            >
              <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-colors">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-violet-700">Manage Services</h4>
                <p className="text-xs text-gray-500 mt-1">Update treatments across Homeopathy, Cosmetic, and Hair &amp; Skin.</p>
              </div>
            </button>

            <button 
              onClick={() => router.push('?tab=products')}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all group flex items-start"
            >
              <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700">Manage Products</h4>
                <p className="text-xs text-gray-500 mt-1">Add or update skincare products, pricing, and stock status.</p>
              </div>
            </button>

            <button 
              onClick={() => router.push('?tab=coupons')}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all group flex items-start"
            >
              <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-[#108283]/10 text-[#108283] flex items-center justify-center group-hover:bg-[#108283] group-hover:text-white transition-colors">
                <TicketPercent className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#108283]">Coupons &amp; Discounts</h4>
                <p className="text-xs text-gray-500 mt-1">Issue limited-time promo codes and track usage limits.</p>
              </div>
            </button>

            <button 
              onClick={() => router.push('?tab=results')}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all group flex items-start"
            >
              <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Images className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-rose-700">Before &amp; After Results</h4>
                <p className="text-xs text-gray-500 mt-1">Manage clinical before/after photo transformations and metrics.</p>
              </div>
            </button>

            <button 
              onClick={() => router.push('?tab=about')}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all group flex items-start"
            >
              <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-amber-700">About &amp; Doctors CMS</h4>
                <p className="text-xs text-gray-500 mt-1">Edit doctor degrees, council reg numbers, clinical bios, and stats.</p>
              </div>
            </button>

            <button 
              onClick={() => router.push('?tab=footer')}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all group flex items-start"
            >
              <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Footer &amp; Clinic Hours</h4>
                <p className="text-xs text-gray-500 mt-1">Update phone, timings, address, social handles, and credits.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
