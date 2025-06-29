from flask import Blueprint, request, jsonify
from src.services.education_verification import EducationVerificationService
from src.services.employment_verification import EmploymentVerificationService
from src.services.criminal_background import CriminalBackgroundService
from src.services.workflow_automation import BackgroundCheckWorkflow

verification_bp = Blueprint('verification', __name__)

# Initialize services
education_service = EducationVerificationService()
employment_service = EmploymentVerificationService()
criminal_service = CriminalBackgroundService()
workflow_service = BackgroundCheckWorkflow()

@verification_bp.route('/verification/education/<int:education_record_id>', methods=['POST'])
def verify_education_record(education_record_id):
    """Verify a specific education record"""
    data = request.get_json()
    background_check_id = data.get('background_check_id')
    
    if not background_check_id:
        return jsonify({'error': 'background_check_id is required'}), 400
    
    result = education_service.verify_education_record(education_record_id, background_check_id)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/verification/education/bulk', methods=['POST'])
def bulk_verify_education():
    """Verify multiple education records in bulk"""
    data = request.get_json()
    
    required_fields = ['education_record_ids', 'background_check_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    result = education_service.bulk_verify_education_records(
        data['education_record_ids'], 
        data['background_check_id']
    )
    
    return jsonify(result)

@verification_bp.route('/verification/employment/<int:employment_record_id>', methods=['POST'])
def verify_employment_record(employment_record_id):
    """Verify a specific employment record"""
    data = request.get_json()
    background_check_id = data.get('background_check_id')
    
    if not background_check_id:
        return jsonify({'error': 'background_check_id is required'}), 400
    
    result = employment_service.verify_employment_record(employment_record_id, background_check_id)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/verification/employment/<int:employment_record_id>/supervisor', methods=['POST'])
def verify_with_supervisor(employment_record_id):
    """Initiate supervisor verification for employment record"""
    data = request.get_json()
    background_check_id = data.get('background_check_id')
    
    if not background_check_id:
        return jsonify({'error': 'background_check_id is required'}), 400
    
    result = employment_service.verify_with_supervisor(employment_record_id, background_check_id)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/verification/employment/bulk', methods=['POST'])
def bulk_verify_employment():
    """Verify multiple employment records in bulk"""
    data = request.get_json()
    
    required_fields = ['employment_record_ids', 'background_check_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    result = employment_service.bulk_verify_employment_records(
        data['employment_record_ids'], 
        data['background_check_id']
    )
    
    return jsonify(result)

@verification_bp.route('/verification/criminal/<int:background_check_id>', methods=['POST'])
def conduct_criminal_check(background_check_id):
    """Conduct criminal background check"""
    data = request.get_json() or {}
    jurisdictions = data.get('jurisdictions')
    
    result = criminal_service.conduct_criminal_check(background_check_id, jurisdictions)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/verification/criminal/<int:background_check_id>/federal', methods=['POST'])
def conduct_federal_criminal_check(background_check_id):
    """Conduct federal criminal background check"""
    result = criminal_service.get_federal_criminal_check(background_check_id)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/verification/criminal/<int:background_check_id>/sex-offender', methods=['POST'])
def conduct_sex_offender_check(background_check_id):
    """Conduct sex offender registry check"""
    result = criminal_service.get_sex_offender_check(background_check_id)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/verification/criminal/<int:background_check_id>/status', methods=['GET'])
def get_criminal_check_status(background_check_id):
    """Get status of criminal checks for a background check"""
    result = criminal_service.get_criminal_check_status(background_check_id)
    
    return jsonify(result)

@verification_bp.route('/workflow/<int:background_check_id>/start', methods=['POST'])
def start_workflow(background_check_id):
    """Start automated background check workflow"""
    result = workflow_service.start_background_check_workflow(background_check_id)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/workflow/<int:background_check_id>/status', methods=['GET'])
def get_workflow_status(background_check_id):
    """Get workflow status for a background check"""
    result = workflow_service.get_workflow_status(background_check_id)
    
    if 'error' in result:
        return jsonify(result), 404
    
    return jsonify(result)

@verification_bp.route('/verification/education/<int:education_record_id>/manual', methods=['POST'])
def request_manual_education_verification(education_record_id):
    """Request manual verification for education record"""
    result = education_service.manual_verification_required(education_record_id)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/verification/employment/<int:employment_record_id>/manual', methods=['POST'])
def request_manual_employment_verification(employment_record_id):
    """Request manual verification for employment record"""
    result = employment_service.manual_verification_required(employment_record_id)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@verification_bp.route('/verification/employment/<int:employment_record_id>/status', methods=['GET'])
def get_employment_verification_status(employment_record_id):
    """Get verification status for employment record"""
    result = employment_service.get_employment_verification_status(employment_record_id)
    
    if 'error' in result:
        return jsonify(result), 404
    
    return jsonify(result)

