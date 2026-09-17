<?php declare(strict_types=1);

/**
 * 用于选择模型并渲染 SVG 输出的控制器
 */
class RendererController
{
    /**
     * @var RendererModel $model
     */
    private $model;

    /**
     * @var RendererView $view
     */
    private $view;

    /**
     * @var array<string, string> $params
     */
    private $params;

    /**
     * @var ResponseEnum $statusCode 响应状态码
     */
    private ResponseEnum $statusCode = ResponseEnum::HTTP_OK;

    /**
     * 构造 RendererController
     *
     * @param array<string, string> $params 请求参数
     */
    public function __construct(array $params)
    {
        $this->params = $params;

        // 设置模型和视图
        try {
            // 创建渲染器模型
            $this->model = new RendererModel(__DIR__ . "/../templates/main.php", $params);
            // 创建渲染器视图
            $this->view = new RendererView($this->model);
        } catch (Exception $error) {
            // 创建错误渲染模型
            $this->model = new ErrorModel(__DIR__ . "/../templates/error.php", $error->getMessage());
            // 创建错误渲染视图
            $this->view = new ErrorView($this->model);

            // 设置状态码
            $this->statusCode =
                $error instanceof IStatusException ? $error->getStatus() : ResponseEnum::HTTP_INTERNAL_SERVER_ERROR;
        }
    }

    /**
     * 重定向到演示站点
     */
    private function redirectToDemo(): void
    {
        header("Location: demo/");
        exit();
    }

    /**
     * 为页面输出设置内容类型
     */
    private function setContentType($type): void
    {
        header("Content-type: {$type}");
    }

    /**
     * 设置缓存以定期刷新
     * 这可确保任何更新都会同步到所有配置文件中
     */
    private function setCacheRefreshDaily(): void
    {
        // 将缓存设置为每天刷新一次
        $timestamp = gmdate("D, d M Y 23:59:00") . " GMT";
        header("Expires: $timestamp");
        header("Last-Modified: $timestamp");
        header("Pragma: no-cache");
        header("Cache-Control: no-cache, must-revalidate");
    }

    /**
     * 设置输出响应头
     */
    public function setHeaders(): void
    {
        // 若没有提供文本则重定向到演示站点
        if (!isset($this->params["lines"])) {
            $this->redirectToDemo();
        }

        // 设置内容类型响应头
        $this->setContentType("image/svg+xml");

        // 设置缓存响应头
        $this->setCacheRefreshDaily();

        // 设置状态码
        http_response_code($this->statusCode->value);
    }

    /**
     * 获取渲染后的 SVG
     *
     * @return string 要输出的 SVG
     */
    public function render(): string
    {
        return $this->view->render();
    }
}
