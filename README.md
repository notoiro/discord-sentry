# Discord Sentry

指定されたDiscordユーザーのオンライン/オフライン状態を監視し、特定のチャンネルに通知を送信するDiscord Botです。

## 機能

-   監視対象のユーザーがオフラインになると、指定したチャンネルにメンション付きで通知します。
-   ユーザーがオンラインに復帰すると、オフラインだった時間を計算して通知し、最初のアラートメッセージを削除します。
-   メンテナンス用のメンションミュートコマンド。
-   スラッシュコマンドで監視対象ユーザーの追加・削除・一覧表示ができます（サーバー管理者権限が必要）。
    -   `/target add user:@ユーザー` … 監視対象に追加
    -   `/target remove user:@ユーザー` … 監視対象から削除
    -   `/target list` … 現在の監視対象一覧を表示
    -   追加・削除した内容は `targets.json` に自動保存され、Bot再起動後も維持されます（初回起動時は`config.json`の`TARGET_IDS`が初期値として使われます）。

## 使い方

1.  **セットアップ**
    ```bash
    git clone https://github.com/notoiro/discord-sentry.git
    cd discord-sentry
    pnpm install
    ```

2.  **設定**
    `config.json` を作成し、あなたの環境に合わせて編集します。

    Discordでトークンを発行するときにPresence Intentを有効にしてください。

    ```json
    {
      "TOKEN": "YOUR_DISCORD_BOT_TOKEN",
      "CHANNEL_ID": "YOUR_CHANNEL_ID",
      "MENTION": "MENTION_ROLE_OR_USER_ID",
      "TARGET_IDS": ["USER_ID_1", "USER_ID_2"]
    }
    ```

4.  **起動**
    ```bash
    npm start
    ```

    Botはパーミッション`150528`で招待してください

## ライセンス

BSD-3
