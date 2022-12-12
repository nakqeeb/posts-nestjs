/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from './../../posts.service';
import { Injectable, NotFoundException } from '@nestjs/common';
// import * as PDFDocument from 'pdfkit';
// import * as fs from 'fs';
const PDFDocument = require('pdfkit-table');
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PdfService {
  constructor(private postsService: PostsService) {}
  async generatePDF(user: User): Promise<Buffer> {
    const posts = await this.postsService.findAllPosts(user);
    if (!posts) {
      throw new NotFoundException('no posts found');
    }
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      this.generateHeader(doc);
      await this.generateContentTable(doc, posts);

      doc.end();
      // doc.pipe(fs.createWriteStream(path));
      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });
    return pdfBuffer;
  }

  generateHeader(doc) {
    doc
      .fillOpacity(0.15)
      .image('posts-logo.png', 50, 49, { scale: 0.4 })
      .moveDown();
  }

  async generateContentTable(doc, posts: Post[]) {
    const rows = [];
    // table
    const table = {
      // title: 'Mono Posts',
      title: { label: 'Mono Posts', fontSize: 30, color: 'green' },
      subtitle: `Created date: ${this.formatDate(new Date())}`,
      headers: ['ID', 'Title', 'Content', 'Approved', 'UserID'],
      rows: [],
    };

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      rows.push([
        post.id,
        post.title,
        post.content,
        post.approved,
        post.user.id,
      ]);
    }
    await doc.fillOpacity(1).table(
      { ...table, rows: rows },
      {
        columnsSize: [30, 100, 300, 50, 30],
        // width: 400,
        // x: 100,
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          // draw vertical line b/w the columns
          /* const { x, y, width, height } = rectCell;
          if (indexColumn === 0) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y)
              .lineTo(x, y + height)
              .stroke();
          }

          doc
            .lineWidth(0.5)
            .moveTo(x + width, y)
            .lineTo(x + width, y + height)
            .stroke(); */

          doc.font('Helvetica').fontSize(8);
          // console.log(rows[indexColumn][0]);
          indexColumn === 0 &&
            doc.addBackground({ ...rectRow, x: 480, width: 40 }, 'green', 0.15);
          indexColumn === 0 &&
            doc.addBackground({ ...rectRow, x: 50, width: 30 }, 'brown', 0.15);
        },
      },
    );
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }
}
