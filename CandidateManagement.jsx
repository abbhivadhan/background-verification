import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar
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

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching candidates data
    setTimeout(() => {
      setCandidates([
        {
          id: 1,
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          city: 'New York',
          state: 'NY',
          createdAt: '2024-01-15',
          backgroundChecks: 2,
          lastCheckStatus: 'completed'
        },
        {
          id: 2,
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 234-5678',
          city: 'Los Angeles',
          state: 'CA',
          createdAt: '2024-01-20',
          backgroundChecks: 1,
          lastCheckStatus: 'in_progress'
        },
        {
          id: 3,
          firstName: 'Mike',
          lastName: 'Davis',
          email: 'mike.davis@email.com',
          phone: '+1 (555) 345-6789',
          city: 'Chicago',
          state: 'IL',
          createdAt: '2024-02-01',
          backgroundChecks: 0,
          lastCheckStatus: null
        },
        {
          id: 4,
          firstName: 'Lisa',
          lastName: 'Wilson',
          email: 'lisa.wilson@email.com',
          phone: '+1 (555) 456-7890',
          city: 'Houston',
          state: 'TX',
          createdAt: '2024-02-05',
          backgroundChecks: 3,
          lastCheckStatus: 'completed'
        },
        {
          id: 5,
          firstName: 'Tom',
          lastName: 'Brown',
          email: 'tom.brown@email.com',
          phone: '+1 (555) 567-8901',
          city: 'Phoenix',
          state: 'AZ',
          createdAt: '2024-02-10',
          backgroundChecks: 1,
          lastCheckStatus: 'pending'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCandidates = candidates.filter(candidate =>
    `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="outline">No Checks</Badge>
    }
  }

  const handleDeleteCandidate = (candidateId) => {
    setCandidates(candidates.filter(c => c.id !== candidateId))
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
          <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all candidates in your system</p>
        </div>
        <Link to="/candidates/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </Link>
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
            placeholder="Search candidates..."
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
              <div className="text-2xl font-bold text-blue-600">{candidates.length}</div>
              <div className="text-sm text-gray-600">Total Candidates</div>
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
                {candidates.filter(c => c.lastCheckStatus === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Checks</div>
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
                {candidates.filter(c => c.lastCheckStatus === 'in_progress').length}
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
                {candidates.filter(c => c.lastCheckStatus === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Candidates Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Candidates</CardTitle>
            <CardDescription>
              {filteredCandidates.length} of {candidates.length} candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Background Checks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {candidate.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {candidate.city}, {candidate.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {candidate.backgroundChecks} check{candidate.backgroundChecks !== 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(candidate.lastCheckStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(candidate.createdAt).toLocaleDateString()}
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
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteCandidate(candidate.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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

export default CandidateManagement

