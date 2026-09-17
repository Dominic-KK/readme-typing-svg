## 参与贡献（Contributing）

欢迎贡献！如果你有办法改进这个项目，欢迎提交 Issue 或提交 Pull Request。

请确保你的请求是有意义的，并且在提交 Pull Request 之前已经对应用做了本地测试。

### 安装依赖（Installing Requirements）

#### 依赖要求（Requirements）

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

macOS 上的 PHP 通常自带 curl 扩展。如果需要启用它，请确保 `php.ini` 中的 `extension=curl` 没有被注释（运行 `php --ini` 可以找到你的配置文件）。

#### Windows

从 [XAMPP](https://www.apachefriends.org/index.html) 或 [php.net](https://windows.php.net/download) 安装 PHP

[▶ 如何在 Windows 上使用 XAMPP 安装并运行 PHP](https://www.youtube.com/watch?v=K-qXW9ymeYQ)

[📥 下载 Composer](https://getcomposer.org/download/)

### 克隆仓库

```
git clone https://github.com/Dominic-KK/readme-typing-svg.git
cd readme-typing-svg
```

### 在本地运行应用

```bash
composer start
```

打开 http://localhost:8000/ 并添加参数，即可在本地运行项目。

### 运行测试

在运行测试之前，必须先安装 PHPUnit。你可以通过运行以下命令使用 Composer 安装它。

```bash
composer install
```

### 格式化并测试代码

运行以下命令使用 Prettier 格式化代码：

```
composer run format
```

运行以下命令检查你的代码是否格式正确：

```
composer run format:check
```

> **注意** 你需要全局安装 [`prettier`](https://prettier.io/) 和 [prettier-php 插件](https://github.com/prettier/plugin-php)，才能运行此命令。

运行以下命令执行 PHPUnit 测试脚本，该脚本会验证被测试的功能是否仍然正常工作。

```bash
composer test
```