-- =========================================================================
-- Supabase Schema for Dr. Monali's Homeopathy Clinic & Clinical CRM
-- Run this SQL in your Supabase Project -> SQL Editor
-- =========================================================================

-- 1. Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Patients & CRM Leads Table
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    condition TEXT,
    stage TEXT NOT NULL DEFAULT 'new_lead' CHECK (stage IN ('new_lead', 'contacted', 'scheduled', 'in_treatment', 'completed', 'follow_up')),
    source TEXT NOT NULL DEFAULT 'website_booking' CHECK (source IN ('website_booking', 'skin_diagnostic', 'whatsapp', 'walk_in', 'manual')),
    notes TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    total_visits INTEGER DEFAULT 1,
    last_contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    condition TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CRM Activities & Consultation Notes Table
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('note', 'call', 'whatsapp', 'consultation', 'status_change')),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT DEFAULT 'Clinic Staff'
);

-- 5. Diagnostic Quiz & Website Inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    skin_type TEXT,
    concerns TEXT[],
    recommendations JSONB,
    source TEXT DEFAULT 'skin_diagnostic',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_phone ON public.patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_stage ON public.patients(stage);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_crm_activities_patient ON public.crm_activities(patient_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Permissive policies for website visitors & admin access with anon key
-- (For production hardening, service role keys or Supabase Auth can be applied)
CREATE POLICY "Allow public insert on appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon read on appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Allow anon update on appointments" ON public.appointments FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on appointments" ON public.appointments FOR DELETE USING (true);

CREATE POLICY "Allow public insert on patients" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon read on patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow anon update on patients" ON public.patients FOR UPDATE USING (true);

CREATE POLICY "Allow anon all on crm_activities" ON public.crm_activities FOR ALL USING (true);
CREATE POLICY "Allow public insert on inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon read on inquiries" ON public.inquiries FOR SELECT USING (true);
