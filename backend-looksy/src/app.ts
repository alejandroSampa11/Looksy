import express from "express";
import cors from "cors";
import routes from "./routes";
import { connectDB } from "./config/db";
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from "path";

process.on('uncaughtException', (error) => {
  console.error('⚠️ Uncaught exception', error.message);
  console.error(error.stack)
})

const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'Item API with Swagger and Express',
    },
    components: {
      schemas: {
        Item: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665aa1d199a7f99ddab6b123' },
            nombre: { type: 'string', example: 'Camisa Blanca' },
            categoria: { type: 'number', example: 1 },
            precio: { type: 'number', example: 499.99 },
            stock: { type: 'number', example: 10 },
            descripcion: { type: 'string', example: 'Camisa formal de algodón blanco' },
            urlImage: { type: 'string', example: 'https://example.com/camisa.jpg' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // ajusta si es necesario
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use(errorHandler)

const PORT = process.env.PORT || 1000;

const startServer = async () => {
  try {
    await connectDB();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (error: any) => {
      console.error('⚠️ Uncaught exception', error.message);
      console.error(error.stack)
    })
  } catch (error: any) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer()


export default app;
