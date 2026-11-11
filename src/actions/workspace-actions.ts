'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createDefaultWorkspaceForNewUser(userId: string, email: string) {
    const supabase = await createClient();

    // 1. Gumawa ng workspace pangalan mula sa email ng user
    const workspaceName = `${email.split('@')[0]}'s Workspace`;
    const slug = `${email.split('@')[0]}-${Date.now()}`;

    // 2. I-insert sa 'workspaces' table
    const { data: workspace, error: wsError } = await supabase
        .from('workspaces')
        .insert([{ name: workspaceName, slug }])
        .select()
        .single();

    if (wsError || !workspace) {
        console.error('Error sa paggawa ng workspace:', wsError?.message);
        throw new Error('Hindi nabuo ang workspace.');
    }

    // 3. I-link ang user bilang OWNER sa 'workspace_members' table
    const { error: memberError } = await supabase
        .from('workspace_members')
        .insert([
            {
                workspace_id: workspace.id,
                user_id: userId,
                role: 'OWNER',
            },
        ]);

    if (memberError) {
        console.error('Error sa pag-link ng member:', memberError.message);
        throw new Error('Hindi nailagay ang user sa workspace.');
    }

    revalidatePath('/dashboard');
    return { success: true, workspace };
}