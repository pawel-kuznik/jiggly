document.addEventListener('DOMContentLoaded', function() {

    const rect = document.querySelector('rect');

    const runner = new jiggly.Runner();

    runner.main
        .delayBy(1000)
        .rotateBy(rect, 120, 1000)
        .delayBy(500)
        .rotateBy(rect, 120, 1000)
        .delayBy(500)
        .rotateTo(rect, 180, 1000);

    runner.start();
});