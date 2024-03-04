import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';

let tasks = [
    {
      "title": "Tarea 1: Reunión con el equipo",
      "date": "2024-03-07",
      "content": "Reunión con el equipo para discutir el proyecto X. 10:00 AM - 11:00 AM en la sala de conferencias."
    },
    {
      "title": "Tarea 2: Finalizar informe de ventas",
      "date": "2024-03-08",
      "content": "Completar el informe de ventas de febrero y enviarlo a la gerencia antes de las 5:00 PM."
    },
    {
      "title": "Tarea 3: Investigar nuevas estrategias de marketing",
      "date": "2024-03-09",
      "content": "Dedicar 2 horas a investigar nuevas estrategias de marketing para el producto Y. Compartir los hallazgos con el equipo en la próxima reunión."
    },
    {
      "title": "Tarea 4: Llamar a cliente potencial",
      "date": "2024-03-10",
      "content": "Llamar al cliente potencial Sr. López para discutir la propuesta de negocio. Agendar una reunión si es posible."
    },
    {
      "title": "Tarea 5: Asistir a taller de capacitación",
      "date": "2024-03-11",
      "content": "Asistir al taller de capacitación sobre software Z. 9:00 AM - 1:00 PM en el centro de convenciones."
    },
    {
      "title": "Tarea 6: Revisar y aprobar diseños",
      "date": "2024-03-12",
      "content": "Revisar los diseños finales para la campaña publicitaria y dar su aprobación antes del mediodía."
    },
    {
      "title": "Tarea 7: Preparar presentación para el cliente",
      "date": "2024-03-13",
      "content": "Preparar una presentación para el cliente sobre el nuevo producto. La presentación debe ser de 30 minutos y cubrir todos los aspectos relevantes."
    },
    {
      "title": "Tarea 8: Escribir artículo para blog",
      "date": "2024-03-14",
      "content": "Escribir un artículo para el blog de la empresa sobre las últimas tendencias en la industria. El artículo debe ser de 500 palabras y tener un tono informativo y atractivo."
    }
  ]

interface Task {
    title: string,
    date: string,
    content: string
}

const app = express();

const limit = rateLimit({
    limit: 6,
    windowMs: 60 * 60 * 1000,
    message: "Se ha alcanzdo el limite de IP's",
    statusCode: 429
});

app.use(cors({
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    origin: "*"
}));

app.use(express.json());

app.get('/', (req: Request, res: Response)=> {
    res.status(200).send('Hello world!');
});

app.get('/tasks', limit, (req: Request, res: Response) => {
    res.status(200).send(tasks);
});

app.post('/tasks', limit, (req: Request, res: Response) => {
    try {
        const newTask : Task  = req.body;
        tasks.push(newTask);
        return res.status(200).send(tasks);
    } catch (error) {
        return res.status(500).send('Error al crear la tarea');
    }
});

app.put('/tasks', limit, (req: Request, res: Response) => {
    try {
        const { title, date, content } = req.body;
        let task : any = tasks.find((task) => task.title === title);
        task.title = title;
        task.date = date;
        task.content = content;
        return res.status(200).send(tasks);
    } catch (error) {
        return res.status(500).send('Error al actualizar la tarea');
    }
});

app.delete('/tasks', limit, (req: Request, res: Response) => {
    try {
        const title = req.body.title;
        const updateTasks = tasks.filter((task) => task.title !== title);
        tasks = [...updateTasks];
        return res.status(200).send(tasks);
    } catch (error) {
        return res.status(500).send('Error al eliminar la tarea');
    }
})


app.listen(3000, () => {
    console.log('Server running at 3000');
});