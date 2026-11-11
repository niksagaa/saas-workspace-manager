'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createBoardAction(formData: FormData): Promise<void> {
    const workspaceId = formData.get('workspaceId') as string;
    const title = formData.get('title') as string;

    if (!title || !workspaceId) {
        return;
    }

    const supabase = await createClient();

    await supabase
        .from('boards')
        .insert([
            {
                workspace_id: workspaceId,
                title: title.trim(),
            },
        ]);

    revalidatePath('/dashboard');
}