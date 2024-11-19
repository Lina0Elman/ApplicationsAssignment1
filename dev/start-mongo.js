const { exec } = require('child_process');

exec('docker inspect mongo', (err, stdout, stderr) => {
    if (!err) {
        exec('docker rm -f mongo', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error removing container: ${stderr}`);
                process.exit(1);
            }
            startMongo();
        });
    } else {
        startMongo();
    }
});

function startMongo() {
    exec('docker run -d -p 27017:27017 --name mongo mongo', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error starting container: ${stderr}`);
            process.exit(1);
        }
        console.log('MongoDB container started');
    });
}