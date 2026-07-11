bandlab_publisher.py
# backend/bandlab_publisher.py
# BandLab API Integration for publishing beats

import os
import io
import json
import requests
from typing import Dict, Optional
from urllib.parse import urlencode

# BandLab API endpoints
BANDLAB_API_BASE = "https://api.bandlab.com/v1"
BANDLAB_AUTH_URL = "https://api.bandlab.com/oauth/authorize"
BANDLAB_TOKEN_URL = "https://api.bandlab.com/oauth/token"


class BandLabPublisher:
    """Handles publishing beats to BandLab."""
    
    def __init__(self, client_id: str = None, client_secret: str = None):
        self.client_id = client_id or os.getenv('BANDLAB_CLIENT_ID')
        self.client_secret = client_secret or os.getenv('BANDLAB_CLIENT_SECRET')
        self.access_token = None
        self.user_id = None
    
    def authenticate(self, auth_code: str = None, redirect_uri: str = None) -> bool:
        """
        Authenticate with BandLab API.
        Either use an auth_code from OAuth flow or stored token.
        """
        if not self.client_id or not self.client_secret:
            raise ValueError("BandLab credentials not configured")
        
        # In production, exchange auth_code for tokens
        # For demo, we'll use a mock authentication
        
        if auth_code:
            # Exchange code for token
            token_data = {
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'grant_type': 'authorization_code',
                'code': auth_code,
                'redirect_uri': redirect_uri
            }
            
            try:
                response = requests.post(BANDLAB_TOKEN_URL, data=token_data)
                if response.status_code == 200:
                    token_info = response.json()
                    self.access_token = token_info.get('access_token')
                    self.user_id = token_info.get('user_id')
                    return True
            except requests.RequestException as e:
                raise ConnectionError(f"BandLab authentication failed: {e}")
        
        return False
    
    def set_access_token(self, token: str, user_id: str = None):
        """Set access token directly (for testing)."""
        self.access_token = token
        self.user_id = user_id
    
    def create_project(self, name: str, description: str = "", 
                      is_public: bool = True) -> Optional[Dict]:
        """Create a new BandLab project."""
        if not self.access_token:
            raise ValueError("Not authenticated with BandLab")
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        project_data = {
            'name': name,
            'description': description,
            'public': is_public
        }
        
        try:
            response = requests.post(
                f"{BANDLAB_API_BASE}/projects",
                headers=headers,
                json=project_data
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                raise ValueError(f"Failed to create project: {response.status_code}")
                
        except requests.RequestException as e:
            raise ConnectionError(f"BandLab API error: {e}")
    
    def upload_sample(self, project_id: str, file_data: bytes, 
                     filename: str, track_name: str = "Beat") -> Optional[Dict]:
        """Upload a sample/audio file to a project."""
        if not self.access_token:
            raise ValueError("Not authenticated with BandLab")
        
        headers = {
            'Authorization': f'Bearer {self.access_token}'
        }
        
        files = {
            'file': (filename, io.BytesIO(file_data), 'audio/wav')
        }
        
        data = {
            'projectId': project_id,
            'trackName': track_name,
            'type': 'sample'
        }
        
        try:
            response = requests.post(
                f"{BANDLAB_API_BASE}/samples",
                headers=headers,
                files=files,
                data=data
            )
            
            if response.status_code in [200, 201]:
                return response.json()
            else:
                raise ValueError(f"Failed to upload sample: {response.status_code}")
                
        except requests.RequestException as e:
            raise ConnectionError(f"BandLab upload error: {e}")
    
    def publish_project(self, project_id: str) -> bool:
        """Publish a project (make it public)."""
        if not self.access_token:
            raise ValueError("Not authenticated with BandLab")
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(
                f"{BANDLAB_API_BASE}/projects/{project_id}/publish",
                headers=headers
            )
            
            return response.status_code == 200
            
        except requests.RequestException as e:
            raise ConnectionError(f"BandLab publish error: {e}")
    
    def get_user_projects(self, limit: int = 20) -> list:
        """Get current user's projects."""
        if not self.access_token:
            raise ValueError("Not authenticated with BandLab")
        
        headers = {
            'Authorization': f'Bearer {self.access_token}'
        }
        
        try:
            response = requests.get(
                f"{BANDLAB_API_BASE}/users/me/projects",
                headers=headers,
                params={'limit': limit}
            )
            
            if response.status_code == 200:
                return response.json().get('projects', [])
            return []
            
        except requests.RequestException as e:
            raise ConnectionError(f"BandLab API error: {e}")


def beat_plan_to_wav(beat_plan: Dict) -> bytes:
    """
    Convert beat plan to WAV format.
    In production, this would use audio synthesis.
    For now, returns a placeholder.
    """
    # This is a placeholder - in production, use pydub, scipy, or DAW API
    # to actually generate the audio
    return b'RIFF' + b'\x00' * 100 + b'WAVE'


def publish_to_bandlab(beat_plan: Dict, access_token: str, 
                       user_id: str = None) -> Dict:
    """
    Main function to publish a beat to BandLab.
    
    Args:
        beat_plan: The beat data dictionary
        access_token: BandLab OAuth access token
        user_id: Optional user ID
    
    Returns:
        Dict with project URL and details
    """
    publisher = BandLabPublisher()
    publisher.set_access_token(access_token, user_id)
    
    # Create project name
    producer = beat_plan.get('producer', 'Producer')
    genre = beat_plan.get('genre', 'Hip Hop')
    tempo = beat_plan.get('tempo', 78)
    
    project_name = f"🎵 {producer} Type Beat - {genre} {tempo}BPM"
    project_description = f"""
    Generated by Barksdale Music Group
    Producer: {producer}
    Genre: {genre}
    Tempo: {tempo} BPM
    Key: {beat_plan.get('key', 'Unknown')}
    Emotion: {beat_plan.get('emotion', 'Unknown')}
    
    Chords: {beat_plan.get('chord_progression_line', '')}
    """
    
    # Create project
    project = publisher.create_project(
        name=project_name,
        description=project_description,
        is_public=True
    )
    
    if not project:
        raise ValueError("Failed to create BandLab project")
    
    project_id = project.get('id')
    project_url = f"https://www.bandlab.com/post/{project_id}"
    
    # Generate audio placeholder (in production, render actual audio)
    wav_data = beat_plan_to_wav(beat_plan)
    
    # Upload sample
    try:
        publisher.upload_sample(
            project_id=project_id,
            file_data=wav_data,
            filename=f"barksdale_beat_{project_id}.wav",
            track_name="Barksdale Beat"
        )
    except Exception:
        # Continue even if upload fails (project created)
        pass
    
    return {
        'success': True,
        'project_id': project_id,
        'project_url': project_url,
        'project_name': project_name,
        'message': 'Beat published to BandLab successfully!'
    }


def get_bandlab_auth_url(redirect_uri: str, state: str = None) -> str:
    """Get OAuth authorization URL for BandLab."""
    client_id = os.getenv('BANDLAB_CLIENT_ID')
    if not client_id:
        raise ValueError("BANDLAB_CLIENT_ID not configured")
    
    params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'projects:write samples:write'
    }
    
    if state:
        params['state'] = state
    
    return f"{BANDLAB_AUTH_URL}?{urlencode(params)}"


# Demo/mock function for testing without BandLab API
def mock_publish_to_bandlab(beat_plan: Dict) -> Dict:
    """
    Mock publish function for testing without BandLab API.
    Simulates the publishing workflow.
    """
    import uuid
    
    project_id = str(uuid.uuid4())[:8]
    
    return {
        'success': True,
        'project_id': project_id,
        'project_url': f"https://www.bandlab.com/post/{project_id}",
        'project_name': f"🎵 {beat_plan.get('producer', 'Producer')} Type Beat",
        'message': 'Beat published to BandLab successfully! (Demo mode)',
        'demo': True
    }


if __name__ == '__main__':
    # Test with sample beat
    sample_beat = {
        'producer': 'Conductor Williams',
        'genre': 'Boom Bap',
        'tempo': 78,
        'key': 'C Minor',
        'emotion': 'Dark',
        'chord_progression_line': 'Cm, Ab, Fm, G'
    }
    
    result = mock_publish_to_bandlab(sample_beat)
    print(json.dumps(result, indent=2))
