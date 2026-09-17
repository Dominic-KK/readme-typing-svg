<!-- 用于渲染打字 SVG 的模板，参考：https://github.com/Dominic-KK/readme-typing-svg/ -->
<svg xmlns='http://www.w3.org/2000/svg'
    xmlns:xlink='http://www.w3.org/1999/xlink'
    viewBox='0 0 <?= "$width $height" ?>'
    style='background-color: <?= $background ?>;'
    width='<?= $width ?>px' height='<?= $height ?>px'>

    <?= $fontCSS ?>

    <?php $lastLineIndex = count($lines) - 1; ?>
    <?php for ($i = 0; $i <= $lastLineIndex; ++$i): ?>
        <path id='path<?= $i ?>'>
            <?php if (!$multiline): ?>
                <!-- 单行模式 -->
                <?php
                // 从上一行结束处开始
                $begin = "d" . ($i - 1) . ".end";
                if ($i == 0) {
                    // 若为第一行，则从 0 秒开始，
                    // 若 repeat 为 true，则也在最后一行结束后开始
                    $begin = $repeat ? "0s;d$lastLineIndex.end" : "0s";
                }
                // 若 repeat 为 false，则在打完最后一行后不删除文本
                $freeze = !$repeat && $i == $lastLineIndex;
                // 空行值
                $yOffset = $height / 2;
                $emptyLine = "m0,$yOffset h0";
                $fullLine = "m0,$yOffset h$width";
                $values = [$emptyLine, $fullLine, $fullLine, $freeze ? $fullLine : $emptyLine];
                // 动画的关键时间点
                $keyTimes = [
                    "0",
                    (0.8 * $duration) / ($duration + $pause),
                    (0.8 * $duration + $pause) / ($duration + $pause),
                    "1",
                ];
                ?>
                <animate id='d<?= $i ?>' attributeName='d' begin='<?= $begin ?>'
                    dur='<?= $duration + $pause ?>ms' fill='<?= $freeze ? "freeze" : "remove" ?>'
                    values='<?= implode(" ; ", $values) ?>' keyTimes='<?= implode(";", $keyTimes) ?>' />
            <?php else: ?>
                <!-- 多行模式 -->
                <?php
                $nextIndex = $i + 1;
                $lineHeight = $size + 5;
                $lineDuration = ($duration + $pause) * $nextIndex;
                $yOffset = $nextIndex * $lineHeight;
                $emptyLine = "m0,$yOffset h0";
                $fullLine = "m0,$yOffset h$width";
                $values = [$emptyLine, $emptyLine, $fullLine, $fullLine];
                $keyTimes = ["0", $i / $nextIndex, $i / $nextIndex + $duration / $lineDuration, "1"];
                ?>
                <animate id='d<?= $i ?>' attributeName='d' begin='0s<?= $repeat ? ";d$lastLineIndex.end" : "" ?>'
                    dur='<?= $lineDuration ?>ms' fill="freeze"
                    values='<?= implode(" ; ", $values) ?>' keyTimes='<?= implode(";", $keyTimes) ?>' />
            <?php endif; ?>
        </path>
    <text font-family='"<?= $font ?>", monospace' fill='<?= $color ?>' font-size='<?= $size ?>'
        dominant-baseline='<?= $vCenter ? "middle" : "auto" ?>'
        x='<?= $center ? "50%" : "0%" ?>' text-anchor='<?= $center ? "middle" : "start" ?>'
        letter-spacing='<?= $letterSpacing ?>'>
        <textPath xlink:href='#path<?= $i ?>'>
            <?= $lines[$i] . "\n" ?>
        </textPath>
    </text>
<?php endfor; ?>
</svg>
