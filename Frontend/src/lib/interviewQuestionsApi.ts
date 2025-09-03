// API utility for Interview Questions CRUD

const API_URL = 'http://localhost:5000/api/interview-questions';


export async function fetchInterviewQuestions(interviewId: string, token: string) {
  const res = await fetch(`${API_URL}/${interviewId}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function createInterviewQuestion(question: any, token: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(question)
  });
  if (!res.ok) throw new Error('Failed to create question');
  return res.json();
}

export async function updateInterviewQuestion(id: string, question: any, token: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(question)
  });
  if (!res.ok) throw new Error('Failed to update question');
  return res.json();
}

export async function deleteInterviewQuestion(id: string, token: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error('Failed to delete question');
  return res.json();
}
