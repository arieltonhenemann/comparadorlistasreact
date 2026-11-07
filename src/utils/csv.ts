export type ClienteCsvRow = {
  codCliente: string;
  cliente: string;
  infoPgto: string;
  status: string;
};

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function detectDelimiter(text: string): string {
  const lines = text.split(/\r?\n/).slice(0, 5);
  const candidates = [';', ',', '\t'];
  let best = ';';
  let bestCount = -1;

  for (const candidate of candidates) {
    const count = lines.reduce((total, line) => total + line.split(candidate).length - 1, 0);
    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  }

  return best;
}

function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((value) => value.trim() !== ''));
}

export function parseClientesCsv(text: string): ClienteCsvRow[] {
  const content = text.replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(content);
  const rows = parseDelimited(content, delimiter);

  if (rows.length === 0) {
    return [];
  }

  const headerRowIndex = rows.slice(0, 10).findIndex((row) => {
    const normalized = row.map(normalizeText);
    const hasCodCliente = normalized.some((value) => value.includes('cod') && value.includes('cliente'));
    const hasInfoPgto = normalized.some((value) => value.includes('informacoes') && value.includes('pgto'));
    return hasCodCliente || hasInfoPgto;
  });

  const header = headerRowIndex !== -1 ? rows[headerRowIndex].map(normalizeText) : [];
  const codIndex = header.findIndex((value) => value.includes('cod') && value.includes('cliente'));
  const clienteIndex = header.findIndex((value) => value.includes('cliente') && !value.includes('cod'));
  const infoIndex = header.findIndex((value) => value.includes('informacoes') && value.includes('pgto'));
  const statusIndex = header.findIndex((value) => value.includes('status'));

  const hasHeader = headerRowIndex !== -1;
  const dataRows = hasHeader ? rows.slice(headerRowIndex + 1) : rows;

  const indices = hasHeader
    ? {
        cod: codIndex !== -1 ? codIndex : 0,
        cliente: clienteIndex !== -1 ? clienteIndex : 1,
        info: infoIndex !== -1 ? infoIndex : 2,
        status: statusIndex !== -1 ? statusIndex : 3,
      }
    : { cod: 0, cliente: 1, info: 2, status: 3 };

  return dataRows
    .map((row) => ({
      codCliente: (row[indices.cod] ?? '').trim(),
      cliente: (row[indices.cliente] ?? '').trim(),
      infoPgto: (row[indices.info] ?? '').trim(),
      status: (row[indices.status] ?? '').trim(),
    }))
    .filter((row) => row.codCliente !== '');
}
