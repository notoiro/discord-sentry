# Discord Sentry

指定されたDiscordユーザーのオンライン/オフライン状態を監視し、特定のチャンネルに通知を送信するDiscord Botです。

## 機能

-   監視対象のユーザーがオフラインになると、指定したチャンネルにメンション付きで通知します。
-   ユーザーがオンラインに復帰すると、オフラインだった時間を計算して通知し、最初のアラートメッセージを削除します。

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
