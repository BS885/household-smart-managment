import api from '../redux/api';

export const generateCSVContent = (rows: string[][], headers: string[]): string => {
    return [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');
};

export const downloadCSV = (rows: string[][], headers: string[], filename: string) => {
    const csvContent = generateCSVContent(rows, headers);
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const sendCSVToEmail = async (
    rows: string[][], headers: string[], filename: string, email: string
): Promise<void> => {
    console.log('Sending CSV to email:', { rows, headers, filename });
    if (!email) {
        throw new Error('User email is not available');
    }
    const content = generateCSVContent(rows, headers);
    await api.post('report/send-report', { content, filename, email });

};

export const printCSV = (rows: string[][], headers: string[]) => {
    const csvContent = generateCSVContent(rows, headers);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write('<html><body><pre>' + csvContent + '</pre></body></html>');
        printWindow.document.close();
        printWindow.print();
    }
};
