import { Request, Response, NextFunction } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidateRoutes';
import positionRoutes from './routes/positionRoutes';
import { uploadFile } from './application/services/fileUploadService';
import cors from 'cors';

// Load environment variables first - must be done before importing Prisma client
if (process.env.NODE_ENV === 'test') {
  const result = dotenv.config({ path: '.env.test' });
  if (result.error) {
    console.error('Error loading .env.test file:', result.error);
    throw new Error('Failed to load .env.test file');
  } else {
    console.log('Loaded TEST environment from .env.test');
  }
} else {
  const result = dotenv.config();
  if (result.error) {
    console.error('Error loading .env file:', result.error);
  } else {
    console.log('Loaded DEV environment from .env');
  }
}

// Import Prisma client after environment variables are loaded
import prisma from './lib/prisma';

// Extender la interfaz Request para incluir prisma
declare global {
  namespace Express {
    interface Request {
      prisma: typeof prisma;
    }
  }
}

export const app = express();
export default app;

// Middleware para parsear JSON. Asegúrate de que esto esté antes de tus rutas.
app.use(express.json());

// Middleware para adjuntar prisma al objeto de solicitud
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Middleware para permitir CORS desde http://localhost:3000
app.use(cors({
  origin: process.env.NODE_ENV === 'test' ? 'http://localhost:3001' : 'http://localhost:3000',
  credentials: true
}));

// Import and use candidateRoutes
app.use('/candidates', candidateRoutes);

// Route for file uploads
app.post('/upload', uploadFile);

// Route to get candidates by position
app.use('/positions', positionRoutes);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Use the PORT environment variable if provided, otherwise default to 3010 for dev and 3011 for test
const defaultPort = process.env.NODE_ENV === 'test' ? 3011 : 3010;
const port = process.env.PORT || defaultPort;

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500).send('Something broke!');
});

// Start the server with database information for visibility
const startServer = async () => {
  try {
    const result = await prisma.$queryRaw`SELECT current_database() as db_name`;
    const dbName = (result as any)[0].db_name;
    console.log(`Using database: ${dbName}`);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error getting database information:', error);
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  }
};

// Ensure proper cleanup on application termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

startServer();
