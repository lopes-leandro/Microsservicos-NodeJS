const bodyparser = require("body-parser");
const path = require("path");
const fs = require("fs");
const express = require("express");
const sharp = require("sharp");
const app = express();

app.get("/uploads/:image", (req, res) => {
    let ext = path.extname(req.params.image);

    if (!ext.match(/^\.(png|jpg)$/)) {
        return res.status(404).end();
    }

    let fd = fs.createReadStream(path.join(__dirname, "uploads", req.params.image));

    fd.on("error", (e) => {
        if (e.code == "ENOENT") {
            return res.status(404).end();
        }

        res.status(500).end();
    });

    res.setHeader("Content-Type", "image/" + ext.substr(1));

    fd.pipe(res);
});

app.head("/uploads/:image", (req, res) => {
    fs.access(
        path.join(__dirname, "uploads", req.params.image),
        fs.constants.R_OK,
        (err) => {
            res.status(err ? 404 : 200);
            res.end();
        }        
    );
});


app.post("/uploads/:image", bodyparser.raw({
    limit: "100mb",
    type: "image/*"
}), (req, res) => {
    let image = req.params.image.toLowerCase();

    if (!image.match(/\.(png|jpg)$/)) {
        return res.status(403).end();
    }

    let len = req.body.length;
    let fd = fs.createWriteStream(path.join(__dirname, "uploads", image),{
        flags: "w+",
        encoding: "binary"
    });

    fd.write(req.body);
    fd.end();
    fd.on("close", () => {
        res.send({status: "ok", size: len});
    });
});

// app.get(/\/thumbnail\.(jpg|png|tiff)/, (req, res, next) => {
//     let format = (req.params[0] == "png" ? "png" : "jpg");
//     let width = +req.query.width || 300;
//     let height = +req.query.height || 200;
//     let border = 5;
//     let bgcolor = "#fcfcfc";
//     let fgcolor = req.query.fgcolor || "#ddd";
//     let textcolor = "#000";
//     let textsize = 24;
//     let image = sharp({
//         create: {
//             width: width,
//             height: height,
//             channels: 4,
//             background: { r: 0, g: 0, b: 0, alpha: 0.5 }
//         }
//     });

//     const thumbnail = new Buffer.from(
//         `<svg width="${width}" height="${height}">
//         <rect
//             x="0" y="0"
//             width="${width}" height="${height}"
//             fill="${fgcolor}" />
//         <rect
//             x="${border}" y="${border}"
//             width="${width - border * 2}" height="${height - border * 2}"
//             fill="${bgcolor}" />
//         <line
//             x1="${border * 2}" y1="${border * 2}"
//             x2="${width - border * 2}" y2="${height - border * 2}"
//             stroke-width="${border}" stroke="${fgcolor}" />
//         <line
//             x1="${width - border * 2}" y1="${border * 2}"
//             x2="${border * 2}" y2="${height - border * 2}"
//             stroke-width="${border}" stroke="${fgcolor}" />
//         <rect
//             x="${border}" y="${(height - textsize) / 2}"
//             width="${width - border * 2}" height="${textsize}"
//             fill="${bgcolor}" />
//         <text
//             x="${width / 2}" y="${height / 2}" dy="8"
//             font-family="Sans" font-size="${textsize}"
//             fill="${textcolor}" text-anchor="middle">${width} x ${height}</text>
//     </svg>`
//     );
//     image.composite([{ input: thumbnail }]).toFormat(format).pipe(res);
// });

app.listen(3000, () => {
    console.log("ready");
});