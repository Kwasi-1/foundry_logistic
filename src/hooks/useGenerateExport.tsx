import { listDocuments } from '@/lib/api/queries.global';
import { exportToExcel } from '@/utils/helpers';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface TUseGenerateExportProps {
  endpoint: string;
  filters?: Array<Array<string>>;
  count: number;
  export_name: string;
  keys?: string[];
  selectedColumns?: string[];
  columnMapping?: Record<string, string>;
  rowMapping?: (row: Record<string, any>) => Record<string, any>;
}

const useGenerateExport = ({
  endpoint,
  filters = [],
  count,
  export_name,
  keys = [],
  selectedColumns,
  columnMapping = {},
  rowMapping,
}: TUseGenerateExportProps) => {
  const { data, dataUpdatedAt, isFetching, refetch } = useQuery({
    queryKey: ['generating-export', endpoint, ...keys],
    queryFn: () =>
      listDocuments({
        url: endpoint,
        limit: count,
        start: 0,
        filters,
      }),
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const exportData = async () => {
    try {
      const result = await refetch();

      if (result.data?.data) {
        const timestamp = dataUpdatedAt
          ? format(new Date(dataUpdatedAt), 'yyyy-MM-dd-HHmm')
          : format(new Date(), 'yyyy-MM-dd-HHmm');

        let exportableData = Array.from(result.data.data);

        // Filter and map columns
        if (selectedColumns && selectedColumns.length > 0) {
          exportableData = exportableData.map((item: any) => {
            const filteredItem: Record<string, any> = {};

            selectedColumns.forEach((columnKey) => {
              if (item.hasOwnProperty(columnKey)) {
                const mappedKey = columnMapping[columnKey] || columnKey;
                filteredItem[mappedKey] = item[columnKey];
              }
            });

            return filteredItem;
          });
        }

        if (rowMapping) {
          exportableData = exportableData.map(rowMapping);
        }

        exportToExcel(exportableData, `${export_name}-${timestamp}`);
      } else {
        console.warn('No data available for export');
        throw new Error('No data available for export');
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  };

  return {
    isExporting: isFetching,
    exportData,
    exportDataCount: data?.data?.length || 0,
  };
};

export default useGenerateExport;
