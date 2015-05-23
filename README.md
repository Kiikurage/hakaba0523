#hakaba0523

とりあえず急ぎ作った簡易サーバー

## 使い方

1. 起動には、Node.js(またはio.js)とmongodbが必要。
2. cloneしたら `npm install` で必要なパッケージをインストール
3. `make db` でDB起動
4. `make` でサーバー起動
5. `http://localhost:3000` でつなげる、はず

## ファイル構成

- /bin サーバー実行ファイル
- /js フロントのjs
- /model サーバーのmodel定義
- /public フロントの静的ファイル
- /routes サーバーのルーティング定義
- /style フロントのスタイル類
- /views フロントのjadeファイル
- app.js アプリのエントリポイント
- Makefile 色々便利なものが定義されていると思う

## Makefileにあるもの

- `make`
	- HTTPサーバー起動
- `make db`
	- DBサーバー起動
- `make watch-js`
	- `/js` フォルダの変更を監視し、必要に応じてビルドを実行する
	- 要 `fswatch-run`
	- 要 `browserify`
- `make watch-style`
	- `/style` フォルダの変更を監視し、必要に応じてビルドを実行する
	- 要 `fswatch-run`
	- 要 `sass`
	- 要 `autoprefixer`
- `make build-js`
	- フロントのjsをビルドする
	- 要 `browserify`
- `make watch-style`
	- フロントのstyleをビルドする
	- 要 `sass`
	- 要 `autoprefixer`

## 必要な物が動かない/そもそもない！！

- Homebrew
```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
- Node
```bash
brew install nvm #Node Version Manager
. ~/.nvm/nvm.sh
nvm install v0.12
nvm alias default stable
```
- mongodb
```
brew install mongodb
```
- fswatch
```bash
brew install fswatch
```
- sass
```bash
sudo su -c "gem install sass"
```

## その他

### mongoDBがさっきまで走っていたのに走らなくなった

プロセスが二重起動している可能性あり。

```
ps -ef | grep mongod
```

怪しいプロセスを `kill`

## TODO

- 認証機構
	- User Model
	- Facebook API
- コメント機構
	- Comment Model
- UI
	- 実装方法決める

## MEMO

- [Facebook Login](https://developers.facebook.com/docs/facebook-login/login-flow-for-web/v2.3)
- [Express API](http://expressjs.com/4x/api.html)
- [Mongoose API](http://mongoosejs.com/docs/api.html)
