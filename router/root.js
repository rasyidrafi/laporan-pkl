const router = require("express").Router();
let PizZip = require("pizzip");
let Docxtemplater = require("docxtemplater");
const fs = require('fs');
const path = require("path");

router.get("/", (req, res) => {
    res.render("pages/root");
});

router.post('/', (req, res) => {
    function replaceErrors(key, value) {
        if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function (error, key) {
                error[key] = value[key];
                return error;
            }, {});
        }
        return value;
    }

    function errorHandler(error) {
        console.log(JSON.stringify({ error: error }, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map(function (error) {
                return error.properties.explanation;
            }).join("\n");
            console.log('errorMessages', errorMessages);
            // errorMessages is a humanly readable message looking like this:
            // 'The tag beginning with "foobar" is unopened'
        }
        throw error;
    }

    let {
        nama_industri,
        jurusan_anda,
        kapro_jurusan_dan_gelar,
        nip_kapro_jurusan,
        guru_pembimbing_dan_gelar,
        nip_pembimbing,
        kepala_sekolah_dan_gelar,
        nip_kepala_sekolah,
        tanggal_laporan_dibuat,
        pembimbing_industri,
        direktur_kepala_industri,
        penyusun,
        list_siswa
    } = req.body;
    if (typeof penyusun == "string") penyusun = [penyusun];
    penyusun = penyusun.map(item => {
        var split = ""
        if (!item.includes("-")) split = item + "-";
        split = item.split("-");
        return {
            name: split[0].trim(),
            jurusan: split[1].trim()
        }
    });

    list_siswa = list_siswa.replace(/\r, /g, "");
    var splitSiswa = ""
    if (!list_siswa.includes("\n")) splitSiswa = list_siswa + "\n";
    splitSiswa = list_siswa.split("\n");

    list_siswa = splitSiswa.map(item => {
        var split = ""
        if (!item.includes("-")) split = item + "-";
        split = item.split("-");
        return {
            name: split[0].trim(),
            jurusan: split[1].trim()
        }
    });

    // Load the docx file as binary content
    var content = fs
        .readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

    var zip = new PizZip(content);
    var doc;
    try {
        doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    } catch (error) {
        // Catch compilation errors (errors caused by the compilation of the template: misplaced tags)
        errorHandler(error);
    }

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render({
            nama_industri,
            penyusun,
            list_siswa,
            jurusan_anda,
            kapro_jurusan_dan_gelar,
            nip_kapro_jurusan,
            guru_pembimbing_dan_gelar,
            nip_pembimbing,
            kepala_sekolah_dan_gelar,
            nip_kepala_sekolah,
            pembimbing_industri,
            nip_pembimbing_industri: "",
            direktur_kepala_industri,
            nip_direktur: "",
            tanggal_laporan_dibuat
        })
    }
    catch (error) {
        // Catch rendering errors (errors relating to the rendering of the template: angularParser throws an error)
        errorHandler(error);
    }

    var buf = doc.getZip()
        .generate({ type: 'nodebuffer' });

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);

    res.download(path.resolve(__dirname, 'output.docx'), "laporan.docx")

})

module.exports = router;