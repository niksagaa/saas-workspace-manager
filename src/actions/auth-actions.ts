'use server';

import { createClient } from '@/lib/supabase/server';
import { createDefaultWorkspaceForNewUser } from './workspace-actions';
import { redirect } from 'next/navigation';

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Kailangan ang email at password.' };
  }

  const supabase = await createClient();

  // 1. I-register ang user sa Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // 2. Kung matagumpay na nagawa ang user, gawan siya ng default workspace
  if (data.user) {
    try {
      await createDefaultWorkspaceForNewUser(data.user.id, data.user.email!);
    } catch (err: any) {
      console.error('Workspace creation failed:', err.message);
      return { success: false, error: 'Nag-fail ang paggawa ng workspace.' };
    }
  }

  // 3. I-redirect papuntang dashboard pagkatapos mag-sign up
  redirect('/dashboard');
}