function buildIndexHTML() {
    let query = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="styles.css" />
        <title>GraphQL Designer Templete</title>
    </head>
    <body>
        <div id="app"></div>
        <script src="main.js"></script>
    </body>
</html>
`;
    return query;
}
  
module.exports = buildIndexHTML;