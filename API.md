# API

## 基本

- `JSON` でやりとり
- 成功した場合
	```
	{
		"status": "success",
		"result": "(処理結果色々)"
	}
	```
- 失敗した場合
	```
	{
		"status": "error",
		"result": "(失敗理由色々)"
	}
	```
- 認証はトークンにより行う
	- リクエストのcookieまたはヘッダに `X-Token` を追加

## エンドポイント

```
http://52.68.171.47/api
```

## ログイン関係


### ログインする(認証不要)

#### リクエスト

```
POST /auth/login
```

```
{
	"accessToken": "hogehoge", //Facebookのアクセストークン
	"userId": "1234567" //facebookにより発行されるユーザーID
}
```

#### レスポンス

```
{
	"token": "hugahuga" //このサービス内で利用するトークン。以降はこのトークンをリクエストに埋め込む
}
```

------

### ログアウトする(認証不要)

#### リクエスト

##### URL

```
GET /auth/logout
```

#### レスポンス

なし

## 動画関係

### ダウンロードする(認証不要)

#### リクエスト

##### URL

```
POST /video/:videoId
```

#### レスポンス

動画のバイナリデータ

------

## アップロードする(****認証が必要*****)

`Content-Type: multipart/form-data` でお願いします。

iOSは詳しくは[ここ](http://stackoverflow.com/questions/24250475/post-multipart-form-data-with-objective-c)

#### リクエスト

##### URL

```
POST /video
```

##### BODY

```
video=(動画のデータ)
```

#### レスポンス

```
{
	"videoId": "12345678" //保存されたvideoのID
}
```

------

## 削除する(****認証が必要*****)

#### リクエスト

##### URL

```
DELETE /video/:videoId
```

#### レスポンス

なし

------

## 動画一覧の取得

#### リクエスト

##### URL

```
GET /video/list?page=n
```

##### URLパラメータ

`n: ページ数`

#### レスポンス

```
{
	"max": 50,	//合計ページ数（総動画数ではない！）
	"current": 3, //現在のページ数。つまりリクエストの `page=n` と同じ。1からスタート
	"list": [{
		"videoId": "12345678",	//videoId
		"title": "videoのタイトル"
		"thumbnail": "http://hogehogehoge",	//サムネのURL
	}, {
		//繰り返し
	}]
}
```
