import {
  SavedLead,
  Lead,
  GeneratedSite,
  LeadStatus,
  AppSettings,
  RecentSearch,
  LeadActivity,
  LeadFollowUp,
  LeadMeeting,
  LeadNoteItem,
} from '../types';
import { DEFAULT_SETTINGS, CRM_STATUS_CONFIG } from '../constants';
import { supabase } from '../lib/supabaseClient';

export { DEFAULT_SETTINGS };

async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('Usuário não autenticado.');
  }
  return data.user.id;
}

function rowToSavedLead(row: any): SavedLead {
  return {
    id: row.id,
    lead: row.lead,
    siteData: row.site_data ?? undefined,
    customColors: row.custom_colors ?? undefined,
    status: row.status,
    dealValue: row.deal_value !== null && row.deal_value !== undefined ? Number(row.deal_value) : undefined,
    lostReason: row.lost_reason ?? undefined,
    meetingInfo: row.meeting_info ?? undefined,
    outreachMessage: row.outreach_message ?? '',
    notes: row.notes ?? '',
    notesList: row.notes_list ?? [],
    activities: row.activities ?? [],
    followUp: row.follow_up ?? null,
    generatedAt: row.generated_at,
    updatedAt: row.updated_at,
    closedAt: row.closed_at ?? null,
    lostAt: row.lost_at ?? null,
  };
}

// ---------------------------------------------------------------------------
// Recent Searches
// ---------------------------------------------------------------------------

export async function getRecentSearches(): Promise<RecentSearch[]> {
  const { data, error } = await supabase
    .from('recent_searches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error loading recent searches:', error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    city: row.city,
    state: row.state,
    categoryKey: row.category_key,
    categoryLabel: row.category_label,
    radiusKm: Number(row.radius_km),
    limit: row.limit,
    timestamp: new Date(row.created_at).getTime(),
  }));
}

export async function saveRecentSearch(
  search: Omit<RecentSearch, 'id' | 'timestamp'>
): Promise<RecentSearch[]> {
  try {
    const userId = await getUserId();

    // Remove any existing entry for the same city/state/category to avoid duplicates
    await supabase
      .from('recent_searches')
      .delete()
      .eq('user_id', userId)
      .ilike('city', search.city)
      .ilike('state', search.state)
      .eq('category_key', search.categoryKey);

    await supabase.from('recent_searches').insert({
      user_id: userId,
      city: search.city,
      state: search.state,
      category_key: search.categoryKey,
      category_label: search.categoryLabel,
      radius_km: search.radiusKm,
      limit: search.limit,
    });

    // Trim to the 5 most recent
    const { data: all } = await supabase
      .from('recent_searches')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (all && all.length > 5) {
      const idsToDelete = all.slice(5).map((r) => r.id);
      await supabase.from('recent_searches').delete().in('id', idsToDelete);
    }

    return getRecentSearches();
  } catch (err) {
    console.error('Error saving recent search:', err);
    return getRecentSearches();
  }
}

export async function clearRecentSearches(): Promise<void> {
  const userId = await getUserId();
  await supabase.from('recent_searches').delete().eq('user_id', userId);
}

// ---------------------------------------------------------------------------
// CSV Export (client-side only, no storage involved)
// ---------------------------------------------------------------------------

