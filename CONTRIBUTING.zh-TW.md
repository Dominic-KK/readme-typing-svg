## 參與貢獻（Contributing）

歡迎貢獻！如果你有辦法改進這個專案，歡迎提出 Issue 或提交 Pull Request。

請確保你的請求是有意義的，並且在提交 Pull Request 之前已經對應用程式做了本地測試。

### 安裝依賴（Installing Requirements）

#### 依賴需求（Requirements）

- [PHP 8.1+](https://www.apachefriends.org/index.html)
- [Composer](https://getcomposer.org)

#### Linux

```bash
sudo apt-get install php
sudo apt-get install php-curl
sudo apt-get install composer
```

#### macOS

使用 [Homebrew](https://brew.sh)：

```bash
brew install php
brew install composer
```

macOS 上的 PHP 通常內建 curl 擴充功能。如果需要啟用它，請確保 `php.ini` 中的 `extension=curl` 沒有被註解（執行 `php --ini` 可以找到你的設定檔）。

#### Windows

從 [XAMPP](https://www.apachefriends.org/index.html) 或 [php.net](https://windows.php.net/download) 安裝 PHP

[▶ 如何在 Windows 上使用 XAMPP 安裝並執行 PHP](https://www.youtube.com/watch?v=K-qXW9ymeYQ)

[📥 下載 Composer](https://getcomposer.org/download/)

### 克隆儲存庫

```
git clone https://github.com/DenverCoder1/readme-typing-svg.git
cd readme-typing-svg
```

### 在本地執行應用程式

```bash
composer start
```

開啟 http://localhost:8000/ 並加入參數，即可在本地執行專案。

### 執行測試

在執行測試之前，必須先安裝 PHPUnit。你可以透過執行以下命令使用 Composer 安裝它。

```bash
composer install
```

### 格式化並測試程式碼

執行以下命令使用 Prettier 格式化程式碼：

```
composer run format
```

執行以下命令檢查你的程式碼是否格式正確：

```
composer run format:check
```

> **注意** 你需要全域安裝 [`prettier`](https://prettier.io/) 和 [prettier-php 外掛](https://github.com/prettier/plugin-php)，才能執行此命令。

執行以下命令執行 PHPUnit 測試腳本，該腳本會驗證被測試的功能是否仍然正常運作。

```bash
composer test
```