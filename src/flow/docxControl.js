import Control from "control/Control";
import ApiConnectModel from "fragment/ApiConnect";
import ApiManageModel from "fragment/ApiManage";

import FileSaver from 'file-saver';

// 前端不生成docx

export default class DocxControl extends Control {
    frame() {
        return {
            apiManage: ApiManageModel.name,
            apiDoc: ApiConnectModel.name,
        }
    }

    err = null;

    handleErr(err) {
        this.err = err;
        console.error(err);
        return Promise.resolve();
    }
    checkErr() {
        return this.err !== null;
    }

    async onClickSave() {
        // console.log('onClickSave')

        const apiDocModel = this.fetchModel('apiDoc');
        const docJson = apiDocModel.getState('docJson');

        // console.log('docJson', docJson)
        // docJson.tags


        // const blob = await this.generateDocSample().catch(this.handleErr);
        // const blob = await this.generateTableSample().catch(this.handleErr);
        // if (this.checkErr()) return;

        // const fileName = this.fetchModel('apiManage').getState('fileName');
        // await this.saveFile(blob, `${fileName}.docx`).catch(this.handleErr);
        // if (this.checkErr()) return;
    }

    generateTableSample() {

        // const table = new Table({
        //     rows: [
        //         new TableRow({
        //             children: [
        //                 new TableCell({
        //                     children: [new Paragraph("hello")],
        //                 }),
        //             ],
        //         }),
        //     ],
        // });

        // const doc = new Document({
        //     sections: [{
        //         children: [table],
        //     }],
        // });

        // const doc = new Document({
        //     title: "Title",
        //     externalStyles: styles,
        //     sections: [
        //         {
        //             children: [
        //                 new Paragraph({
        //                     text: "Cool Heading Text",
        //                     heading: HeadingLevel.HEADING_1,
        //                 }),
        //                 new Paragraph({
        //                     text: 'This is a custom named style from the template "MyFancyStyle"',
        //                     style: "MyFancyStyle",
        //                 }),
        //                 new Paragraph("Some normal text"),
        //                 new Paragraph({
        //                     text: "MyFancyStyle again",
        //                     style: "MyFancyStyle",
        //                 }),
        //             ],
        //         },
        //     ],
        // });

        /*

        const table3 = new Table({
            width: {
                size: '4535pt',
                type: WidthType.DXA,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Hello")],
                        }),
                        new TableCell({
                            children: [],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [],
                        }),
                        new TableCell({
                            children: [new Paragraph("World")],
                        }),
                    ],
                }),
            ],
        });

        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({ text: "Table with skewed widths" }),
                        table3,
                    ],
                },
            ],
        });
        */

        // console.log('doc', doc)

        // return Packer.toBlob(doc); // <Promise>
    }

    // 範例
    generateDocSample() {
        // // console.log('docx Document', Document)
        // const doc = new Document({
        //     sections: [
        //         {
        //             properties: {},
        //             children: [
        //                 new Paragraph({
        //                     children: [
        //                         new TextRun("Hello World"),
        //                         new TextRun({
        //                             text: "Thomas Wang",
        //                             bold: true
        //                         }),
        //                         new TextRun({
        //                             text: "\tGitLab is better",
        //                             bold: true
        //                         })
        //                     ]
        //                 })
        //             ]
        //         }
        //     ]
        // });

        // return Packer.toBlob(doc); // <Promise>
        // .then((blob) => {
        //     // console.log(blob);
        //     FileSaver.saveAs(blob, "example.docx");
        //     console.log("Document created successfully");
        // });
    }

    saveFile(blob, fileFullName) {
        FileSaver.saveAs(blob, fileFullName);
        console.log(`saveFile: Document ${fileFullName} has been saved!`);

        return Promise.resolve();
        // https://www.npmjs.com/package/file-saver

        // 文字檔
        // var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
        // FileSaver.saveAs(blob, "hello world.txt");

        // 儲存canvas快照
        // var canvas = document.getElementById("my-canvas");
        // canvas.toBlob(function(blob) {
        //     saveAs(blob, "pretty image.png");
        // });
    }
}