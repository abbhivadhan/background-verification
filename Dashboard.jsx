import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeChecks: 0,
    completedChecks: 0,
    pendingChecks: 0
  })

  const [recentActivity, setRecentActivity] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Simulate fetching dashboard data
    setStats({
      totalCandidates: 1247,
      activeChecks: 23,
      completedChecks: 892,
      pendingChecks: 45
    })

    setRecentActivity([
      { id: 1, type: 'check_completed', candidate: 'John Smith', time: '2 minutes ago' },
      { id: 2, type: 'check_started', candidate: 'Sarah Johnson', time: '15 minutes ago' },
      { id: 3, type: 'candidate_added', candidate: 'Mike Davis', time: '1 hour ago' },
      { id: 4, type: 'verification_failed', candidate: 'Lisa Wilson', time: '2 hours ago' },
      { id: 5, type: 'report_generated', candidate: 'Tom Brown', time: '3 hours ago' }
    ])

    setChartData([
      { month: 'Jan', checks: 65, completed: 58 },
      { month: 'Feb', checks: 78, completed: 72 },
      { month: 'Mar', checks: 92, completed: 85 },
      { month: 'Apr', checks: 87, completed: 81 },
      { month: 'May', checks: 105, completed: 98 },
      { month: 'Jun', checks: 118, completed: 112 }
    ])
  }, [])

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.totalCandidates.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Checks',
      value: stats.activeChecks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Completed Checks',
      value: stats.completedChecks.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingChecks,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '-8%',
      changeType: 'negative'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'check_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'check_started':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'candidate_added':
        return <Users className="w-4 h-4 text-purple-600" />
      case 'verification_failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'report_generated':
        return <FileCheck className="w-4 h-4 text-indigo-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'check_completed':
        return `Background check completed for ${activity.candidate}`
      case 'check_started':
        return `Background check started for ${activity.candidate}`
      case 'candidate_added':
        return `New candidate ${activity.candidate} added`
      case 'verification_failed':
        return `Verification failed for ${activity.candidate}`
      case 'report_generated':
        return `Report generated for ${activity.candidate}`
      default:
        return `Activity for ${activity.candidate}`
    }
  }

  const pieData = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'In Progress', value: 20, color: '#f59e0b' },
    { name: 'Pending', value: 10, color: '#ef4444' },
    { name: 'On Hold', value: 5, color: '#6b7280' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your background check operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            New Check
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <Badge 
                          variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {stat.change}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Background Checks</CardTitle>
              <CardDescription>Checks initiated vs completed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="checks" fill="#3b82f6" name="Initiated" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Check Status Distribution</CardTitle>
              <CardDescription>Current status of all background checks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
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

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your background check system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {getActivityText(activity)}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard

