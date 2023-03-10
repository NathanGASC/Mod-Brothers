import chokidar from 'chokidar';
import archiver from 'archiver';
import fs from "fs"
import logger from 'node-color-log';

const srcFolder = './src/';
const outputZip = './dist.zip';

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
function zipDirectory(sourceDir: string, outPath: string): Promise<any> {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);

    return new Promise<void>((resolve, reject) => {
        archive.directory(sourceDir, false).on('error', err => reject(err)).pipe(stream)
        stream.on('close', () => resolve());
        archive.finalize();
    });
}