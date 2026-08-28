import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USER,
  MOCK_DOCTORS,
  MOCK_HOSPITALS,
  MOCK_BANNERS,
  MOCK_EMERGENCY_ALERTS,
  MOCK_CHRONIC_ALERTS,
  MOCK_REWARD_OFFERS,
  MOCK_RECORDS,
  MOCK_APPOINTMENTS,
  MOCK_NOTIFICATIONS,
} from './src/data/mockData';
import {
  Doctor,
  Hospital,
  Banner,
  EmergencyAlert,
  AppointmentRequest,
  MedicalRecord,
  SosLog,
  FeedbackItem,
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Memory Data Store initialized with mock data
let doctorsStore: Doctor[] = [...MOCK_DOCTORS];
let hospitalsStore: Hospital[] = [...MOCK_HOSPITALS];
let bannersStore: Banner[] = [...MOCK_BANNERS];
let emergencyAlertsStore: EmergencyAlert[] = [...MOCK_EMERGENCY_ALERTS];
let appointmentsStore: AppointmentRequest[] = [...MOCK_APPOINTMENTS];
let recordsStore: MedicalRecord[] = [...MOCK_RECORDS];
let sosLogsStore: SosLog[] = [];
let feedbackStore: FeedbackItem[] = [];
let rewardsOffersStore = [...MOCK_REWARD_OFFERS];

// Initialize Gemini Client Lazy Handler
function getGenAIClient(customApiKey?: string): GoogleGenAI {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please set GEMINI_API_KEY or configure a Secret API Key in Admin Console.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System Instruction for MedConnect Pulse AI Assistant
const PULSE_SYSTEM_INSTRUCTION = `
You are "MedConnect Pulse", an AI-powered educational healthcare companion integrated into the MEDCONNECT PWA app.
Your role is to assist users by:
1. Explaining complex medical terminology in simple, friendly, easily understandable terms.
2. Translating prescription instructions, lab reports, diagnostic test values, and discharge summaries into patient-friendly language.
3. Offering general symptom guidance, wellness tips, nutrition suggestions, and first-aid instructions.
4. Answering general health questions calmly, professionally, and empathetically.

STRICT MANDATES & SAFETY RULES:
- YOU ARE AN EDUCATIONAL AI ASSISTANT, NOT A DOCTOR.
- NEVER DIAGNOSE DISEASES, PRESCRIBE MEDICATIONS, OR PROMISE SPECIFIC MEDICAL OUTCOMES.
- Always include a short, gentle disclaimer if the user asks about symptoms or lab reports (e.g. "MedConnect Pulse provides educational guidance only. Please consult a qualified doctor for diagnosis and treatment.").
- If symptoms sound life-threatening (e.g. severe chest pain, extreme shortness of breath, sudden numbness, uncontrolled bleeding), IMMEDIATELY advise the user to press the red SOS button in MEDCONNECT or call 112 / 108 immediately.
- Maintain a warm, clear, supportive tone. Use clean bullet points and bold key terms for readability.
`;

// --- API ENDPOINTS ---

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// MedConnect Pulse AI Assistant Chat API
app.post('/api/pulse/chat', async (req, res) => {
  try {
    const { prompt, imageBase64, history, customApiKey } = req.body;
    const headerApiKey = req.headers['x-custom-api-key'] as string | undefined;
    const resolvedKey = customApiKey || headerApiKey;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required.' });
    }

    const ai = getGenAIClient(resolvedKey);

    // Prepare contents
    const parts: any[] = [];

    if (imageBase64) {
      // Remove data URL prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64,
        },
      });
      parts.push({
        text: prompt
          ? prompt
          : 'Please analyze this medical record, lab report, or prescription image. Explain the key terms, findings, or dosage instructions clearly in simple terms, and point out what the user should discuss with their physician.',
      });
    } else {
      parts.push({ text: prompt });
    }

    // Build context if conversation history provided
    let contentsPayload: any = parts;
    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = history.map((item: any) => ({
        role: item.role === 'pulse' ? 'model' : 'user',
        parts: [{ text: item.text }],
      }));

      // Add user current request
      formattedHistory.push({
        role: 'user',
        parts,
      });

      contentsPayload = formattedHistory;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contentsPayload,
      config: {
        systemInstruction: PULSE_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    const replyText = response.text || 'MedConnect Pulse was unable to process your request at this moment. Please try again.';

    return res.json({ text: replyText });
  } catch (err: any) {
    console.error('Pulse AI error:', err);
    return res.status(500).json({
      error: 'MedConnect Pulse AI failed to process request.',
      details: err.message || 'Unknown error',
    });
  }
});

// Doctors API
app.get('/api/doctors', (_req, res) => {
  res.json(doctorsStore);
});

app.post('/api/doctors', (req, res) => {
  const newDoctor: Doctor = {
    id: `doc_${Date.now()}`,
    ...req.body,
    rating: 4.8,
  };
  doctorsStore.push(newDoctor);
  res.status(201).json(newDoctor);
});

app.delete('/api/doctors/:id', (req, res) => {
  const { id } = req.params;
  doctorsStore = doctorsStore.filter((d) => d.id !== id);
  res.json({ success: true });
});

// Hospitals API
app.get('/api/hospitals', (_req, res) => {
  res.json(hospitalsStore);
});

