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

[serverless.ts](./serverless.ts) 内の `custom` オプションに色々と設定すると `serverless offline start` でサーバーを起動すると自動的に[DynamoDB](https://aws.amazon.com/jp/dynamodb/)のローカルサーバーも立ち上がります。

```typescript
const serverlessConfiguration: AWS = {
  custom: {
    dynamodb: {
      stages: ['dev'],
      start: {
        migrate: true,
        // inMemory: truemにすることでメモリ上で実行する事でデータを永続化しません。
        inMemory: true,
        // すでにlocalでDynamodbが起動している状態ならば
        // noStart: true と指定することで serverless offline startでdynamodbも一緒に立ち上がるようなことはありません
        //noStart: true
      },
    },
  }
}
```

ローカルで稼働中の[DynamoDB](https://aws.amazon.com/jp/dynamodb/)のポートは8000番に稼働します。
ポート番号の変更などはオプションで変更可能です。
オプションについての詳細は [Serverless DynamoDB Local](https://www.serverless.com/plugins/serverless-dynamodb-local/) または [Serverless DynamoDB Local](https://github.com/99x/serverless-dynamodb-local) を参照

【参考】
* [ServerlessFrameworkでDynamoDBLocalを使う](https://qiita.com/marchin_1989/items/1a5ad220bee030fef111)

#### dynamodb-admin

[DynamoDB](https://aws.amazon.com/jp/dynamodb/)の操作が簡単にできるツール [dynamodb-admin](https://github.com/aaronshaf/dynamodb-admin) を導入すると開発しやすくなります。

```
yarn add -D dynamodb-admin
```

で[dynamodb-admin](https://github.com/aaronshaf/dynamodb-admin)を導入します。
その後dynamodbが立ち上がっているときに

```
npx dynamodb-admin
あるいは -g コマンドでインストールしていれば
dynamodb-admin
```

コマンドを実行すると、D[DynamoDB](https://aws.amazon.com/jp/dynamodb/)のサーバーを参照して(デフォルトで立っている `8000`番ポートを参照して)8001番ポートにて [dynamodb-admin](https://github.com/aaronshaf/dynamodb-admin) が起動します。
[dynamodb-admin](https://github.com/aaronshaf/dynamodb-admin) が起動したら、 http://localhost:8001/ にアクセスすることで各種管理ツールのような操作をすることができます。

【参考】
* [DynamoDB Localの開発を便利にするdynamodb-adminを導入する](https://tech-broccoli.life/articles/engineer/add-dynamodb-admin-for-sls/)

#### serverless deploy

[DynamoDB](https://aws.amazon.com/jp/dynamodb/)のテーブル定義を [serverless.ts](./serverless.ts) 内の `resources` オプション内にテーブルの定義情報を指定していくことで[DynamoDB](https://aws.amazon.com/jp/dynamodb/)が起動したときに自動的にテーブルを作成してくれます。

```typescript
const serverlessConfiguration: AWS = {
  resources: {
    Resources: {
      resourcesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'resources',
          AttributeDefinitions: [
            {
              AttributeName: 'url',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'url',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
    },
  },
}
```

また上記のような設定を行っておくと `serverless deploy` コマンドを実行した場合、[DynamoDB](https://aws.amazon.com/jp/dynamodb/)の定義情報も自動的に反映されます。
反映されているかどうかはAWSコンソール側の[DynamoDB](https://aws.amazon.com/jp/dynamodb/)のテーブル情報からでも確認できます。
また `serverless remove` を実行するとここで作成された[DynamoDB](https://aws.amazon.com/jp/dynamodb/)のテーブルも自動的に削除されます。