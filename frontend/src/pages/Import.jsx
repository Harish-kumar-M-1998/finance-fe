
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { importService } from '../services/importService';
import toast from 'react-hot-toast';

export const Import = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewData(null);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let result;

      if (ext === 'csv') {
        result = await importService.importCSV(file);
      } else if (ext === 'xlsx' || ext === 'xls') {
        result = await importService.importExcel(file);
      } else {
        throw new Error('Unsupported file format');
      }

      setPreviewData(result.data);
      toast.success('File parsed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData) return;

    setLoading(true);
    try {
      const result = await importService.confirmImport(previewData);
      toast.success(`Imported ${result.results.imported} expenses successfully`);
      
      if (result.results.failed > 0) {
        toast.error(`${result.results.failed} expenses failed to import`);
      }

      setFile(null);
      setPreviewData(null);
    } catch (error) {
      toast.error('Failed to import expenses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import Expenses</h1>
        <p className="text-gray-600 mt-1">Import expenses from CSV or Excel files</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Upload File</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <label className="cursor-pointer">
                <span className="text-primary-600 hover:text-primary-700 font-medium">
                  Choose a file
                </span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">CSV or Excel files only</p>
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button onClick={handlePreview} loading={loading}>
                  Preview
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {previewData && previewData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Preview ({previewData.length} expenses)
              </h3>
              <Button onClick={handleConfirm} loading={loading}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Import
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${row.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Showing 10 of {previewData.length} expenses
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">File Format</h3>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 mb-4">
            Your CSV or Excel file should have the following columns:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <div>title, amount, category, date</div>
            <div className="text-gray-500 mt-2">Example:</div>
            <div className="text-gray-500">Groceries, 45.50, Food, 2026-02-01</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};