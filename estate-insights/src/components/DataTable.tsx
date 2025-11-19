import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Search, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  X
} from "lucide-react";

interface DataTableProps {
  data: Array<Record<string, string | number>>;
}

type SortDirection = 'asc' | 'desc' | null;

const DataTable = ({ data }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  if (!data || data.length === 0) {
    return (
      <Card className="border-2 border-dashed border-border bg-muted/20">
        <CardContent className="py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
            <p className="text-sm text-muted-foreground">Table data will appear here once analysis is complete</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const columns = Object.keys(data[0]);

  // Filter data based on search
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = columns.join(',');
    const rows = sortedData.map(row => 
      columns.map(col => `"${row[col]}"`).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `real-estate-data-${Date.now()}.csv`;
    a.click();
  };

  // Format column name
  const formatColumnName = (column: string) => {
    return column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get cell color based on value
  const getCellClassName = (column: string, value: string | number) => {
    if (column.toLowerCase().includes('year')) {
      return "font-bold text-blue-700 dark:text-blue-400";
    }
    if (column.toLowerCase().includes('price') || column.toLowerCase().includes('sales')) {
      return "font-semibold text-green-700 dark:text-green-400";
    }
    if (column.toLowerCase().includes('sold') || column.toLowerCase().includes('units')) {
      return "font-medium text-purple-700 dark:text-purple-400";
    }
    return "text-foreground";
  };

  return (
    <div className="relative">
      {/* Gradient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-10"></div>
      
      <Card className="relative border-2 border-border shadow-2xl bg-gradient-to-br from-card to-card/50">
        <CardHeader className="border-b-2 border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
                <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Detailed Data Table
                </span>
                <p className="text-sm font-normal text-muted-foreground mt-0.5">
                  {sortedData.length} of {data.length} records
                </p>
              </div>
            </CardTitle>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="gap-2 border-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all columns..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-10 border-2"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {(sortColumn || searchTerm) && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSortColumn(null);
                  setSortDirection(null);
                  setCurrentPage(1);
                }}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {(searchTerm || sortColumn) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1.5">
                  <Search className="h-3 w-3" />
                  Search: "{searchTerm}"
                </Badge>
              )}
              {sortColumn && (
                <Badge variant="secondary" className="gap-1.5">
                  <ArrowUpDown className="h-3 w-3" />
                  Sorted by: {formatColumnName(sortColumn)} ({sortDirection})
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableHead 
                      key={column} 
                      className="font-bold text-foreground whitespace-nowrap"
                    >
                      <button
                        onClick={() => handleSort(column)}
                        className="flex items-center gap-2 hover:text-primary transition-colors group w-full"
                      >
                        {formatColumnName(column)}
                        <ArrowUpDown className={`h-4 w-4 transition-all ${
                          sortColumn === column 
                            ? 'text-primary opacity-100' 
                            : 'opacity-0 group-hover:opacity-50'
                        }`} />
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <TableRow 
                      key={index} 
                      className="hover:bg-muted/50 transition-colors border-b border-border/50"
                    >
                      {columns.map((column) => (
                        <TableCell 
                          key={column} 
                          className={`whitespace-nowrap ${getCellClassName(column, row[column])}`}
                        >
                          {row[column]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-50" />
                        <p className="font-medium">No results found for "{searchTerm}"</p>
                        <p className="text-sm">Try adjusting your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t-2 border-border/50 bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(startIndex + rowsPerPage, sortedData.length)}
                </span>{" "}
                of <span className="font-semibold text-foreground">{sortedData.length}</span> results
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-9"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTable;
