
function webPage(){
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <title>Page Title</title>
    </head>
    <body>

    <h1>어쩔티비~</h1>
    <p>혼쭐내자!</p>
    <p>
        저쩔 <input type="text" id="revenge" value="티비" />
        <input type="button" id="submit" value="반격">
        <script>
            var submit = document.getElementById("submit");
            submit.addEventListener('click', ()=>{
                fetch('/uzzultibi?first='+document.getElementById('revenge').value+'&second=당근')
                .then((response) => {
                    ratio = response.json();
                    console.log(ratio);
                });
            })
        </script>
    
    </p>

    </body>
    </html>
    `
}

module.exports = {
    webPage:webPage
}
