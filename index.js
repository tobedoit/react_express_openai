import express from 'express'
import cors from 'cors'
import env from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

/* https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
** es6 에서 __dirname not defined! only commonjs에서만 */
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
env.config()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')));

// configure openai api
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

/* https://codingapple.com/unit/nodejs-react-integration/?id=2305
** 리액트 라우터가 핸들링 하도록 */
app.get('*', async(req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})
app.post('/', async (req, res) => {
  const { message } = req.body
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: message,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    res.json({ message : response.data.choices[0].text })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

const port = process.env.PORT || 3080;
app.listen(port, () => console.log("listening on port 3080"))