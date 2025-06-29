import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  User, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Download,
  Play,
  Pause,
  RefreshCw,
  Shield,
  GraduationCap,
  Briefcase,
  CreditCard,
  Scale
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const BackgroundCheckDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [backgroundCheck, setBackgroundCheck] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching background check details
    setTimeout(() => {
      setBackgroundCheck({
        id: parseInt(id),
        candidate: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, New York, NY 10001'
        },
        checkType: 'comprehensive',
        status: 'in_progress',
        priority: 'high',
        progress: 75,
        createdAt: '2024-02-05T10:00:00Z',
        startedAt: '2024-02-05T10:30:00Z',
        estimatedCompletion: '2024-02-07T16:00:00Z',
        requestedBy: 'Hiring Manager',
        consentGiven: true,
        consentDate: '2024-02-05T09:45:00Z',
        verificationResults: [
          {
            id: 1,
            type: 'education',
            status: 'verified',
            result: 'pass',
            details: 'Bachelor of Science in Computer Science from MIT verified',
            verifiedBy: 'National Student Clearinghouse',
            verificationDate: '2024-02-05T12:00:00Z'
          },
          {
            id: 2,
            type: 'employment',
            status: 'verified',
            result: 'pass',
            details: 'Software Engineer at Google (2020-2023) verified',
            verifiedBy: 'The Work Number',
            verificationDate: '2024-02-05T14:00:00Z'
          },
          {
            id: 3,
            type: 'employment',
            status: 'pending',
            result: null,
            details: 'Senior Developer at Microsoft (2018-2020) - verification in progress',
            verifiedBy: null,
            verificationDate: null
          }
        ],
        criminalChecks: [
          {
            id: 1,
            jurisdiction: 'New York County, NY',
            checkType: 'county',
            status: 'completed',
            result: 'clear',
            recordsFound: false,
            details: 'No criminal records found in New York County',
            searchDate: '2024-02-05T15:00:00Z'
          },
          {
            id: 2,
            jurisdiction: 'New York State',
            checkType: 'state',
            status: 'completed',
            result: 'clear',
            recordsFound: false,
            details: 'No criminal records found in New York State',
            searchDate: '2024-02-05T15:30:00Z'
          },
          {
            id: 3,
            jurisdiction: 'Federal',
            checkType: 'federal',
            status: 'in_progress',
            result: null,
            recordsFound: null,
            details: 'Federal criminal background check in progress',
            searchDate: null
          }
        ],
        creditCheck: {
          status: 'pending',
          creditScore: null,
          creditRating: null,
          details: 'Credit check scheduled to run after criminal checks complete'
        }
      })
      setLoading(false)
    }, 1000)
  }, [id])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getResultBadge = (result) => {
    switch (result) {
      case 'pass':
      case 'clear':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>
      case 'fail':
      case 'records_found':
        return <Badge className="bg-red-100 text-red-800">Fail</Badge>
      case 'inconclusive':
        return <Badge className="bg-yellow-100 text-yellow-800">Inconclusive</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!backgroundCheck) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Background Check Not Found</h2>
        <p className="text-gray-600 mt-2">The requested background check could not be found.</p>
        <Button onClick={() => navigate('/background-checks')} className="mt-4">
          Back to Background Checks
        </Button>
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
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/background-checks')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Background Check #{backgroundCheck.id}
            </h1>
            <p className="text-gray-600 mt-1">
              {backgroundCheck.candidate.firstName} {backgroundCheck.candidate.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          {backgroundCheck.status === 'pending' && (
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Start Check
            </Button>
          )}
          {backgroundCheck.status === 'in_progress' && (
            <Button variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause Check
            </Button>
          )}
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(backgroundCheck.status)}
                <div>
                  <div className="font-medium">{getStatusBadge(backgroundCheck.status)}</div>
                  <div className="text-sm text-gray-600">Current Status</div>
                </div>
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
              <div className="space-y-1">
                <Progress value={backgroundCheck.progress} className="w-full" />
                <div className="text-sm text-gray-600">{backgroundCheck.progress}% Complete</div>
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
              <div className="text-sm font-medium text-gray-900">Check Type</div>
              <div className="text-sm text-gray-600 capitalize">{backgroundCheck.checkType}</div>
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
              <div className="text-sm font-medium text-gray-900">Priority</div>
              <Badge 
                className={
                  backgroundCheck.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  backgroundCheck.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }
              >
                {backgroundCheck.priority}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidate Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Candidate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-900">Name</div>
                <div className="text-sm text-gray-600">
                  {backgroundCheck.candidate.firstName} {backgroundCheck.candidate.lastName}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Email</div>
                <div className="text-sm text-gray-600">{backgroundCheck.candidate.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Phone</div>
                <div className="text-sm text-gray-600">{backgroundCheck.candidate.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Address</div>
                <div className="text-sm text-gray-600">{backgroundCheck.candidate.address}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="w-5 h-5 mr-2" />
                Check Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-900">Requested By</div>
                <div className="text-sm text-gray-600">{backgroundCheck.requestedBy}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Created</div>
                <div className="text-sm text-gray-600">
                  {new Date(backgroundCheck.createdAt).toLocaleString()}
                </div>
              </div>
              {backgroundCheck.startedAt && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Started</div>
                  <div className="text-sm text-gray-600">
                    {new Date(backgroundCheck.startedAt).toLocaleString()}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">Estimated Completion</div>
                <div className="text-sm text-gray-600">
                  {new Date(backgroundCheck.estimatedCompletion).toLocaleString()}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium text-gray-900">Consent Status</div>
                <div className="flex items-center space-x-2">
                  {backgroundCheck.consentGiven ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-600">
                    {backgroundCheck.consentGiven ? 'Consent Given' : 'Consent Pending'}
                  </span>
                </div>
                {backgroundCheck.consentDate && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(backgroundCheck.consentDate).toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Check Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Check Results</CardTitle>
              <CardDescription>Detailed verification and background check results</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="verification" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="criminal">Criminal</TabsTrigger>
                  <TabsTrigger value="credit">Credit</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="verification" className="space-y-4">
                  {backgroundCheck.verificationResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {result.type === 'education' ? (
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-purple-600" />
                          )}
                          <span className="font-medium capitalize">{result.type} Verification</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(result.status)}
                          {result.result && getResultBadge(result.result)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{result.details}</p>
                      {result.verifiedBy && (
                        <div className="text-xs text-gray-500">
                          Verified by: {result.verifiedBy}
                          {result.verificationDate && (
                            <span className="ml-2">
                              on {new Date(result.verificationDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="criminal" className="space-y-4">
                  {backgroundCheck.criminalChecks.map((check) => (
                    <div key={check.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-red-600" />
                          <span className="font-medium">{check.jurisdiction}</span>
                          <Badge variant="outline" className="text-xs">
                            {check.checkType}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(check.status)}
                          {check.result && getResultBadge(check.result)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{check.details}</p>
                      {check.searchDate && (
                        <div className="text-xs text-gray-500">
                          Searched on {new Date(check.searchDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="credit" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Credit Check</span>
                      </div>
                      {getStatusBadge(backgroundCheck.creditCheck.status)}
                    </div>
                    <p className="text-sm text-gray-600">{backgroundCheck.creditCheck.details}</p>
                    {backgroundCheck.creditCheck.creditScore && (
                      <div className="mt-2">
                        <div className="text-sm font-medium">Credit Score: {backgroundCheck.creditCheck.creditScore}</div>
                        <div className="text-sm text-gray-600">Rating: {backgroundCheck.creditCheck.creditRating}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <div className="text-sm font-medium">Background check created</div>
                        <div className="text-xs text-gray-500">
                          {new Date(backgroundCheck.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {backgroundCheck.consentDate && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <div className="text-sm font-medium">Candidate consent received</div>
                          <div className="text-xs text-gray-500">
                            {new Date(backgroundCheck.consentDate).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                    {backgroundCheck.startedAt && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <div className="text-sm font-medium">Background check started</div>
                          <div className="text-xs text-gray-500">
                            {new Date(backgroundCheck.startedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                    {backgroundCheck.verificationResults
                      .filter(r => r.verificationDate)
                      .map((result) => (
                        <div key={result.id} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                          <div>
                            <div className="text-sm font-medium">
                              {result.type} verification completed
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(result.verificationDate).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default BackgroundCheckDetails

