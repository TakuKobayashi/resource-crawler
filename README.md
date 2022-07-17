# ResourceCrawlerApi

## 試してみたことのメモ

### ハッシュ値の算出

nodejsでハッシュ値の算出はデフォルトで挿入されている `crypto` ライブラリの `createHash` の関数を使って以下のようにすることで算出することができる

```typescript
import { createHash } from 'crypto';

createHash('sha256').update('test string').digest('hex')
```

上記では `sha256` を使ってハッシュ値を計算したが、その他の計算方法を用いても算出することができる。

(詳しくは [index.ts](./src/api/index.ts) の`crypttest` の部分を参照)

【参考】
* [【Node.js】文字列のハッシュ値を取得(SHA, MD5, RMD160)](https://qiita.com/koki_develop/items/174aefd8f894fea4d11a)

### Perceptual Hash 値の算出

#### Perceptual Hashとは?

Perceptual Hashとはマルチメディア（音声、画像、動画など）データ用のハッシュ値の1つ。通常のハッシュ値に加えて似ていると認識されるデータからは近い値が生成されるという特徴があるハッシュ値です

【参考】
* [Perceptual_hashing](https://en.wikipedia.org/wiki/Perceptual_hashing)
* [Perceptual Hashを使って画像の類似度を計算してみる](https://tech.unifa-e.com/entry/2017/11/27/111546)

#### 何らかのライブラリを用いてPerceptual Hashを算出してみる

[Jimp](https://github.com/oliver-moran/jimp) というnodejsで画像処理を行うライブラリでは画像からこのPerceptual Hashを算出できることが判明しました。
以下のようにすることで画像のPerceptual Hashを算出することができます。

```typescript
const jimpImg = await jimp.read("image file path")
// 2進数の文字列で取得できる
const pHash = jimpImg.pHash()
// 16真数に変換する場合はこうする
parseInt(pHash, 2).toString(16),
```


(詳しくは [index.ts](./src/api/index.ts) の`checkimage_hashes` の部分を参照)

### Dynamodb

#### Serverless Framework + Dynamodb local

まずはServerles DynamoDB local pluginの依存モジュールのインストールする

```
npm install -D serverless-dynamodb-local
```

次に、[serverless.ts](./serverless.ts) に `serverless-dynamodb-local` の plugin の指定を入れます。

```typescript
const serverlessConfiguration: AWS = {
  plugins: ['serverless-dynamodb-local'],
}
```

これで以下のコマンドを実行します

```
serverless dynamodb install
```

インストールが完了すると、 `.dynamodb` ディレクトリが作成され、jarなどが配置されます。

`serverless dynamodb start` のコマンドで、DynamoDB Localが起動します。

【参考】
* [ServerlessFrameworkでDynamoDBLocalを使う](https://qiita.com/marchin_1989/items/1a5ad220bee030fef111)
* [Serverless DynamoDB Local](https://www.serverless.com/plugins/serverless-dynamodb-local/)