export function exportSearchLeadsToCsv(leads: Lead[]): void {
  const headers = [
    'ID OSM',
    'Nome da Empresa',
    'Categoria',
    'Lead Score',
    'Qualidade',
    'Status do Site',
    'Telefone',
    'WhatsApp Valido',
    'Endereco',
    'Cidade',
    'Estado',
    'Distancia',
    'Horario de Funcionamento',
  ];

  const rows = leads.map((l) => [
    `"${l.osmType}_${l.osmId}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.categoryLabel || '').replace(/"/g, '""')}"`,
    `"${l.leadScore}"`,
    `"${l.leadQualityLabel}"`,
    `"${l.hasWebsite ? 'Possui site' : 'Site nao identificado'}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${l.whatsappAvailable ? 'Sim' : 'Nao'}"`,
    `"${(l.address || '').replace(/"/g, '""')}"`,
    `"${(l.city || '').replace(/"/g, '""')}"`,
    `"${(l.state || '').replace(/"/g, '""')}"`,
    `"${l.distanceFormatted || l.distanceKm + ' km'}"`,
    `"${(l.opening_hours || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prospeccao_leads_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Saved Leads (CRM)
// ---------------------------------------------------------------------------

export async function getSavedLeads(): Promise<SavedLead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('generated_at', { ascending: false });

  if (error) {
    console.error('Error loading saved leads:', error.message);
    return [];
  }

  return (data || []).map(rowToSavedLead);
}

export async function getSavedLeadById(id: string): Promise<SavedLead | undefined> {
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).maybeSingle();
  if (error || !data) return undefined;
  return rowToSavedLead(data);
}

// Matches by OSM identity, phone, or name+city — same heuristic as the old localStorage version.
export async function findSavedLeadByLead(lead: Lead): Promise<SavedLead | undefined> {
  const leads = await getSavedLeads();
  return leads.find(
    (item) =>
      item.lead.id === lead.id ||
      (item.lead.osmType === lead.osmType && String(item.lead.osmId) === String(lead.osmId)) ||
      (lead.cleanPhone && item.lead.cleanPhone && lead.cleanPhone === item.lead.cleanPhone) ||
      (lead.name.toLowerCase() === item.lead.name.toLowerCase() &&
        lead.city.toLowerCase() === item.lead.city.toLowerCase())
  );
}

export async function isLeadSaved(lead: Lead): Promise<boolean> {
  return !!(await findSavedLeadByLead(lead));
}

// Save lead directly from search (Status: NOVO)
export async function saveLeadFromSearch(
  lead: Lead,
  initialNotes?: string
): Promise<{ lead: SavedLead; isNew: boolean }> {
  const existing = await findSavedLeadByLead(lead);
  if (existing) {
    return { lead: existing, isNew: false };
  }

  const userId = await getUserId();
  const now = new Date().toISOString();

  const newActivity: LeadActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: 'LEAD_SALVO',
    description: 'Lead adicionado ao CRM a partir do radar de busca.',
    timestamp: now,
  };

  const { data, error } = await supabase
    .from('leads')
    .insert({
      user_id: userId,
      lead,
      status: 'NOVO',
      generated_at: now,
      updated_at: now,
      notes: initialNotes || '',
      notes_list: initialNotes
        ? [{ id: `note_${Date.now()}`, text: initialNotes, createdAt: now } as LeadNoteItem]
        : [],
      activities: [newActivity],
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Falha ao salvar lead.');
  }

  return { lead: rowToSavedLead(data), isNew: true };
}

// Save lead with generated site (insert or update)
export async function saveLead(
  lead: Lead,
  siteData: GeneratedSite,
  customColors?: { primary: string; secondary: string },
  notes?: string
): Promise<SavedLead> {
  const existing = await findSavedLeadByLead(lead);
  const colors = customColors || {
    primary: siteData.paleta_sugerida.primaria || '#4f46e5',
    secondary: siteData.paleta_sugerida.secundaria || '#06b6d4',
  };
  const now = new Date().toISOString();

  if (existing) {
    const siteActivity: LeadActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: 'SITE_GERADO',
      description: existing.siteData ? 'Landing page atualizada com novas edições.' : 'Landing page gerada pelo Gemini AI.',
      timestamp: now,
    };

    const { data, error } = await supabase
      .from('leads')
      .update({
        lead,
        site_data: siteData,
        custom_colors: colors,
        status: existing.status === 'NOVO' ? 'SITE_GERADO' : existing.status,
        updated_at: now,
        outreach_message: siteData.mensagem_abordagem_whatsapp || existing.outreachMessage,
        notes: notes !== undefined ? notes : existing.notes,
        activities: [siteActivity, ...(existing.activities || [])],
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Falha ao atualizar lead.');
    return rowToSavedLead(data);
  }

  const userId = await getUserId();
  const activities: LeadActivity[] = [
    {
      id: `act_${Date.now()}_1`,
      type: 'LEAD_SALVO',
      description: 'Lead adicionado ao CRM.',
      timestamp: now,
    },
    {
      id: `act_${Date.now()}_2`,
      type: 'SITE_GERADO',
      description: 'Landing page gerada pelo Gemini AI.',
      timestamp: now,
    },
  ];

  const { data, error } = await supabase
    .from('leads')
    .insert({
      user_id: userId,
      lead,
      site_data: siteData,
      custom_colors: colors,
      status: 'SITE_GERADO',
      generated_at: now,
      updated_at: now,
      outreach_message: siteData.mensagem_abordagem_whatsapp || '',
      notes: notes || '',
      notes_list: notes ? [{ id: `note_${Date.now()}`, text: notes, createdAt: now } as LeadNoteItem] : [],
      activities,
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Falha ao salvar lead.');
  return rowToSavedLead(data);
}

export async function updateLeadStatus(
  id: string,
  newStatus: LeadStatus,
  options?: {
    dealValue?: number;
    lostReason?: string;
    meetingInfo?: LeadMeeting;
    note?: string;
  }
): Promise<SavedLead[]> {
  const current = await getSavedLeadById(id);
  if (!current) return getSavedLeads();

  const now = new Date().toISOString();
  const oldStatusLabel = CRM_STATUS_CONFIG[current.status]?.label || current.status;
  const newStatusLabel = CRM_STATUS_CONFIG[newStatus]?.label || newStatus;

  let activityType: LeadActivity['type'] = 'STATUS_ALTERADO';
  let activityDesc = `Status alterado de "${oldStatusLabel}" para "${newStatusLabel}".`;

  if (newStatus === 'FECHADO') {
    activityType = 'NEGOCIO_FECHADO';
    activityDesc = options?.dealValue
      ? `Negócio FECHADO com sucesso! Valor: R$ ${options.dealValue.toLocaleString('pt-BR')}.`
      : 'Negócio FECHADO com sucesso!';
  } else if (newStatus === 'PERDIDO' || newStatus === 'RECUSADO') {
    activityType = 'MARCADO_PERDIDO';
    activityDesc = options?.lostReason
      ? `Marcado como PERDIDO. Motivo: ${options.lostReason}.`
      : 'Marcado como PERDIDO.';
  } else if (newStatus === 'REUNIAO_MARCADA') {
    activityType = 'REUNIAO_MARCADA';
    activityDesc = options?.meetingInfo?.date
      ? `Reunião marcada para ${options.meetingInfo.date}${options.meetingInfo.time ? ` às ${options.meetingInfo.time}` : ''}.`
      : 'Reunião comercial agendada.';
  } else if (newStatus === 'MENSAGEM_ENVIADA') {
    activityType = 'MENSAGEM_ENVIADA';
    activityDesc = 'Mensagem de abordagem enviada ao prospect.';
  } else if (newStatus === 'RESPONDEU') {
    activityType = 'RESPOSTA_RECEBIDA';
    activityDesc = 'Prospect respondeu ao contato comercial.';
  }

  const newActivity: LeadActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: activityType,
    description: activityDesc,
    timestamp: now,
  };

  await supabase
    .from('leads')
    .update({
      status: newStatus,
      updated_at: now,
      deal_value: options?.dealValue !== undefined ? options.dealValue : current.dealValue,
      lost_reason: options?.lostReason !== undefined ? options.lostReason : current.lostReason,
      meeting_info: options?.meetingInfo !== undefined ? options.meetingInfo : current.meetingInfo,
      closed_at: newStatus === 'FECHADO' ? current.closedAt || now : current.closedAt,
      lost_at: newStatus === 'PERDIDO' || newStatus === 'RECUSADO' ? current.lostAt || now : current.lostAt,
      activities: [newActivity, ...(current.activities || [])],
    })
    .eq('id', id);

  return getSavedLeads();
}

export async function batchUpdateLeadStatus(ids: string[], newStatus: LeadStatus): Promise<SavedLead[]> {
  const now = new Date().toISOString();
  const newStatusLabel = CRM_STATUS_CONFIG[newStatus]?.label || newStatus;

  await Promise.all(
    ids.map(async (id) => {
      const current = await getSavedLeadById(id);
      if (!current) return;
      const oldStatusLabel = CRM_STATUS_CONFIG[current.status]?.label || current.status;
      const newActivity: LeadActivity = {
        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'STATUS_ALTERADO',
        description: `Status alterado em lote de "${oldStatusLabel}" para "${newStatusLabel}".`,
        timestamp: now,
      };

      await supabase
        .from('leads')
        .update({
          status: newStatus,
          updated_at: now,
          closed_at: newStatus === 'FECHADO' ? current.closedAt || now : current.closedAt,
          lost_at: newStatus === 'PERDIDO' || newStatus === 'RECUSADO' ? current.lostAt || now : current.lostAt,
          activities: [newActivity, ...(current.activities || [])],
        })
        .eq('id', id);
    })
  );

  return getSavedLeads();
}

export async function addLeadNote(id: string, noteText: string): Promise<SavedLead[]> {
  if (!noteText.trim()) return getSavedLeads();

  const current = await getSavedLeadById(id);
  if (!current) return getSavedLeads();

  const now = new Date().toISOString();
  const newNoteItem: LeadNoteItem = {
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    text: noteText.trim(),
    createdAt: now,
  };
  const newActivity: LeadActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: 'NOTA_ADICIONADA',
    description: `Nota adicionada: "${noteText.trim().slice(0, 50)}${noteText.trim().length > 50 ? '...' : ''}"`,
    timestamp: now,
  };

  await supabase
    .from('leads')
    .update({
      notes: noteText.trim(),
      notes_list: [newNoteItem, ...(current.notesList || [])],
      updated_at: now,
      activities: [newActivity, ...(current.activities || [])],
    })
    .eq('id', id);

  return getSavedLeads();
}

export async function updateLeadNotes(id: string, notes: string): Promise<SavedLead[]> {
  return addLeadNote(id, notes);
}

export async function setLeadFollowUp(id: string, followUp: LeadFollowUp | null): Promise<SavedLead[]> {
  const current = await getSavedLeadById(id);
  if (!current) return getSavedLeads();

  const now = new Date().toISOString();
  const newActivity: LeadActivity = followUp
    ? {
        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'FOLLOWUP_CRIADO',
        description: `Follow-up agendado para ${followUp.date}${followUp.note ? ` ("${followUp.note}")` : ''}.`,
        timestamp: now,
      }
    : {
        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'FOLLOWUP_CONCLUIDO',
        description: 'Lembrete de follow-up removido / concluído.',
        timestamp: now,
      };

  await supabase
    .from('leads')
    .update({
      follow_up: followUp,
      updated_at: now,
      activities: [newActivity, ...(current.activities || [])],
    })
    .eq('id', id);

  return getSavedLeads();
}

export async function deleteSavedLead(id: string): Promise<SavedLead[]> {
  await supabase.from('leads').delete().eq('id', id);
  return getSavedLeads();
}

export async function batchDeleteSavedLeads(ids: string[]): Promise<SavedLead[]> {
  await supabase.from('leads').delete().in('id', ids);
  return getSavedLeads();
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function rowToSettings(row: any): AppSettings {
  return {
    overpassServer: row?.overpass_server ?? DEFAULT_SETTINGS.overpassServer,
    darkMode: row?.dark_mode ?? DEFAULT_SETTINGS.darkMode,
    onboardingCompleted: row?.onboarding_completed ?? DEFAULT_SETTINGS.onboardingCompleted,
    userName: row?.user_name ?? DEFAULT_SETTINGS.userName,
    agencyName: row?.agency_name ?? DEFAULT_SETTINGS.agencyName,
    customGeminiKey: row?.custom_gemini_key ?? DEFAULT_SETTINGS.customGeminiKey,
  };
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const userId = await getUserId();
    const { data } = await supabase.from('settings').select('*').eq('user_id', userId).maybeSingle();
    return rowToSettings(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const userId = await getUserId();
  const current = await getSettings();
  const updated = { ...current, ...settings };

  await supabase.from('settings').upsert(
    {
      user_id: userId,
      overpass_server: updated.overpassServer,
      dark_mode: updated.darkMode,
      onboarding_completed: updated.onboardingCompleted,
      user_name: updated.userName,
      agency_name: updated.agencyName,
      custom_gemini_key: updated.customGeminiKey,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  return updated;
}

export async function clearAllLocalData(): Promise<void> {
  const userId = await getUserId();
  await Promise.all([
    supabase.from('leads').delete().eq('user_id', userId),
    supabase.from('recent_searches').delete().eq('user_id', userId),
    supabase
      .from('settings')
      .update({
        onboarding_completed: false,
      })
      .eq('user_id', userId),
  ]);
}

// ---------------------------------------------------------------------------
// Full CSV Export for CRM (client-side only)
// ---------------------------------------------------------------------------

export function exportLeadsToCsv(leads: SavedLead[]): void {
  const headers = [
    'ID CRM',
    'Nome da Empresa',
    'Categoria',
    'Cidade',
    'Estado',
    'Telefone',
    'WhatsApp Valido',
    'Endereco Completo',
    'Lead Score',
    'Status CRM',
    'Valor do Negocio (R$)',
    'Motivo da Perda',
    'Data de Criacao',
    'Ultima Atualizacao',
    'Proximo Follow-up',
    'Anotacoes',
    'Headline do Site',
  ];

  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${(l.lead.name || '').replace(/"/g, '""')}"`,
    `"${(l.lead.categoryLabel || '').replace(/"/g, '""')}"`,
    `"${(l.lead.city || '').replace(/"/g, '""')}"`,
    `"${(l.lead.state || '').replace(/"/g, '""')}"`,
    `"${(l.lead.phone || '').replace(/"/g, '""')}"`,
    `"${l.lead.whatsappAvailable ? 'Sim' : 'Nao'}"`,
    `"${(l.lead.address || '').replace(/"/g, '""')}"`,
    `"${l.lead.leadScore || 0}"`,
    `"${CRM_STATUS_CONFIG[l.status]?.label || l.status}"`,
    `"${l.dealValue || ''}"`,
    `"${(l.lostReason || '').replace(/"/g, '""')}"`,
    `"${new Date(l.generatedAt).toLocaleString('pt-BR')}"`,
    `"${new Date(l.updatedAt).toLocaleString('pt-BR')}"`,
    `"${l.followUp?.date ? `${l.followUp.date} - ${l.followUp.note || ''}` : ''}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
    `"${(l.siteData?.headline || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crm_leads_leadsite_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Backup JSON export
export async function exportCrmBackupJson(): Promise<void> {
  const leads = await getSavedLeads();
  const settings = await getSettings();
  const backup = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    leadsCount: leads.length,
    leads,
    settings,
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_crm_leadsite_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import JSON backup
export async function importCrmBackupJson(
  jsonString: string
): Promise<{ importedCount: number; totalCount: number }> {
  const parsed = JSON.parse(jsonString);
  const incomingLeads: SavedLead[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.leads)
    ? parsed.leads
    : [];

  if (incomingLeads.length === 0) {
    throw new Error('Nenhum lead encontrado no arquivo de backup.');
  }

  const userId = await getUserId();
  const current = await getSavedLeads();
  let addedCount = 0;

  for (const incoming of incomingLeads) {
    const existingIndex = current.findIndex(
      (c) =>
        (c.lead.osmType === incoming.lead.osmType && String(c.lead.osmId) === String(incoming.lead.osmId)) ||
        (incoming.lead.cleanPhone &&
          c.lead.cleanPhone &&
          incoming.lead.cleanPhone === c.lead.cleanPhone)
    );

    if (existingIndex >= 0) {
      const target = current[existingIndex];
      await supabase
        .from('leads')
        .update({
          lead: incoming.lead,
          site_data: incoming.siteData,
          custom_colors: incoming.customColors,
          status: incoming.status,
          deal_value: incoming.dealValue,
          lost_reason: incoming.lostReason,
          meeting_info: incoming.meetingInfo,
          outreach_message: incoming.outreachMessage,
          notes: incoming.notes || '',
          notes_list: incoming.notesList || [],
          activities: incoming.activities || [],
          follow_up: incoming.followUp || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', target.id);
    } else {
      await supabase.from('leads').insert({
        user_id: userId,
        lead: incoming.lead,
        site_data: incoming.siteData,
        custom_colors: incoming.customColors,
        status: incoming.status || 'NOVO',
        deal_value: incoming.dealValue,
        lost_reason: incoming.lostReason,
        meeting_info: incoming.meetingInfo,
        outreach_message: incoming.outreachMessage,
        notes: incoming.notes || '',
        notes_list: incoming.notesList || [],
        activities: incoming.activities || [],
        follow_up: incoming.followUp || null,
        generated_at: incoming.generatedAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      addedCount++;
    }
  }

  const finalLeads = await getSavedLeads();
  return { importedCount: addedCount, totalCount: finalLeads.length };
}
