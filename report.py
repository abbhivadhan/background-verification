from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    background_check_id = db.Column(db.Integer, db.ForeignKey('background_checks.id'), nullable=False)
    report_type = db.Column(db.String(100), nullable=False)  # 'summary', 'detailed', 'compliance'
    format = db.Column(db.String(50), default='pdf')  # 'pdf', 'html', 'json'
    status = db.Column(db.String(50), default='pending')  # 'pending', 'generated', 'delivered', 'failed'
    file_path = db.Column(db.String(500), nullable=True)
    generated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    generated_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    background_check = db.relationship('BackgroundCheck', backref='reports', lazy=True)
    generator = db.relationship('User', backref='generated_reports', lazy=True)
    
    def __repr__(self):
        return f'<Report {self.id} - {self.report_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'background_check_id': self.background_check_id,
            'report_type': self.report_type,
            'format': self.format,
            'status': self.status,
            'file_path': self.file_path,
            'generated_by': self.generated_by,
            'generated_at': self.generated_at.isoformat() if self.generated_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    action = db.Column(db.String(200), nullable=False)
    resource_type = db.Column(db.String(100), nullable=False)  # 'candidate', 'background_check', 'report'
    resource_id = db.Column(db.Integer, nullable=True)
    details = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='audit_logs', lazy=True)
    
    def __repr__(self):
        return f'<AuditLog {self.action} - {self.resource_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action': self.action,
            'resource_type': self.resource_type,
            'resource_id': self.resource_id,
            'details': self.details,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

class Configuration(db.Model):
    __tablename__ = 'configurations'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(200), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True)  # 'verification', 'reporting', 'compliance'
    is_encrypted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Configuration {self.key}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'value': self.value if not self.is_encrypted else '[ENCRYPTED]',
            'description': self.description,
            'category': self.category,
            'is_encrypted': self.is_encrypted,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

