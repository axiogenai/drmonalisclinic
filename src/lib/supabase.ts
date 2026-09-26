import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Appointment } from '@/types/admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-project') && 
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =========================================================
// Appointments API with Supabase & Fallback
// =========================================================

export async function getAppointmentsFromDb(): Promise<Appointment[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getAppointments error:', error.message);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      fullName: row.full_name || row.fullName || '',
      phone: row.phone || '',
      date: row.date || '',
      condition: row.condition || '',
      message: row.message || '',
      status: row.status || 'new',
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('Failed to fetch appointments from Supabase:', err);
    return null;
  }
}

export async function saveAppointmentToDb(appointment: Appointment): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('appointments').upsert({
      id: appointment.id,
      full_name: appointment.fullName,
      phone: appointment.phone,
      date: appointment.date,
      condition: appointment.condition,
      message: appointment.message || '',
      status: appointment.status,
      created_at: appointment.createdAt,
    });

    if (error) {
      console.warn('Supabase saveAppointment error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save appointment to Supabase:', err);
    return false;
  }
}

export async function updateAppointmentStatusInDb(id: string, status: Appointment['status']): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.warn('Supabase updateAppointmentStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to update appointment status in Supabase:', err);
    return false;
  }
}

export async function deleteAppointmentFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// =========================================================
// Supabase Storage Bucket Upload (clinic-media)
// =========================================================

export async function uploadImageToSupabase(file: File | Blob, fileName: string, folder: string = 'uploads'): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const fileExt = fileName.split('.').pop() || 'jpg';
    const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('clinic-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from('clinic-media')
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (err) {
    console.warn('Failed to upload image to Supabase storage:', err);
    return null;
  }
}

// =========================================================
// Universal Clinic Settings API (Multi-domain Sync)
// =========================================================

export async function getSettingFromDb<T>(key: string): Promise<T | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('data')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) return null;
    return data.data as T;
  } catch (err) {
    console.warn(`Failed to fetch setting ${key} from Supabase:`, err);
    return null;
  }
}

export async function getAllSettingsFromDb(): Promise<Record<string, any>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('key, data');

    if (error || !data) return {};
    const map: Record<string, any> = {};
    for (const row of data) {
      map[row.key] = row.data;
    }
    return map;
  } catch (err) {
    console.warn('Failed to fetch all settings from Supabase:', err);
    return {};
  }
}

export async function saveSettingToDb(key: string, data: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('clinic_settings')
      .upsert({
        key,
        data,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn(`Failed to save setting ${key} to Supabase:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Failed to save setting ${key} to Supabase:`, err);
    return false;
  }
}
