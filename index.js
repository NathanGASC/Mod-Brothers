const chokidar = require('chokidar');
const archiver = require('archiver');
const fs = require('fs');
const logger = require('node-color-log');
const args = require('args');

args
  .option('output', 'Give the path to where you want to find the zip output of your mod', "./dist.zip")
  .option('src', 'Give the path to the source folder', "./src/")

const flags = args.parse(process.argv)

let srcFolder = '';
let outputZip = '';
if (flags.output) {
    outputZip = flags.output
}
if (flags.src) {
    srcFolder = flags.src
}

logger.info("source : ",srcFolder)
logger.info("output : ",outputZip)

chokidar.watch(srcFolder).on('change', async (event, path) => {
    console.clear();
    logger.info("file saved : ",event)

    const id = setInterval(()=>{
        logger.info("...")
    },3000)

    zipDirectory(srcFolder, outputZip)
    .then(()=>{
        clearInterval(id)
        logger.info("file zip ready")
    })
    .catch((err)=>{
        logger.error("an error appened : ", err)
    })
});

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        archive.directory(sourceDir, false).on('error', err => reject(err)).pipe(stream)
        stream.on('close', () => resolve());
        archive.finalize();
    });
}