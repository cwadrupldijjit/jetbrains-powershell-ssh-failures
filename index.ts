import { join } from 'node:path';
import { fluvial, Request, Response, serveFile, preparePlainTextPayload, deserializeJsonPayload } from 'fluvial';
import { cors } from '@fluvial/cors';
import { csp } from '@fluvial/csp';
import knex, { Knex } from 'knex';
import { development as developmentDbConfig } from './knexfile.js';

const app = fluvial({
    ssl: {
        certificatePath: join(import.meta.dirname, '.cert', 'cert.pem'),
        keyPath: join(import.meta.dirname, '.cert', 'key.pem'),
    },
});

app.use(cors());
app.use(csp({
    directives: {
        'script-src': [ 'self', 'unsafe-inline' ]
    }
}));
app.use(deserializeJsonPayload());

const db = knex(developmentDbConfig);

if (!await db.schema.hasTable('messages')) {
    await db.schema.createTable('messages', (tableBuilder) => {
        tableBuilder.increments('id', { primaryKey: true });
        tableBuilder.text('contents').notNullable();
        tableBuilder.datetime('sent').notNullable();
    });
}

app.use((req: Request, res: Response) => {
    console.log(`${req.method} to ${req.path}`);
    
    return 'next' as const;
});

app.get('/messages', async (req, res) => {
    const currentMessages = await db<Message>('messages')
        .orderBy('id', 'desc')
        .limit(300);
    
    await res.send(currentMessages.map(formatMessage));
});

app.post('/messages', async (req, res) => {
    const { contents } = req.payload;
    
    const [ newMessage ] = await db<Message>('messages')
        .insert({ contents, sent: new Date() }, '*');
    // what am I getting here?  I thought it was a message...
    console.log('newMessage', newMessage);
    newMessage.sent = new Date(newMessage.sent);
    await res.status(201).send(formatMessage(newMessage));
});

app.get(/.*/, serveFile(join(import.meta.dirname, 'index.html')));

app.listen(3785, () => {
    console.log('Listening for connections on port 3785');
});

function formatMessage(message: Message) {
    return {
        ...message,
        sent: message.sent.toISOString(),
    }
}

interface Message {
    id: number;
    contents: string;
    sent: Date;
}
