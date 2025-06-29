import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  User
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'

const BackgroundCheckManagement = () => {
  const [backgroundChecks, setBackgroundChecks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching background checks data
    setTimeout(() => {
      setBackgroundChecks([
        {
          id: 1,
          candidateName: 'John Smith',
          candidateEmail: 'john.smith@email.com',
          checkType: 'comprehensive',
          status: 'completed',
          priority: 'normal',
          progress: 100,
          createdAt: '2024-02-01',
          completedAt: '2024-02-03',
          requestedBy: 'HR Manager'
        },
        {
          id: 2,
          candidateName: 'Sarah Johnson',
          candidateEmail: 'sarah.johnson@email.com',
          checkType: 'standard',
          status: 'in_progress',
          priority: 'high',
          progress: 65,
          createdAt: '2024-02-05',
          completedAt: null,
          requestedBy: 'Hiring Manager'
        },
        {
          id: 3,
          candidateName: 'Mike Davis',
          candidateEmail: 'mike.davis@email.com',
          checkType: 'basic',
          status: 'pending',
          priority: 'normal',
          progress: 0,
          createdAt: '2024-02-08',
          completedAt: null,
          requestedBy: 'HR Manager'
        },
        {
          id: 4,
          candidateName: 'Lisa Wilson',
          candidateEmail: 'lisa.wilson@email.com',
          checkType: 'comprehensive',
          status: 'failed',
          priority: 'urgent',
          progress: 45,
          createdAt: '2024-02-06',
          completedAt: null,
          requestedBy: 'Security Team'
        },
        {
          id: 5,
          candidateName: 'Tom Brown',
          candidateEmail: 'tom.brown@email.com',
          checkType: 'standard',
          status: 'completed',
          priority: 'low',
          progress: 100,
          createdAt: '2024-01-28',
          completedAt: '2024-01-30',
          requestedBy: 'HR Manager'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredChecks = backgroundChecks.filter(check =>
    check.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case 'normal':
        return <Badge variant="outline">Normal</Badge>
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getCheckTypeBadge = (type) => {
    switch (type) {
      case 'comprehensive':
        return <Badge className="bg-purple-100 text-purple-800">Comprehensive</Badge>
      case 'standard':
        return <Badge className="bg-blue-100 text-blue-800">Standard</Badge>
      case 'basic':
        return <Badge className="bg-gray-100 text-gray-800">Basic</Badge>
      default:
        return <Badge variant="outline">Standard</Badge>
    }
  }

  const handleStartCheck = (checkId) => {
    setBackgroundChecks(checks => 
      checks.map(check => 
        check.id === checkId 
          ? { ...check, status: 'in_progress', progress: 10 }
          : check
      )
    )
  }

  const handlePauseCheck = (checkId) => {
    setBackgroundChecks(checks => 
      checks.map(check => 
        check.id === checkId 
          ? { ...check, status: 'pending' }
          : check
      )
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Background Check Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all background check processes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Background Check
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search background checks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{backgroundChecks.length}</div>
              <div className="text-sm text-gray-600">Total Checks</div>
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
              <div className="text-2xl font-bold text-green-600">
                {backgroundChecks.filter(c => c.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
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
              <div className="text-2xl font-bold text-blue-600">
                {backgroundChecks.filter(c => c.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {backgroundChecks.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Background Checks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Background Checks</CardTitle>
            <CardDescription>
              {filteredChecks.length} of {backgroundChecks.length} background checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Check Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecks.map((check) => (
                  <TableRow key={check.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{check.candidateName}</div>
                        <div className="text-sm text-gray-500">{check.candidateEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCheckTypeBadge(check.checkType)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(check.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(check.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={check.progress} className="w-20" />
                        <div className="text-xs text-gray-500">{check.progress}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-3 h-3 mr-1" />
                        {check.requestedBy}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(check.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/background-checks/${check.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {check.status === 'pending' && (
                            <DropdownMenuItem onClick={() => handleStartCheck(check.id)}>
                              <Play className="w-4 h-4 mr-2" />
                              Start Check
                            </DropdownMenuItem>
                          )}
                          {check.status === 'in_progress' && (
                            <DropdownMenuItem onClick={() => handlePauseCheck(check.id)}>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Check
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default BackgroundCheckManagement

