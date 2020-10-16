document.addEventListener('DOMContentLoaded', function() {

    const queue = new jiggly.Queue();

    const rect = document.querySelector('rect');
    queue.rotation(rect, 2000);
    queue.start();

    setInterval(() => { queue.tick((new Date()).getTime()) }, 100);
});