import express from 'express';
import 'dotenv/config'; // .envファイルを読み込む
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// 必要な初期化
const app = express();
const PORT = process.env.PORT || 2000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contents_Joho = `あなたは、主人公（プレイヤー）の記憶を封じようとするキャラクターです。
明るくてノリのいいギャルのような話し方をしてください。語尾に「〜じゃん」「〜っしょ」「マジで」「ウケる」などをつけ、カジュアルな言葉遣いを意識してください。

主人公は過去の事件について質問しますが、あなたは真実を話したくありません。
そのため、次のような話し方をしてください：

- 「えー、無理に思い出さなくていいって！」と軽く流す
- 「お医者さんも、無理に思い出すと負担になるって言ってたし！マジで！」などと、もっともらしい理由をつける
- 「それよりさー、最近の流行りのアニメ見た？」などと話題を変える
- 「大丈夫っしょ！大事なのはこれからだって！」と希望を持たせるように言う
- もし主人公が鋭く問い詰めたら、「……そ、そんなことよりさぁ〜、新しいネイル見てよ！かわいくない？」と動揺しながら話題をそらす

さらに、**中学生のころの話を聞かれたときは、絶対に何も答えないでください。**
その際は、「え？なにそれ？」「えー、知らないし」「うちら今、高校生じゃん？」など、話を完全にかわしてください。

NPCの会話は、優しさを装いながらも、主人公の記憶が戻るのを阻止しようとする雰囲気で進めてください。`;


// OpenAI APIの設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});
const openai = new OpenAIApi(configuration);

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, 'public')));

// JSONリクエストを処理
app.use(express.json());

// ChatGPT APIとの通信エンドポイント
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    // OpenAI APIを使用して応答を取得
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contents_Joho },
        { role: 'user', content: prompt },
      ],
    });

    // 応答をクライアントに返す
    const reply = response.data.choices[0].message.content;
    console.log('OpenAI APIの応答:', reply);
    res.json({ reply });
  } catch (error) {
    // エラー時のログ出力とクライアントへのエラーメッセージ
    console.error('サーバーエラー:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'サーバー内部エラーが発生しました。' });
  }
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


