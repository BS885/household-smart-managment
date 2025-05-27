import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, alpha, ThemeProvider, Paper } from "@mui/material"
import { theme } from "../../Style/Theme"

interface TableColumn<T> {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface GenericTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
}

const GenericTable = <T extends object>({ data, columns }: GenericTableProps<T>) => {
    return (
        <ThemeProvider theme={theme}>
            <Paper sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
            }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: theme.palette.secondary.light,
                                '& th': {
                                    borderBottom: `2px solid ${theme.palette.primary.light}`
                                }
                            }}>
                                {columns.map((col, idx) => (
                                    <TableCell
                                        key={idx}
                                        sx={{
                                            color: theme.palette.primary.dark,
                                            fontWeight: 600,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {col.header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, rowIdx) => (
                                <TableRow key={rowIdx} sx={{
                                    borderBottom: `1px solid ${theme.palette.secondary.light}`,
                                    transition: 'background-color 0.2s ease',
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.2) }
                                }}>
                                    {columns.map((col, colIdx) => (
                                        <TableCell key={colIdx}>
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : String(row[col.key])}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </ThemeProvider>
    )
}

export default GenericTable