<script>
export let data = [];                 // Array completo de productos
export let filtered = [];            // Array luego de aplicar búsqueda/orden (opcional)
export let paginated = [];           // Array que se muestra en la página actual (opcional)
export let filenamePrefix = 'inventario_productos';

// Mapeo flexible de campos de fecha (por si tus keys cambian)
export let createdKeys = ['created_at', 'fecha_creacion', 'created', 'createdAt', 'fechaCreacion'];
export let updatedKeys = ['updated_at', 'fecha_actualizacion', 'updated', 'updatedAt', 'fechaActualizacion'];

// Qué columnas incluir (puedes ajustar nombres y orden)
export let columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'precio', label: 'Precio' },
    { key: 'stock', label: 'Stock' },
    { key: 'is_activo', label: 'Activo', transform: v => v === true ? 'Sí' : 'No' },
    { key: 'is_promocion', label: 'En promoción', transform: v => v === true ? 'Sí' : 'No' },
    { key: 'descuento', label: 'Descuento' },
    { key: 'url_imagen', label: 'URL Imagen' },
    { key: '__created', label: 'Fecha creación' },
    { key: '__updated', label: 'Fecha edición' },
];

// Ámbito a exportar: 'todo' | 'filtrado' | 'pagina'
let scope = 'todo';

function firstKey(obj, keys) {
    for (const k of keys) {
    if (obj && obj[k] != null) return obj[k];
    }
    return null;
}

function formatDT(val) {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d)) return '';
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function buildRows(list) {
    return list.map(p => {
    const row = {};
    const created = firstKey(p, createdKeys);
    const updated = firstKey(p, updatedKeys);

    for (const col of columns) {
        if (col.key === '__created') {
        row[col.label] = formatDT(created);
        } else if (col.key === '__updated') {
        row[col.label] = formatDT(updated);
        } else {
        const raw = p[col.key];
        row[col.label] = col.transform ? col.transform(raw, p) : (raw ?? '');
        }
    }
    return row;
    });
}

function stampName(prefix) {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    const s = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
    return `${prefix}_${s}`;
}

function toCSV(rows) {
    if (!rows.length) return '';
    const headers = Object.keys(rows[0]);
    const esc = (v) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    return [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\n');
}

function downloadBlob(filename, mime, content) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function pickScope() {
    if (scope === 'pagina' && paginated?.length) return paginated;
    if (scope === 'filtrado' && filtered?.length) return filtered;
    return data ?? [];
}

async function exportar() {
    const list = pickScope();
    const rows = buildRows(list);
    const baseName = stampName(filenamePrefix);

    try {
    const XLSXmod = await import('xlsx'); // importación dinámica
    const XLSX = XLSXmod?.default ?? XLSXmod;

    const ws = XLSX.utils.json_to_sheet(rows);
    // Ajuste de ancho automático simple
    const header = rows[0] ? Object.keys(rows[0]) : [];
    ws['!cols'] = header.map(h => ({ wch: Math.min(Math.max(h.length + 2, 12), 40) }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    XLSX.writeFile(wb, `${baseName}.xlsx`);
    } catch (e) {
    console.warn('xlsx no disponible, usando CSV. Detalle:', e);
    const csv = toCSV(rows);
    downloadBlob(`${baseName}.csv`, 'text/csv;charset=utf-8', csv);
    }
}
</script>

<div class="d-flex gap-2 flex-wrap">
<select class="form-select w-auto border p-2" bind:value={scope} aria-label="Ámbito de exportación">
    <option value="todo">Todo</option>
    <option value="filtrado">Solo filtrados/ordenados</option>
    <option value="pagina">Solo esta página</option>
</select>

<button class="btn mb-0 btn-sm btn-outline-success" on:click={exportar}>
    Exportar Excel
</button>
</div>
