import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Save, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Plus,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

const CandidateForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  })

  const [educationRecords, setEducationRecords] = useState([
    {
      institutionName: '',
      degreeType: '',
      fieldOfStudy: '',
      graduationDate: '',
      gpa: ''
    }
  ])

  const [employmentRecords, setEmploymentRecords] = useState([
    {
      companyName: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      currentPosition: false,
      supervisorName: '',
      supervisorContact: '',
      salary: '',
      reasonForLeaving: ''
    }
  ])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEditing) {
      // Simulate fetching candidate data for editing
      setFormData({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-05-15',
        ssn: '***-**-1234',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      })
    }
  }, [isEditing])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEducationChange = (index, field, value) => {
    const updated = [...educationRecords]
    updated[index][field] = value
    setEducationRecords(updated)
  }

  const handleEmploymentChange = (index, field, value) => {
    const updated = [...employmentRecords]
    updated[index][field] = value
    setEmploymentRecords(updated)
  }

  const addEducationRecord = () => {
    setEducationRecords([...educationRecords, {
      institutionName: '',
      degreeType: '',
      fieldOfStudy: '',
      graduationDate: '',
      gpa: ''
    }])
  }

  const removeEducationRecord = (index) => {
    setEducationRecords(educationRecords.filter((_, i) => i !== index))
  }

  const addEmploymentRecord = () => {
    setEmploymentRecords([...employmentRecords, {
      companyName: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      currentPosition: false,
      supervisorName: '',
      supervisorContact: '',
      salary: '',
      reasonForLeaving: ''
    }])
  }

  const removeEmploymentRecord = (index) => {
    setEmploymentRecords(employmentRecords.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      navigate('/candidates')
    }, 2000)
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
          <Button variant="ghost" onClick={() => navigate('/candidates')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Candidate' : 'Add New Candidate'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Update candidate information' : 'Enter candidate details for background check'}
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>Basic candidate details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="ssn">SSN (Last 4 digits)</Label>
                  <Input
                    id="ssn"
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleInputChange}
                    placeholder="***-**-1234"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </CardTitle>
              <CardDescription>Current residential address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Education History</CardTitle>
              <CardDescription>Educational background and qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {educationRecords.map((record, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Education Record {index + 1}</h4>
                    {educationRecords.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducationRecord(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Institution Name</Label>
                      <Input
                        value={record.institutionName}
                        onChange={(e) => handleEducationChange(index, 'institutionName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Degree Type</Label>
                      <Input
                        value={record.degreeType}
                        onChange={(e) => handleEducationChange(index, 'degreeType', e.target.value)}
                        placeholder="Bachelor's, Master's, PhD, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={record.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        type="date"
                        value={record.graduationDate}
                        onChange={(e) => handleEducationChange(index, 'graduationDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>GPA</Label>
                      <Input
                        value={record.gpa}
                        onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                        placeholder="3.5"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addEducationRecord}>
                <Plus className="w-4 h-4 mr-2" />
                Add Education Record
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Employment Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Employment History</CardTitle>
              <CardDescription>Work experience and employment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {employmentRecords.map((record, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Employment Record {index + 1}</h4>
                    {employmentRecords.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmploymentRecord(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={record.companyName}
                        onChange={(e) => handleEmploymentChange(index, 'companyName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={record.jobTitle}
                        onChange={(e) => handleEmploymentChange(index, 'jobTitle', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={record.startDate}
                        onChange={(e) => handleEmploymentChange(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={record.endDate}
                        onChange={(e) => handleEmploymentChange(index, 'endDate', e.target.value)}
                        disabled={record.currentPosition}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Supervisor Name</Label>
                      <Input
                        value={record.supervisorName}
                        onChange={(e) => handleEmploymentChange(index, 'supervisorName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Supervisor Contact</Label>
                      <Input
                        value={record.supervisorContact}
                        onChange={(e) => handleEmploymentChange(index, 'supervisorContact', e.target.value)}
                        placeholder="Email or phone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Reason for Leaving</Label>
                    <Textarea
                      value={record.reasonForLeaving}
                      onChange={(e) => handleEmploymentChange(index, 'reasonForLeaving', e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addEmploymentRecord}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employment Record
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end space-x-4"
        >
          <Button type="button" variant="outline" onClick={() => navigate('/candidates')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? 'Update Candidate' : 'Save Candidate'}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}

export default CandidateForm

