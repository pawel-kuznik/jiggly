document.addEventListener('DOMContentLoaded', function() {

    const timeline = new jiggly.Timeline();

    const rect = document.querySelector('rect');
    timeline.delay(1000);
    timeline.rotation(rect, 180, 2000);
    timeline.start();

    setInterval(() => { timeline.tick((new Date()).getTime()) }, 100);
});