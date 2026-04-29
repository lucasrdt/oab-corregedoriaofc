console.log('[Debug] SCRIPT DEBUG LOADED');
alert('Debug Script Loaded');
const root = document.getElementById('root');
if (root) {
    root.innerHTML = '<h1 style="color: green">DEBUG SCRIPT IS RUNNING</h1>';
}
