from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Candidate(db.Model):
    __tablename__ = 'candidates'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    ssn = db.Column(db.String(11), nullable=True)  # Encrypted in production
    address_line1 = db.Column(db.String(200), nullable=True)
    address_line2 = db.Column(db.String(200), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(50), nullable=True)
    zip_code = db.Column(db.String(10), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    background_checks = db.relationship('BackgroundCheck', backref='candidate', lazy=True, cascade='all, delete-orphan')
    education_records = db.relationship('EducationRecord', backref='candidate', lazy=True, cascade='all, delete-orphan')
    employment_records = db.relationship('EmploymentRecord', backref='candidate', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Candidate {self.first_name} {self.last_name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'address': {
                'line1': self.address_line1,
                'line2': self.address_line2,
                'city': self.city,
                'state': self.state,
                'zip_code': self.zip_code,
                'country': self.country
            },
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class EducationRecord(db.Model):
    __tablename__ = 'education_records'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    institution_name = db.Column(db.String(200), nullable=False)
    degree_type = db.Column(db.String(100), nullable=True)  # Bachelor's, Master's, PhD, etc.
    field_of_study = db.Column(db.String(200), nullable=True)
    graduation_date = db.Column(db.Date, nullable=True)
    gpa = db.Column(db.Float, nullable=True)
    verified = db.Column(db.Boolean, default=False)
    verification_date = db.Column(db.DateTime, nullable=True)
    verification_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<EducationRecord {self.institution_name} - {self.degree_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'institution_name': self.institution_name,
            'degree_type': self.degree_type,
            'field_of_study': self.field_of_study,
            'graduation_date': self.graduation_date.isoformat() if self.graduation_date else None,
            'gpa': self.gpa,
            'verified': self.verified,
            'verification_date': self.verification_date.isoformat() if self.verification_date else None,
            'verification_notes': self.verification_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class EmploymentRecord(db.Model):
    __tablename__ = 'employment_records'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    company_name = db.Column(db.String(200), nullable=False)
    job_title = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    current_position = db.Column(db.Boolean, default=False)
    supervisor_name = db.Column(db.String(200), nullable=True)
    supervisor_contact = db.Column(db.String(200), nullable=True)
    salary = db.Column(db.Numeric(10, 2), nullable=True)
    reason_for_leaving = db.Column(db.Text, nullable=True)
    verified = db.Column(db.Boolean, default=False)
    verification_date = db.Column(db.DateTime, nullable=True)
    verification_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<EmploymentRecord {self.company_name} - {self.job_title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'company_name': self.company_name,
            'job_title': self.job_title,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'current_position': self.current_position,
            'supervisor_name': self.supervisor_name,
            'supervisor_contact': self.supervisor_contact,
            'salary': float(self.salary) if self.salary else None,
            'reason_for_leaving': self.reason_for_leaving,
            'verified': self.verified,
            'verification_date': self.verification_date.isoformat() if self.verification_date else None,
            'verification_notes': self.verification_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

