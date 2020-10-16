document.addEventListener('DOMContentLoaded', function() {

    const rect = document.querySelector('rect');

    const runner = new jiggly.Runner();

    runner.main.delay(1000);
    runner.main.rotation(rect, 180, 2000);

    runner.start();
});