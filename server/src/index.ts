import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import { AIController } from './controllers/aiController';
import { VoiceController } from './controllers/voiceController';
import { ProjectController } from './controllers/projectController';
import { RenderController } from './controllers/renderController';
import { searchVideo } from './services/pexelsService';

const app = express();

// Security and Logging Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

// Static directories for served audio, exports, and server/output/
app.use(express.static(path.join(__dirname, 'public')));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/exports', express.static(path.join(__dirname, 'public/exports')));
app.use('/output', express.static(path.resolve(__dirname, '../output')));

// Check if frontend production client/dist build exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'AI Video Content Studio API', timestamp: new Date().toISOString() });
});

// Pexels Video Search API Route
app.get('/api/video', async (req, res) => {
  const query = (req.query.query as string) || 'Artificial Intelligence';
  const url = await searchVideo(query);
  res.json({
    success: true,
    video: url,
  });
});

// AI Content Pre-Production Endpoints
app.post('/api/generate-script', AIController.generateScript);
app.post('/api/generate-scenes', AIController.generateScenes);
app.post('/api/generate-scene-artwork', AIController.generateSceneArtwork);
app.post('/api/generate-thumbnail', AIController.generateThumbnail);
app.post('/api/generate-title', AIController.generateTitle);
app.post('/api/generate-description', AIController.generateDescription);
app.post('/api/generate-hashtags', AIController.generateHashtags);

// ElevenLabs Audio Synthesis Endpoints
app.get('/api/voices', VoiceController.getVoices);
app.post('/api/generate-voice', VoiceController.generateVoice);
app.post('/api/generate-scene-voices', VoiceController.generateSceneVoices);

// Remotion Video Rendering API Endpoints
app.post('/api/render', RenderController.renderApi);
app.post('/api/generate-and-render-video', RenderController.generateAndRenderVideo);
app.post('/api/render-video', RenderController.renderVideo);

// Project Management CRUD Endpoints
app.get('/api/projects', ProjectController.getProjects);
app.post('/api/projects', ProjectController.createProject);
app.patch('/api/projects/:id', ProjectController.updateProject);
app.delete('/api/projects/:id', ProjectController.deleteProject);

// Root Route & Landing Page
app.get('/', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>AI Video Studio - Server Active</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0B0F19; color: #fff; display: flex; height: 100vh; margin: 0; align-items: center; justify-content: center; text-align: center; }
        .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 24px; max-width: 500px; }
        h1 { color: #A78BFA; margin-bottom: 8px; }
        p { color: #9CA3AF; font-size: 14px; margin-bottom: 24px; }
        a { display: inline-block; background: #8B5CF6; color: #fff; padding: 12px 28px; border-radius: 12px; font-weight: bold; text-decoration: none; transition: 0.2s; }
        a:hover { background: #7C3AED; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🚀 AI Video Studio API Active</h1>
        <p>The Express backend API server and Remotion renderer are running on port 5000.</p>
        <a href="http://localhost:3000">Open AI Video Studio (port 3000) &rarr;</a>
      </div>
    </body>
    </html>
  `);
});

// Catch-all SPA route
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.redirect('http://localhost:3000');
});

// Start Express Server
app.listen(config.port, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 AI Video Content Studio Backend API running on http://localhost:${config.port}`);
  console.log(`🔒 ElevenLabs API Key configured: ${config.elevenlabsApiKey ? 'YES' : 'NO'}`);
  console.log(`🎥 Pexels API Key configured: ${config.pexelsApiKey ? 'YES' : 'NO'}`);
  console.log(`==================================================\n`);
});
