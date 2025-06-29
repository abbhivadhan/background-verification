import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching reports data
    setTimeout(() => {
      setReports([
        {
          id: 1,
          candidateName: 'John Smith',
          backgroundCheckId: 1,
          reportType: 'comprehensive',
          status: 'generated',
          format: 'pdf',
          generatedAt: '2024-02-03T16:00:00Z',
          generatedBy: 'System',
          fileSize: '2.4 MB',
          downloadCount: 3
        },
        {
          id: 2,
          candidateName: 'Sarah Johnson',
          backgroundCheckId: 2,
          reportType: 'summary',
          status: 'pending',
          format: 'pdf',
          generatedAt: null,
          generatedBy: null,
          fileSize: null,
          downloadCount: 0
        },
        {
          id: 3,
          candidateName: 'Tom Brown',
          backgroundCheckId: 5,
          reportType: 'detailed',
          status: 'generated',
          format: 'pdf',
          generatedAt: '2024-01-30T14:30:00Z',
          generatedBy: 'HR Manager',
          fileSize: '3.1 MB',
          downloadCount: 1
        },
        {
          id: 4,
          candidateName: 'Lisa Wilson',
          backgroundCheckId: 4,
          reportType: 'compliance',
          status: 'failed',
          format: 'pdf',
          generatedAt: null,
          generatedBy: null,
          fileSize: null,
          downloadCount: 0
        }
      ])

      setAnalytics({
        totalReports: 156,
        generatedThisMonth: 23,
        downloadedReports: 142,
        averageGenerationTime: '2.3 minutes',
        reportTypes: [
          { name: 'Comprehensive', value: 45, color: '#3b82f6' },
          { name: 'Standard', value: 35, color: '#10b981' },
          { name: 'Summary', value: 15, color: '#f59e0b' },
          { name: 'Compliance', value: 5, color: '#ef4444' }
        ],
        monthlyTrend: [
          { month: 'Jan', reports: 18, downloads: 16 },
          { month: 'Feb', reports: 23, downloads: 21 },
          { month: 'Mar', reports: 19, downloads: 18 },
          { month: 'Apr', reports: 25, downloads: 23 },
          { month: 'May', reports: 28, downloads: 26 },
          { month: 'Jun', reports: 31, downloads: 29 }
        ]
      })

      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'generated':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Generated</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getReportTypeBadge = (type) => {
    switch (type) {
      case 'comprehensive':
        return <Badge className="bg-purple-100 text-purple-800">Comprehensive</Badge>
      case 'detailed':
        return <Badge className="bg-blue-100 text-blue-800">Detailed</Badge>
      case 'summary':
        return <Badge className="bg-green-100 text-green-800">Summary</Badge>
      case 'compliance':
        return <Badge className="bg-orange-100 text-orange-800">Compliance</Badge>
      default:
        return <Badge variant="outline">Standard</Badge>
    }
  }

  const handleDownloadReport = (reportId) => {
    // Simulate report download
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, downloadCount: report.downloadCount + 1 }
        : report
    ))
  }

  const handleGenerateReport = (reportId) => {
    // Simulate report generation
    setReports(reports.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: 'generated',
            generatedAt: new Date().toISOString(),
            generatedBy: 'System',
            fileSize: '2.1 MB'
          }
        : report
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and manage background check reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalReports}</div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{analytics.generatedThisMonth}</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{analytics.downloadedReports}</div>
                  <div className="text-sm text-gray-600">Downloaded</div>
                </div>
                <Download className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{analytics.averageGenerationTime}</div>
                  <div className="text-sm text-gray-600">Avg Generation</div>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Report Trends</CardTitle>
              <CardDescription>Reports generated vs downloaded over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="reports" stroke="#3b82f6" name="Generated" strokeWidth={2} />
                  <Line dataKey="downloads" stroke="#10b981" name="Downloaded" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Types Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Report Types Distribution</CardTitle>
              <CardDescription>Breakdown of report types generated</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.reportTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.reportTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>All generated and pending reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{report.candidateName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getReportTypeBadge(report.reportType)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell>
                      {report.generatedAt ? (
                        <div>
                          <div className="text-sm">
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            by {report.generatedBy}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {report.fileSize || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Download className="w-3 h-3 text-gray-400" />
                        <span>{report.downloadCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {report.status === 'generated' ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadReport(report.id)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </>
                        ) : report.status === 'pending' ? (
                          <Button 
                            size="sm"
                            onClick={() => handleGenerateReport(report.id)}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Generate
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleGenerateReport(report.id)}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Reports

