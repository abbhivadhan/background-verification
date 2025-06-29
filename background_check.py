from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class BackgroundCheck(db.Model):
    __tablename__ = 'background_checks'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    check_type = db.Column(db.String(100), nullable=False)  # 'standard', 'comprehensive', 'basic'
    status = db.Column(db.String(50), default='pending')  # 'pending', 'in_progress', 'completed', 'failed'
    priority = db.Column(db.String(20), default='normal')  # 'low', 'normal', 'high', 'urgent'
    consent_given = db.Column(db.Boolean, default=False)
    consent_date = db.Column(db.DateTime, nullable=True)
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    requester = db.relationship('User', backref='requested_checks', lazy=True)
    verification_results = db.relationship('VerificationResult', backref='background_check', lazy=True, cascade='all, delete-orphan')
    criminal_checks = db.relationship('CriminalCheck', backref='background_check', lazy=True, cascade='all, delete-orphan')
    credit_checks = db.relationship('CreditCheck', backref='background_check', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<BackgroundCheck {self.id} - {self.status}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'requester_id': self.requester_id,
            'check_type': self.check_type,
            'status': self.status,
            'priority': self.priority,
            'consent_given': self.consent_given,
            'consent_date': self.consent_date.isoformat() if self.consent_date else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class VerificationResult(db.Model):
    __tablename__ = 'verification_results'
    
    id = db.Column(db.Integer, primary_key=True)
    background_check_id = db.Column(db.Integer, db.ForeignKey('background_checks.id'), nullable=False)
    verification_type = db.Column(db.String(100), nullable=False)  # 'education', 'employment', 'reference', 'license'
    record_id = db.Column(db.Integer, nullable=True)  # ID of the specific record being verified
    status = db.Column(db.String(50), default='pending')  # 'pending', 'verified', 'failed', 'discrepancy'
    result = db.Column(db.String(50), nullable=True)  # 'pass', 'fail', 'inconclusive'
    details = db.Column(db.Text, nullable=True)
    verification_method = db.Column(db.String(100), nullable=True)  # 'automated', 'manual', 'third_party'
    verified_by = db.Column(db.String(200), nullable=True)  # Name of verifying entity
    verification_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<VerificationResult {self.verification_type} - {self.status}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'background_check_id': self.background_check_id,
            'verification_type': self.verification_type,
            'record_id': self.record_id,
            'status': self.status,
            'result': self.result,
            'details': self.details,
            'verification_method': self.verification_method,
            'verified_by': self.verified_by,
            'verification_date': self.verification_date.isoformat() if self.verification_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class CriminalCheck(db.Model):
    __tablename__ = 'criminal_checks'
    
    id = db.Column(db.Integer, primary_key=True)
    background_check_id = db.Column(db.Integer, db.ForeignKey('background_checks.id'), nullable=False)
    jurisdiction = db.Column(db.String(200), nullable=False)  # County, State, Federal
    check_type = db.Column(db.String(100), nullable=False)  # 'county', 'state', 'federal', 'sex_offender'
    status = db.Column(db.String(50), default='pending')
    result = db.Column(db.String(50), nullable=True)  # 'clear', 'records_found', 'unable_to_verify'
    records_found = db.Column(db.Boolean, default=False)
    record_details = db.Column(db.Text, nullable=True)
    search_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<CriminalCheck {self.jurisdiction} - {self.status}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'background_check_id': self.background_check_id,
            'jurisdiction': self.jurisdiction,
            'check_type': self.check_type,
            'status': self.status,
            'result': self.result,
            'records_found': self.records_found,
            'record_details': self.record_details,
            'search_date': self.search_date.isoformat() if self.search_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class CreditCheck(db.Model):
    __tablename__ = 'credit_checks'
    
    id = db.Column(db.Integer, primary_key=True)
    background_check_id = db.Column(db.Integer, db.ForeignKey('background_checks.id'), nullable=False)
    credit_bureau = db.Column(db.String(100), nullable=True)  # 'Experian', 'Equifax', 'TransUnion'
    credit_score = db.Column(db.Integer, nullable=True)
    credit_rating = db.Column(db.String(50), nullable=True)  # 'Excellent', 'Good', 'Fair', 'Poor'
    bankruptcies = db.Column(db.Integer, default=0)
    liens = db.Column(db.Integer, default=0)
    judgments = db.Column(db.Integer, default=0)
    collections = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='pending')
    report_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<CreditCheck {self.credit_score} - {self.status}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'background_check_id': self.background_check_id,
            'credit_bureau': self.credit_bureau,
            'credit_score': self.credit_score,
            'credit_rating': self.credit_rating,
            'bankruptcies': self.bankruptcies,
            'liens': self.liens,
            'judgments': self.judgments,
            'collections': self.collections,
            'status': self.status,
            'report_date': self.report_date.isoformat() if self.report_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

