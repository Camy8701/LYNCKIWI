import type { LeadWithService } from './database';

/**
 * Export leads to CSV format
 */
export function exportLeadsToCSV(leads: LeadWithService[], filename: string = 'leads-export.csv') {
  if (leads.length === 0) {
    alert('No leads to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Created At',
    'Name',
    'Phone',
    'Email',
    'PLZ',
    'City',
    'Service',
    'Timeline',
    'Status',
    'Source',
    'Service Details',
    'Admin Notes'
  ];

  // Convert leads to CSV rows
  const rows = leads.map(lead => {
    const service = lead.service;
    const serviceName = service?.name || 'Unknown';
    
    const timelineText = 
      lead.timeline === 'sofort' ? 'Sofort / Notfall' :
      lead.timeline === 'diese_woche' ? 'Diese Woche' :
      lead.timeline === 'diesen_monat' ? 'Diesen Monat' : 'Flexibel';
    
    const statusText = 
      lead.status === 'new' ? 'Neu' :
      lead.status === 'contacted' ? 'Kontaktiert' : 'Umgewandelt';

    return [
      lead.id,
      new Date(lead.created_at).toLocaleString('de-DE'),
      lead.name,
      lead.phone,
      lead.email || '',
      lead.plz,
      lead.city,
      serviceName,
      timelineText,
      statusText,
      lead.source || 'website',
      `"${(lead.service_details || '').replace(/"/g, '""')}"`, // Escape quotes
      `"${(lead.admin_notes || '').replace(/"/g, '""')}"` // Escape quotes
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM for Excel
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate filename with timestamp
 */
export function generateExportFilename(prefix: string = 'leads'): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}-${timestamp}.csv`;
}
