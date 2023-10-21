# オリジナル必殺技対戦

## DB構造
検討中
- 必殺技DB
    - id（主キー）
    - line-user-id : ユーザID（外部キー的なの）
    - name
    - furigana
    - heading
    - description
    - picture
    - battle-count
    - win-count
    - lose-count
- ユーザDB ユーザ:必殺技が1:多の関係。
    - line-user-id（主キー）

- ギャラリー必殺技
    - id（主キー）
    - line-user-id（外部キー）
    - specialmove-id（外部キー）

- マイデッキ必殺技 ユーザが持てるデッキは最大5枚
    - id（主キー）
    - line-user-id（外部キー）
    - specialmove-id（外部キー）


- マイデッキDB 微妙？
    - line-user-id
    - 必殺技ID1
    - 必殺技ID2
    - 必殺技ID3
    - 必殺技ID4
    - 必殺技ID5

## API概要
- 必殺技保存API（POST）
    - 必殺技を保存する。
    - 必殺技登録フォームに入力された内容をDBに保存する。
    - DB保存時に主キーとして必殺技のIDが採番される。
    - 必殺技ギャラリーDBにも保存をする。
- 必殺技リスト取得API（GET）
    - 対戦に表示するために全必殺技を取得。
    - アプリが大きくなると取得時の速度の話などが出てくるだろうがとりあえずは考慮しない。
- 対戦結果反映API（PUT）
    - 対戦にて敗北したら動く。
    - 敗北した必殺技のID情報と、対戦結果を送り、DBに更新を掛ける。
    - リクエストが非常に多くなるのが懸念。
- 必殺技お気に入りAPI（POST）
    - オンライン対戦にて、GETを押したら発動
    - ギャラリー必殺技に保存する。
- 必殺技ギャラリーAPI（GET）



## API詳細

- 必殺技保存API
    - [リクエスト]
    - name : 必殺技名
    - furigana : フリガナ
        - 変幻自在の愛（バンジーガム）のような特殊な読み方の場合に登録。
        - 難しい漢字に使うとかではない点に注意
    - heading : 一言見出し
    - description : 必殺技詳細
    - picture : 画像
        - 画像はbase64エンコードしてDBに保存。取得時にデコードする。
    - [レスポンス]
    - なし
- 必殺技リスト取得API
    - [リクエスト]
    - なし
    - [レスポンス]
    - 以下内容の配列
        - id : 必殺技のID
        - name : 必殺技名
        - furigana : フリガナ
        - heading : 一言見出し
        - description : 必殺技詳細
        - picture : 画像
            - 取得後フロント側でbase64デコードを行う。
- 対戦結果反映API
    - [リクエスト]
    - id : 必殺技のID
    - winCount : 勝利数
    - loseCount : 敗北数（1固定）
    - battleCount : 総対戦数（勝利数＋敗北数）
    - [レスポンス]
    - なし
- 必殺技お気に入りAPI
    - [リクエスト]
    - id : 必殺技のID
    - line-user-id : 自分のID
    - [レスポンス]
    - なし

- 必殺技ギャラリーAPI

    