app.post('/api/hospitals', (req, res) => {
  const newHospital: Hospital = {
    id: `hosp_${Date.now()}`,
    ...req.body,
  };
  hospitalsStore.push(newHospital);
  res.status(201).json(newHospital);
});

// Appointments API
app.get('/api/appointments', (_req, res) => {
  res.json(appointmentsStore);
});

app.post('/api/appointments', (req, res) => {
  const newApp: AppointmentRequest = {
    id: `app_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...req.body,
  };
  appointmentsStore.unshift(newApp);
  res.status(201).json(newApp);
});

app.patch('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appIndex = appointmentsStore.findIndex((a) => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  appointmentsStore[appIndex] = {
    ...appointmentsStore[appIndex],
    ...req.body,
  };
  res.json(appointmentsStore[appIndex]);
});

app.post('/api/appointments/:id/prescription', (req, res) => {
  const { id } = req.params;
  const { summary, diagnosis, medicines, advice } = req.body;
  const appIndex = appointmentsStore.findIndex((a) => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const prescriptionSummary = {
    summary,
    diagnosis,
    medicines: medicines || [],
    advice,
    date: new Date().toISOString().split('T')[0],
  };

  appointmentsStore[appIndex].status = 'completed';
  appointmentsStore[appIndex].prescriptionSummary = prescriptionSummary;

  // Also auto-add record to user's medical records
  const newRecord: MedicalRecord = {
    id: `rec_${Date.now()}`,
    userId: appointmentsStore[appIndex].userId,
    title: `Prescription Summary - ${appointmentsStore[appIndex].doctorName}`,
    category: 'Prescription',
    recordDate: prescriptionSummary.date,
    fileName: `prescription_${appointmentsStore[appIndex].doctorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
    fileSize: '650 KB',
    doctorName: appointmentsStore[appIndex].doctorName,
    notes: `Diagnosis: ${diagnosis}. Summary: ${summary}`,
    isDownloadedOffline: false,
    uploadedAt: new Date().toISOString(),
  };
  recordsStore.unshift(newRecord);

  res.json(appointmentsStore[appIndex]);
});

// Records API
app.get('/api/records', (_req, res) => {
  res.json(recordsStore);
});

app.post('/api/records', (req, res) => {
  const newRec: MedicalRecord = {
    id: `rec_${Date.now()}`,
    uploadedAt: new Date().toISOString(),
    isDownloadedOffline: true,
    ...req.body,
  };
  recordsStore.unshift(newRec);
  res.status(201).json(newRec);
});

app.delete('/api/records/:id', (req, res) => {
  const { id } = req.params;
  recordsStore = recordsStore.filter((r) => r.id !== id);
  res.json({ success: true });
});

// Banners API
app.get('/api/banners', (_req, res) => {
  res.json(bannersStore);
});

app.post('/api/banners', (req, res) => {
  const newBanner: Banner = {
    id: `ban_${Date.now()}`,
    isActive: true,
    priority: bannersStore.length + 1,
    ...req.body,
  };
  bannersStore.unshift(newBanner);
  res.status(201).json(newBanner);
});

app.delete('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  bannersStore = bannersStore.filter((b) => b.id !== id);
  res.json({ success: true });
});

// Alerts API
app.get('/api/alerts', (_req, res) => {
  res.json({
    emergency: emergencyAlertsStore,
    chronic: MOCK_CHRONIC_ALERTS,
  });
});

// SOS Alert API
app.post('/api/sos', (req, res) => {
  const { userId, userName, userPhone, latitude, longitude, address, contactsNotified } = req.body;
  const newLog: SosLog = {
    id: `sos_${Date.now()}`,
    userId: userId || 'usr_101',
    userName: userName || 'Alexander Wright',
    userPhone: userPhone || '+1 (555) 019-2834',
    latitude: latitude || 37.7749,
    longitude: longitude || -122.4194,
    address: address || 'Metro City Downtown (GPS location detected)',
    contactsNotified: contactsNotified || ['Sarah Wright (+1 555-019-9988)', 'David Wright (+1 555-019-7744)'],
    timestamp: new Date().toISOString(),
  };
  sosLogsStore.unshift(newLog);

  res.status(201).json({
    success: true,
    message: 'SOS Alert dispatched to 112/108 dispatch and emergency contacts.',
    log: newLog,
  });
});

app.get('/api/sos/logs', (_req, res) => {
  res.json(sosLogsStore);
});

// Analytics API for Admin
app.get('/api/analytics', (_req, res) => {
  res.json({
    totalUsers: 1420,
    totalDoctors: doctorsStore.length,
    totalHospitals: hospitalsStore.length,
    totalAppointments: appointmentsStore.length,
    pendingAppointments: appointmentsStore.filter((a) => a.status === 'pending').length,
    completedAppointments: appointmentsStore.filter((a) => a.status === 'completed').length,
    totalRecordsUploaded: recordsStore.length,
    sosTriggersCount: sosLogsStore.length,
    activeBannersCount: bannersStore.filter((b) => b.isActive).length,
  });
});

// Feedback API
app.post('/api/feedback', (req, res) => {
  const newFeedback: FeedbackItem = {
    id: `fb_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...req.body,
  };
  feedbackStore.unshift(newFeedback);
  res.status(201).json(newFeedback);
});

app.get('/api/feedback', (_req, res) => {
  res.json(feedbackStore);
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MEDCONNECT Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
