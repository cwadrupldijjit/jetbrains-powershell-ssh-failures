import { join } from 'node:path';
import { fluvial, Request, Response, serveFile, preparePlainTextPayload } from 'fluvial';
import { cors } from '@fluvial/cors';
import { csp } from '@fluvial/csp';
import knex from 'knex';
import { development as developmentDbConfig } from './knexfile.js';

const app = fluvial({
    ssl: {
        certificatePath: join(import.meta.dirname, '.cert', 'cert.pem'),
        keyPath: join(import.meta.dirname, '.cert', 'key.pem'),
    },
});

app.use(cors());
app.use(csp());
app.use(preparePlainTextPayload());

const db = knex(developmentDbConfig);

if (!await db.schema.hasTable('messages')) {
    await db.schema.createTable('messages', (tableBuilder) => {
        tableBuilder.increments('id', { primaryKey: true });
        tableBuilder.text('contents').notNullable();
        tableBuilder.datetime('sent').defaultTo(() => new Date());
    });
}

app.use((req: Request, res: Response) => {
    console.log(`${req.method} to ${req.path}`);
    
    return 'next' as const;
});

app.get('/messages', async (req, res) => {
    const currentMessages = await db('messages')
        .orderBy('id', 'desc')
        .limit(300);
    
    await res.send(currentMessages);
});

app.post('/messages', async (req, res) => {
    const contents = req.payload as string;
    
    const [ newMessage ] = await db('messages')
        .insert({ contents }, '*');
    
    await res.status(201).send(newMessage);
});

app.get(/.*/, serveFile(join(import.meta.dirname, 'index.html')));

app.listen(3875, () => {
    console.log('Listening for connections on port 3875');
});
